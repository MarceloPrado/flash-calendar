import { useRef } from "react";

export const useRenderCount = (id?: string) => {
  const renderCount = useRef(0);
  renderCount.current += 1;

  const lastItemId = useRef(id);

  /**
   * See more at: https://shopify.github.io/flash-list/docs/recycling
   */
  if (lastItemId.current !== id) {
    lastItemId.current = id;
    renderCount.current = 1;
  }

  return renderCount.current;
};
