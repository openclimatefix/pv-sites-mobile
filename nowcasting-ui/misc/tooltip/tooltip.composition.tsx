import React from "react";
import { Tooltip } from "./tooltip";

export const BasicTooltip = () => {
  return (
    <Tooltip tip={"This is a tooltip"}>
      <span>Test</span>
    </Tooltip>
  );
};
