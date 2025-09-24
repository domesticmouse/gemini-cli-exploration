#!/usr/bin/env node

/*
    Copyright (c) 2025 Brett Morgan.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { FileSystem } from "./base/fs.js";
import { KicadPCB, KicadSch } from "./kicad/index.js";
import { ArcSegment, LineSegment } from "./kicad/board.js";
import { Project } from "./kicanvas/project.js";

const server = new McpServer({
  name: "kicad-file-mcp",
  version: "0.0.1-alpha",
  capabilities: { resources: {}, tools: {} },
});

let project: Project | undefined;

server.tool(
  "load_project",
  "Load KiCad files from a directory. The files will be parsed and stored in memory for analysis. This tool will load `.kicad_pro`, `.kicad_sch`, and `.kicad_pcb` files from the directory.",
  {
    path: z.string().describe("The path to the project directory."),
  },
  async ({ path }) => {
    const fs = new FileSystem(path);
    project = new Project();
    await project.load(fs);
    return { content: [{ type: "text", text: "Project loaded." }] };
  },
);

server.tool(
  "list_project_files",
  "List all files in the project loaded by `load_project`.",
  {},
  () => {
    if (!project) {
      return { content: [{ type: "text", text: "No project loaded. Please use `load_project` to load a project directory." }] };
    }
    const files = Array.from(project.files()).map((f) => f?.filename);
    return { content: [{ type: "text", text: files.join("\n") }] };
  },
);

server.tool(
  "get_project_info",
  "Get information about the loaded project.",
  {},
  () => {
    if (!project) {
      return { content: [{ type: "text", text: "No project loaded. Please use `load_project` to load a project directory." }] };
    }
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(project.settings, null, 2),
        },
      ],
    };
  },
);

server.tool(
  "analyze_schematic",
  "Analyze a schematic file.",
  {
    filename: z.string().describe("The filename of the schematic to analyze."),
  },
  ({ filename }) => {
    if (!project) {
      return { content: [{ type: "text", text: "No project loaded. Please use `load_project` to load a project directory." }] };
    }

    const file = project.file_by_name(filename);

    if (!file) {
      return {
        content: [{ type: "text", text: `File not found: ${filename}` }],
      };
    }

    if (!(file instanceof KicadSch)) {
      return {
        content: [
          { type: "text", text: `File is not a schematic: ${filename}` },
        ],
      };
    }

    const summary = {
      filename: file.filename,
      title_block: file.title_block,
      component_count: file.symbols.size,
      net_count:
        file.net_labels.length +
        file.global_labels.length +
        file.hierarchical_labels.length,
    };

    const message = `\n
This is a summary of the schematic file.
To get more details, you can use the following tools:
- \`list_components\`: to list all components in the project.
- \`find_nets\`: to find all named nets in this schematic.
- \`get_schematic_hierarchy\`: to see the sheet hierarchy.
`;

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(summary, null, 2) + message,
        },
      ],
    };
  },
);

server.tool(
  "list_components",
  "List all components in the project.",
  {},
  () => {
    if (!project) {
      return { content: [{ type: "text", text: "No project loaded. Please use `load_project` to load a project directory." }] };
    }

    const components: any[] = [];
    for (const schematic of project.schematics()) {
      for (const symbol of schematic.symbols.values()) {
        components.push({
          schematic: schematic.filename,
          uuid: symbol.uuid,
          lib_id: symbol.lib_id,
          reference: symbol.reference,
          value: symbol.value,
        });
      }
    }

    return {
      content: [
        { type: "text", text: JSON.stringify(components, null, 2) },
      ],
    };
  },
);

server.tool(
  "get_component_details",
  "Get detailed information about a specific component.",
  {
    uuid: z.string().describe("The UUID of the component to get details for."),
  },
  ({ uuid }) => {
    if (!project) {
      return { content: [{ type: "text", text: "No project loaded. Please use `load_project` to load a project directory." }] };
    }

    for (const schematic of project.schematics()) {
      for (const symbol of schematic.symbols.values()) {
        if (symbol.uuid === uuid) {
          const replacer = (key: string, value: any) => {
            if (key === "parent" || key.startsWith("_")) {
              return undefined;
            }
            if (value instanceof Map) {
              return Object.fromEntries(value.entries());
            }
            return value;
          };

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    schematic: schematic.filename,
                    uuid: symbol.uuid,
                    lib_id: symbol.lib_id,
                    reference: symbol.reference,
                    value: symbol.value,
                    footprint: symbol.footprint,
                    properties: Object.fromEntries(symbol.properties),
                  },
                  replacer,
                  2,
                ),
              },
            ],
          };
        }
      }
    }

    return {
      content: [
        { type: "text", text: `Component with UUID not found: ${uuid}` },
      ],
    };
  },
);

server.tool(
  "find_nets",
  "Find all named nets in a schematic.",
  {
    filename: z.string().describe("The filename of the schematic to search."),
  },
  ({ filename }) => {
    if (!project) {
      return { content: [{ type: "text", text: "No project loaded. Please use `load_project` to load a project directory." }] };
    }

    const file = project.file_by_name(filename);

    if (!file) {
      return {
        content: [{ type: "text", text: `File not found: ${filename}` }],
      };
    }

    if (!(file instanceof KicadSch)) {
      return {
        content: [
          { type: "text", text: `File is not a schematic: ${filename}` },
        ],
      };
    }

    const nets = [
      ...file.net_labels.map((l) => ({
        type: "net",
        name: l.text,
        at: l.at,
      })),
      ...file.global_labels.map((l) => ({
        type: "global",
        name: l.text,
        at: l.at,
      })),
      ...file.hierarchical_labels.map((l) => ({
        type: "hierarchical",
        name: l.text,
        at: l.at,
      })),
    ];

    return {
      content: [{ type: "text", text: JSON.stringify(nets, null, 2) }],
    };
  },
);

server.tool(
  "get_schematic_hierarchy",
  "Get the hierarchy of schematic sheets.",
  {},
  () => {
    if (!project) {
      return { content: [{ type: "text", text: "No project loaded. Please use `load_project` to load a project directory." }] };
    }

    const hierarchy = Array.from(project.pages()).map((p) => ({
      filename: p.filename,
      path: p.sheet_path,
      name: p.name,
      page: p.page,
    }));

    return {
      content: [{ type: "text", text: JSON.stringify(hierarchy, null, 2) }],
    };
  },
);

server.tool(
  "analyze_pcb",
  "Analyze a PCB file.",
  {
    filename: z.string().describe("The filename of the PCB to analyze."),
  },
  ({ filename }) => {
    if (!project) {
      return { content: [{ type: "text", text: "No project loaded. Please use `load_project` to load a project directory." }] };
    }

    const file = project.file_by_name(filename);

    if (!file) {
      return {
        content: [{ type: "text", text: `File not found: ${filename}` }],
      };
    }

    if (!(file instanceof KicadPCB)) {
      return {
        content: [{ type: "text", text: `File is not a PCB: ${filename}` }],
      };
    }

    const footprints = file.footprints.map((f) => ({
      uuid: f.uuid,
      reference: f.reference,
      value: f.value,
      library_link: f.library_link,
      at: f.at,
      layer: f.layer,
      pads: f.pads.map((p) => ({
        number: p.number,
        type: p.type,
        shape: p.shape,
        at: p.at,
        size: p.size,
        layers: p.layers,
      })),
    }));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              version: file.version,
              generator: file.generator,
              footprints,
            },
            null,
            2,
          ),
        },
      ],
    };
  },
);

server.tool(
  "list_footprints",
  "List all footprints in the project.",
  {},
  () => {
    if (!project) {
      return { content: [{ type: "text", text: "No project loaded. Please use `load_project` to load a project directory." }] };
    }

    const footprints: any[] = [];
    for (const pcb of project.boards()) {
      for (const footprint of pcb.footprints) {
        footprints.push({
          pcb: pcb.filename,
          uuid: footprint.uuid,
          reference: footprint.reference,
          value: footprint.value,
          library_link: footprint.library_link,
          at: footprint.at,
          layer: footprint.layer,
        });
      }
    }

    return {
      content: [
        { type: "text", text: JSON.stringify(footprints, null, 2) },
      ],
    };
  },
);

server.tool(
  "get_layer_info",
  "Get information about the layers in a PCB file.",
  {
    filename: z.string().describe("The filename of the PCB to analyze."),
  },
  ({ filename }) => {
    if (!project) {
      return { content: [{ type: "text", text: "No project loaded. Please use `load_project` to load a project directory." }] };
    }

    const file = project.file_by_name(filename);

    if (!file) {
      return {
        content: [{ type: "text", text: `File not found: ${filename}` }],
      };
    }

    if (!(file instanceof KicadPCB)) {
      return {
        content: [{ type: "text", text: `File is not a PCB: ${filename}` }],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(file.layers, null, 2),
        },
      ],
    };
  },
);

server.tool(
  "find_vias_tracks",
  "Find all vias and tracks in a PCB file.",
  {
    filename: z.string().describe("The filename of the PCB to analyze."),
  },
  ({ filename }) => {
    if (!project) {
      return { content: [{ type: "text", text: "No project loaded. Please use `load_project` to load a project directory." }] };
    }

    const file = project.file_by_name(filename);

    if (!file) {
      return {
        content: [{ type: "text", text: `File not found: ${filename}` }],
      };
    }

    if (!(file instanceof KicadPCB)) {
      return {
        content: [{ type: "text", text: `File is not a PCB: ${filename}` }],
      };
    }

    const vias = file.vias.map((v) => ({
      at: v.at,
      size: v.size,
      drill: v.drill,
      layers: v.layers,
      net: v.net,
    }));

    const tracks = file.segments.map((t: LineSegment | ArcSegment) => ({
      start: t.start,
      end: t.end,
      width: t.width,
      layer: t.layer,
      net: t.net,
    }));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ vias, tracks }, null, 2),
        },
      ],
    };
  },
);

server.tool(
  "compare_sch_pcb",
  "Compare schematic components with PCB footprints.",
  {},
  () => {
    if (!project) {
      return { content: [{ type: "text", text: "No project loaded. Please use `load_project` to load a project directory." }] };
    }

    const sch_components = new Set<string>();
    for (const schematic of project.schematics()) {
      for (const symbol of schematic.symbols.values()) {
        sch_components.add(symbol.reference);
      }
    }

    const pcb_footprints = new Set<string>();
    for (const pcb of project.boards()) {
      for (const footprint of pcb.footprints) {
        pcb_footprints.add(footprint.reference);
      }
    }

    const matched = new Set<string>();
    const only_in_sch = new Set<string>();
    const only_in_pcb = new Set<string>();

    for (const ref of sch_components) {
      if (pcb_footprints.has(ref)) {
        matched.add(ref);
      } else {
        only_in_sch.add(ref);
      }
    }

    for (const ref of pcb_footprints) {
      if (!sch_components.has(ref)) {
        only_in_pcb.add(ref);
      }
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              matched: [...matched],
              only_in_sch: [...only_in_sch],
              only_in_pcb: [...only_in_pcb],
            },
            null,
            2,
          ),
        },
      ],
    };
  },
);

server.tool(
  "validate_design",
  "Perform basic design checks.",
  {},
  () => {
    if (!project) {
      return { content: [{ type: "text", text: "No project loaded. Please use `load_project` to load a project directory." }] };
    }

    const unconnected_pins: any[] = [];
    for (const schematic of project.schematics()) {
      const no_connect_locations = new Set(
        schematic.no_connects.map(
          (nc) => `${nc.at.position.x},${nc.at.position.y}`,
        ),
      );
      for (const symbol of schematic.symbols.values()) {
        for (const pin of symbol.pins) {
          const pin_at = symbol.at.position.add(pin.definition.at.position);
          if (no_connect_locations.has(`${pin_at.x},${pin_at.y}`)) {
            unconnected_pins.push({
              schematic: schematic.filename,
              symbol: symbol.reference,
              pin: pin.number,
            });
          }
        }
      }
    }

    const sch_components = new Set<string>();
    for (const schematic of project.schematics()) {
      for (const symbol of schematic.symbols.values()) {
        sch_components.add(symbol.reference);
      }
    }

    const pcb_footprints = new Set<string>();
    for (const pcb of project.boards()) {
      for (const footprint of pcb.footprints) {
        pcb_footprints.add(footprint.reference);
      }
    }

    const only_in_pcb = new Set<string>();
    for (const ref of pcb_footprints) {
      if (!sch_components.has(ref)) {
        only_in_pcb.add(ref);
      }
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              unconnected_pins,
              footprints_without_symbol: [...only_in_pcb],
            },
            null,
            2,
          ),
        },
      ],
    };
  },
);

server.tool(
  "export_bom",
  "Export a Bill of Materials (BOM).",
  {},
  () => {
    if (!project) {
      return { content: [{ type: "text", text: "No project loaded. Please use `load_project` to load a project directory." }] };
    }

    const bom = new Map<string, {
      value: string;
      footprint: string;
      references: string[];
      count: number;
    }>();

    for (const schematic of project.schematics()) {
      for (const symbol of schematic.symbols.values()) {
        if (!symbol.in_bom) {
          continue;
        }

        const key = `${symbol.value}-${symbol.footprint}`;
        if (!bom.has(key)) {
          bom.set(key, {
            value: symbol.value,
            footprint: symbol.footprint,
            references: [],
            count: 0,
          });
        }
        const entry = bom.get(key)!;
        entry.references.push(symbol.reference);
        entry.count++;
      }
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            [...bom.values()],
            null,
            2,
          ),
        },
      ],
    };
  },
);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("KiCad File MCP is online");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
