import { useRef } from "react";

export const useRenderCount = () => {
  const renderCount = useRef(0);
  renderCount.current += 1;
  return renderCount.current;
};
