# Gemini Code Assistant: `kicad-file-mcp` Package Summary

This document provides a detailed summary of the `kicad-file-mcp` package, a Model Context Protocol (MCP) server for interacting with KiCad project files.

## 1. Overview

`kicad-file-mcp` is a command-line tool that functions as an MCP server. It is designed to be used within an MCP-compatible client (like Gemini) to provide context and analysis capabilities for KiCad electronic design projects. The tool allows a user to load a KiCad project and then query it for information about schematics, PCBs, components, and design integrity.

- **Package Name:** `kicad-file-mcp`
- **Version:** 1.0.0
- **License:** Apache-2.0
- **Primary Dependency:** `@modelcontextprotocol/sdk`

## 2. Purpose

The primary purpose of this package is to bridge the gap between KiCad's file formats and a large language model's (LLM) conversational interface. By exposing the contents of KiCad files through a structured MCP server, it allows developers and engineers to:

- **Analyze KiCad projects programmatically.**
- **Perform design checks and validation through natural language queries.**
- **Extract key information like component lists, netlists, and board layouts without needing to open the KiCad application.**
- **Integrate KiCad project data into larger automated workflows.**

## 3. Features (MCP Tools)

The server exposes a comprehensive set of tools for inspecting and analyzing KiCad projects. These tools are categorized below.

### Project Management

- `load_project`: Loads a KiCad project from a specified directory. This is the entry point for any analysis.
- `list_project_files`: Lists all the files that have been identified as part of the loaded project.
- `get_project_info`: Retrieves general settings and information about the project.

### Schematic Analysis

- `analyze_schematic`: Provides a detailed breakdown of a specific schematic file, including all symbols, their properties, and pin definitions.
- `list_components`: Lists all schematic components (symbols) across all schematic files in the project.
- `find_nets`: Finds and lists all named nets (net, global, and hierarchical labels) within a given schematic.
- `get_schematic_hierarchy`: Displays the hierarchical relationship between different schematic sheets.

### PCB Analysis

- `analyze_pcb`: Provides a detailed breakdown of a PCB file, including all footprints and their pad information.
- `list_footprints`: Lists all footprints across all PCB files in the project.
- `get_layer_info`: Returns the layer definitions (names, types) for a specified PCB.
- `find_vias_tracks`: Extracts all vias and tracks (segments) from a PCB file, including their location, size, and associated net.

### Design Validation & Export

- `compare_sch_pcb`: Cross-references components in the schematics with footprints on the PCBs to identify discrepancies (e.g., components present in the schematic but not the layout, and vice-versa).
- `validate_design`: Performs basic design rule checks, such as identifying unconnected pins and footprints that don't have a corresponding schematic symbol.
- `export_bom`: Generates a Bill of Materials (BOM) by aggregating all components from the schematics that are marked to be included in the BOM.

## 4. Usage

The tool is intended to be run as a background process that an MCP client can connect to.

1. **Installation:** `npm install`
2. **Build:** `npm run build`
3. **Execution:** The tool is started as a standalone process. For development and inspection, it can be run with the MCP inspector:

    ```bash
    npx @modelcontextprotocol/inspector ./build/index.js
    ```

    In a production environment, it would be launched as an MCP server for a client like Gemini to connect to.

## 5. Architecture

The package is written in TypeScript and organized into several modules:

- `src/index.ts`: The main entry point. It initializes the `McpServer` and defines all the tools that are exposed to the client.
- `src/kicad/`: Contains the core logic for parsing KiCad file formats (`.kicad_sch`, `.kicad_pcb`). It defines the data structures for schematics, PCBs, symbols, footprints, etc.
- `src/kicanvas/`: Contains a `Project` class that manages the overall KiCad project, including loading files and organizing the data.
- `src/base/`: Provides utility functions for file system access (`fs.ts`), math operations, and other foundational code.
