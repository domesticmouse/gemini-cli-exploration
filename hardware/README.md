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
