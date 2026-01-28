# React Native Legend Calendar

[![npm](https://img.shields.io/npm/l/@lazerlen/flash-calendar?style=flat-square)](https://www.npmjs.com/package/@lazerlen/flash-calendar) [![npm](https://img.shields.io/badge/types-included-blue?style=flat-square)](https://www.npmjs.com/package/@lazerlen/flash-calendar) [![runs with expo](https://img.shields.io/badge/Runs%20with%20Expo-4630EB.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://expo.io/)

An opinionated fork of Marcelo Prado's [flash-calendar](https://github.com/MarceloPrado/flash-calendar) library which leverages [legend-list](https://github.com/LegendApp/legend-list) instead. **All credit to Marcelo** for his awesome work on the original library, this one is just slightly changed for my needs.

## Documentation & Examples

You can find the Legend Calendar documentation [on the website](https://leviwilliams.github.io/legend-calendar/).

## Installation

This project uses [Bun](https://bun.sh/) as its package manager. The first thing you'll need is to [install Bun](https://bun.sh/).

To install dependencies, run at the root:

```bash
bun install
```

To build (required for a fresh install)

```bash
bun run build
```

To develop or run the example app:

```bash
bun dev
```

To run the documentation website:

```bash
bun docs
```

## Contributing

Ensure your changes are unit-tested. To improve DX, run the tests in watch mode with `bun test --watch`. You can also run the tests for a specific file with `bun test --watch {filename}`.

### Package structure

#### /apps

- `/apps/example`: Storybook host for Legend Calendar, runs with the latest uncompiled code.
- `/apps/docs`: The documentation website for Legend Calendar.

#### /kitchen-sink

A place to test the published Legend Calendar in a real environment.

- `/kitchen-sink/expo`: Scaffolded expo project to test the legend calendar in a real environment.

#### /packages

The actual src code for Legend Calendar:

- `/packages/legend-calendar`: The legend calendar package itself.
- `/packages/eslint-config`: Shared eslint config for the project.
- `/packages/tsconfig`: Shared tsconfig for the project.


### License

Legend Calendar is [MIT licensed](./LICENSE).