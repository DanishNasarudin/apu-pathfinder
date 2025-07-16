"use client";
import QRCode from "react-qr-code";
type Props = {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  level?: "L" | "M" | "Q" | "H";
};

export default function QRGenerator({
  value,
  size = 256,
  bgColor = "#FFFFFF",
  fgColor = "#000000",
  level = "L",
}: Props) {
  return (
    <div
      style={{ backgroundColor: bgColor, padding: 16, display: "inline-block" }}
    >
      <QRCode
        value={value}
        size={size}
        bgColor={bgColor}
        fgColor={fgColor}
        level={level}
      />
    </div>
  );
}
