# @marceloterreiro/flash-calendar

This is a monorepo for the flash calendar project.

## Contributing

To install dependencies, run at the root:

```bash
bun install
```

To build (required for a fresh install)

```bash
bun run build
```

To develop

```bash
bun run dev
```

To test changes against the kitchen sink repo:

```bash
bun run kitchen-sink:expo
# or
bun run kitchen-sink:vanilla
```

#### Package structure

##### /apps

- `/apps/example`: Storybook host for the flash calendar, runs with the latest uncompiled code.

##### /kitchen-sink

A place to test the flash calendar in a real environment using Expo and vanilla React Native..

- `/kitchen-sink/expo`: Scaffolded expo project to test the flash calendar in a real environment.
- `/kitchen-sink/vanilla`: Scaffolded RN project to test the flash calendar in a real environment.

##### /packages

The actual libraries.

- `/packages/flash-calendar`: The flash calendar package itself.
