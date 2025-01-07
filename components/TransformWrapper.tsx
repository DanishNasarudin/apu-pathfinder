"use client";
import React from "react";
import {
  TransformComponent,
  TransformWrapper as TransformWrapperOrigin,
} from "react-zoom-pan-pinch";

const TransformWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <TransformWrapperOrigin>
      <TransformComponent>{children}</TransformComponent>
    </TransformWrapperOrigin>
  );
};

export default TransformWrapper;
