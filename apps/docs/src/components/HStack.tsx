import { useMemo, type ReactNode } from "react";

const styles = {
  container: {
    alignItems: "center",
    flexDirection: "row",
    flexGrow: 0,
    flexShrink: 0,
    flexWrap: "nowrap",
    justifyContent: "flex-start",
  },
};

export interface HStackProps {
  alignItems?: HTMLDivElement["style"]["alignItems"];
  justifyContent?: HTMLDivElement["style"]["justifyContent"];
  children: ReactNode;
  grow?: boolean;
  shrink?: boolean;
  spacing?: number;
  wrap?: HTMLDivElement["style"]["flexWrap"];
  backgroundColor?: string;
  style?: HTMLDivElement["style"];
  width?: HTMLDivElement["style"]["width"];
}

export const HStack = ({
  alignItems,
  children,
  justifyContent = "flex-start",
  grow = false,
  shrink = false,
  spacing = 0,
  wrap = "nowrap",
  backgroundColor,
  width,
  style,
}: HStackProps) => {
  return (
    <div
      style={{
        gap: spacing,
        flexDirection: "row",
        justifyContent,
        alignItems,
        display: "flex",
      }}
    >
      {children}
    </div>
  );
};
