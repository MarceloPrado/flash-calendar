# Expo SDK 53 → 54 Upgrade Plan

## Apps to Upgrade

| App | Location | Current SDK |
|-----|----------|-------------|
| **example** | `apps/example` | ^53 |
| **kitchen-sink-expo** | `kitchen-sink/expo` | ^53 |

---

## Phase 1: Pre-Upgrade Cleanup

### Both Apps

- [ ] **Delete `babel.config.js`** — Only contains `babel-preset-expo` which is implicit in SDK 54
- [ ] **Remove `@babel/core`** from `devDependencies` — No longer needed

### kitchen-sink/expo Only

- [ ] **Delete `metro.config.js`** — Only contains expo defaults
- [ ] **Remove `jsEngine: "hermes"`** from `app.json` — Hermes is the default

### apps/example Only

- [ ] **Keep `metro.config.js`** — Contains Storybook and monorepo configuration (required)

---

## Phase 2: Upgrade Expo SDK

Run in each app directory:

```bash
# apps/example
cd apps/example
npx expo install expo@54
npx expo install --fix

# kitchen-sink/expo
cd kitchen-sink/expo
npx expo install expo@54
npx expo install --fix
```

---

## Phase 3: Install Required Dependencies

### kitchen-sink/expo

```bash
npx expo install react-native-worklets
```

> **Note:** `react-native-worklets` is required for `react-native-reanimated` in SDK 54+

---

## Phase 4: Enable React Compiler

Add to both `app.json` files:

```json
{
  "expo": {
    "experiments": {
      "reactCompiler": true
    }
  }
}
```

---

## Phase 5: Run Diagnostics

```bash
npx expo-doctor
```

---

## Phase 6: Clear Caches

```bash
rm -rf node_modules .expo
watchman watch-del-all
bun install
```

---

## Phase 7: Verify

- [ ] Run `npx expo start` in both apps
- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Verify Storybook works in `apps/example`

---

## SDK 54 Breaking Changes Reference

### React 19 Changes

SDK 54 includes React 19. While existing code will continue to work, consider these optional modernizations:

| Before (React 18) | After (React 19) |
|-------------------|------------------|
| `useContext(MyContext)` | `use(MyContext)` |
| `<Context.Provider value={...}>` | `<Context value={...}>` |
| `forwardRef((props, ref) => ...)` | `function Component({ ref, ...props })` |

### Metro Changes

- `experimentalImportSupport` is enabled by default
- `EXPO_USE_FAST_RESOLVER=1` env var is removed

### React Compiler

Once enabled, manual memoization (`useMemo`, `useCallback`, `React.memo`) becomes optional — the compiler handles it automatically.

---

## Rollback Plan

If issues arise:

```bash
npx expo install expo@53
npx expo install --fix
```
