import * as React from "react";
import {
  FlashList as ShopifyFlashList,
  type FlashListProps,
} from "@shopify/flash-list";
import Animated from "react-native-reanimated";
import {
  BottomSheetScrollView,
  createBottomSheetScrollableComponent,
  type BottomSheetScrollableProps,
  SCROLLABLE_TYPE,
} from "@gorhom/bottom-sheet";
import { type RefObject, type Ref } from "react";
import {
  type ScrollResponderMixin,
  type ScrollViewComponent,
  type View,
} from "react-native";

/**
 * Extracted from https://github.com/discord/react-native-bottom-sheet/blob/57c669de7fa573ef121634b1a1b01f57f5d36a86/src/components/bottomSheetScrollable/BottomSheetFlashList.tsx
 */

export type BottomSheetFlashListProps<T> = Omit<
  FlashListProps<T>,
  | "decelerationRate"
  | "onScroll"
  | "scrollEventThrottle"
  | "renderScrollComponent"
> &
  BottomSheetScrollableProps & {
    ref?: Ref<BottomSheetFlashListMethods>;
  };

export interface BottomSheetFlashListMethods {
  /**
   * Scrolls to the end of the content. May be janky without `getItemLayout` prop.
   */
  scrollToEnd: (params?: { animated?: boolean | null }) => void;

  /**
   * Scrolls to the item at the specified index such that it is positioned in the viewable area
   * such that viewPosition 0 places it at the top, 1 at the bottom, and 0.5 centered in the middle.
   * Cannot scroll to locations outside the render window without specifying the getItemLayout prop.
   */
  scrollToIndex: (params: {
    animated?: boolean | null;
    index: number;
    viewOffset?: number;
    viewPosition?: number;
  }) => void;

  /**
   * Requires linear scan through data - use `scrollToIndex` instead if possible.
   * May be janky without `getItemLayout` prop.
   */
  scrollToItem: (params: {
    animated?: boolean | null;
    item: any;
    viewPosition?: number;
  }) => void;

  /**
   * Scroll to a specific content pixel offset, like a normal `ScrollView`.
   */
  scrollToOffset: (params: {
    animated?: boolean | null;
    offset: number;
  }) => void;

  /**
   * Tells the list an interaction has occured, which should trigger viewability calculations,
   * e.g. if waitForInteractions is true and the user has not scrolled. This is typically called
   * by taps on items or by navigation actions.
   */
  recordInteraction: () => void;

  /**
   * Displays the scroll indicators momentarily.
   */
  flashScrollIndicators: () => void;

  /**
   * Provides a handle to the underlying scroll responder.
   */
  getScrollResponder: () => ScrollResponderMixin | null | undefined;

  /**
   * Provides a reference to the underlying host component
   */
  getNativeScrollRef: () =>
    | RefObject<View>
    | RefObject<ScrollViewComponent>
    | null
    | undefined;

  getScrollableNode: () => any;

  // TODO: use `unknown` instead of `any` for Typescript >= 3.0
  setNativeProps: (props: Record<string, any>) => void;
}

const AnimatedShopifyFlashList =
  Animated.createAnimatedComponent(ShopifyFlashList);

const AnimatedFlashList = React.forwardRef<any, FlashListProps<any>>(
  (props, ref) => (
    <AnimatedShopifyFlashList
      ref={ref}
      // @ts-expect-error copied from githube
      renderScrollComponent={BottomSheetScrollView}
      {...props}
    />
  )
);

const BottomSheetFlashListComponent = createBottomSheetScrollableComponent<
  BottomSheetFlashListMethods,
  BottomSheetFlashListProps<any>
>(SCROLLABLE_TYPE.FLATLIST, AnimatedFlashList);

const BottomSheetFlashList = React.memo(BottomSheetFlashListComponent);
BottomSheetFlashList.displayName = "BottomSheetFlashList";

export default BottomSheetFlashList as <T>(
  props: BottomSheetFlashListProps<T>
) => ReturnType<typeof BottomSheetFlashList>;
