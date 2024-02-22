import { type ReactNode } from "react";

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
  spacing = 0,
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
