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

```
Please review @Micronova.kicad_sch and explain what it does.
```

Compare and contrast with the following prompt:

```
Please review the schematic in this directory and explain what it does.
```

How do the outputs of these two prompts differ? What do you think the implementation
concerns driving these differences are?
