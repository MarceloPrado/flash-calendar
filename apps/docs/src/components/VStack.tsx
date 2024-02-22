import { type ReactNode } from "react";

export interface VStackProps {
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

export const VStack = ({
  alignItems,
  children,
  justifyContent = "flex-start",
  spacing = 0,
}: VStackProps) => {
  return (
    <div
      style={{
        gap: spacing,
        flexDirection: "column",
        justifyContent,
        alignItems,
        display: "flex",
      }}
    >
      {children}
    </div>
  );
};
