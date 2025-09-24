# Winterbloom Micronova PSU Schematic

This is the [Winterbloom Micronova][] Power Supply Unit (PSU) schematic.
It is licensed under [CERN Open Hardware Licence Version 2 - Permissive][].
It was retreived from [github.com/wntrblm/Micronova][] and updated with
[KiCad][].

KiCad is a free and open-source EDA software suite for electronic design automation.
It can also be installed with Homebrew on macOS, but is not required for this workshop.

[Winterbloom Micronova]: https://winterbloom.com/shop/micronova/
[CERN Open Hardware Licence Version 2 - Permissive]: cern_ohl_p_v2.txt
[github.com/wntrblm/Micronova]: https://github.com/wntrblm/Micronova/blob/main/hardware/board/board.kicad_sch
[KiCad]: https://www.kicad.org/

## Poking it with Gemini CLI

Ask Gemini to review the schematic and explain what it does. Here is a prompt
to get you started:

```text
Please review @Micronova.kicad_sch and explain what it does.
```

Compare and contrast with the following prompt:

```text
Please review `Micronova.kicad_sch` and explain what it does.
```

How do the outputs of these two prompts differ? What do you think the implementation
concerns driving these differences are?

## Powering up Gemini

Next, you will give Gemini background information on Eurorack Power Supplies.
Here's the first prompt:

```text
Please search the web for information on the design of Eurorack Power Supplies.
```

Here's how to write it to disk:

```text
Please update `GEMINI.md` with this information.
```

However, this is already done in step 2.

```console
git checkout step-02
```

## And then

Try out the following prompt, now that [`GEMINI.md`](GEMINI.md) contains information
on design patterns for Eurorack Modular power supplies.

```text
Please review `Micronova.kicad_sch` and explain what it does.
```

Compare notes with the people next to you. Did you see the same result, or something different?

## On to step 3

Will involve checking out the next step and moving to another directory. Exciting!

```console
git checkout step-03
```

## Using KiCanvas

If you look in [`../kicanvas`](../kicanvas) you will see a web application for
viewing KiCad schematics and PCB files. You can run it as follows:

```console
cd ../kicanvas
npm install
npm run serve
```

Once you have it running, you can load up the `Micronova.kicad_sch` schematic in [KiCanvas](http://localhost:8001/?github=https%3A%2F%2Fgithub.com%2Fdomesticmouse%2Fgemini-cli-exploration%2Fblob%2Fmain%2Fhardware%2FMicronova.kicad_sch).

Alternatively, you can do it in the [hosted KiCanvas](https://kicanvas.org/?github=https%3A%2F%2Fgithub.com%2Fdomesticmouse%2Fgemini-cli-exploration%2Fblob%2Fmain%2Fhardware%2FMicronova.kicad_sch).

Now that you have run the app, ask Gemini to review the codebase.
Run Gemini and then use the following prompt.

```text
Please review this codebase and explain the component parts.
```

We are going to use code from this application as the basis of an MCP server
for reading KiCad files. Ask Gemini which parts we need to carry out this
work.

```text
I want to use the tokenizer and parser from this project in a standalone
command line application for parsing and understanding KiCad files. Which
parts do I need, and how should I build a node application from these parts?

Do not write any code, this is purely a planning step.
```

This gives us a plan on how to get started. But first, we need a hello world
MCP server.

## On to step 4

Step 4 will create an MCP server.

```console
git checkout step-04
```

## A wild MCP server appears

In `../kicad-file-mcp` there is the start of an MCP server. Change
into that directory, install dependencies, and run Gemini:

```console
cd ../kicad-file-mcp
npm install
gemini
```

You should now be able to inspect the available MCP servers inside of
Gemini with the `/mcp` slash-command and ask it to greet someone.

```text
Please use the sayHello command to greet Bob by name.
```

You can also ask Gemini to review the codebase.

```text
Please review the code in this directory and explain what it does.
```

## On to step 5

Step 5 will involve adding the KiCad parsing capabilities from KiCanvas to
KiCad File MCP server.

```console
git checkout step-05
```

## Getting Gemini to plan out work

The code in the `kicad-file-mcp` directory now contains a bunch of code
from `kicanvas` around parsing the KiCad file formats. However, there
is no connection from the KiCad parsing code and the MCP server.

Ask Gemini to plan out how to integrate the code. Run Gemini in the
`kicad-file-mcp` directory and run the following prompt.

```text
The code in this directory now contains a lot of code for parsing KiCad
files. Please plan out how to expose this functionality through the MCP
service in @src/index.ts. You may find it useful to review the following
page https://github.com/modelcontextprotocol/typescript-sdk for information
about the MCP SDK.
```

## On to step 6

Step 6 shows the finished product.

```console
git checkout step-06
```
