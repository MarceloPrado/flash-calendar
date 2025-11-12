import AsyncStorage from "@react-native-async-storage/async-storage";
import { LiteUI } from "@storybook/react-native-ui-lite";
import { view } from "./storybook.requires";

const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
  CustomUIComponent: LiteUI,
});

export default StorybookUIRoot;
