# Gemini CLI Exploration

This is a workshop exploring the capabilities of Gemini CLI.

## Requirements

You will need to have Node installed. I use [Homebrew](https://brew.sh/) to install it.
You could also install it manually from [Node.js](https://nodejs.org/en/download/).

## Installing Gemini CLI

According to the official [Gemini CLI](https://github.com/google-gemini/gemini-cli) docs, there are several ways to install it:

- Using npm: `npm install -g @gemini-cli/cli`
- Using Homebrew: `brew install gemini-cli`

My preferred approach is to use the following alias:

```bash
alias gemini="npx -y https://github.com/google-gemini/gemini-cli"
```

This will update Gemini CLI to the latest version on every invocation.

## The workshop itself

The workshop is in the branches.

### Step 1

Checkout `step-01` branch:

```bash
git checkout step-01
```

Review the [`hardware/README.md`](hardware/README.md) for what to do next.

## Thanks go to Stargirl Flowers

[TheaCodes](https://github.com/theacodes) built a large chunk of the infrastructure that this
workshop is built upon. She designed the [Micronova](https://github.com/wntrblm/Micronova)
Eurorack Power Supply that is the schematic used in this codelab. She built
[KiCanvas](https://kicanvas.org/) which is the basis of the MCP tool that is 
built out in the course of this codelab.
