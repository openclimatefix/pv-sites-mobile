import React, { ReactNode } from "react";

export type UtilsProps = {
  /**
   * a node to be rendered in the special component.
   */
  children?: ReactNode;
};

export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export const formatISODateStringHumanNumbersOnly = (date: string) => {
  // Change date to nice human-readable format.
  // Note that this converts the string to Europe London Time
  // timezone and seconds are removed

  const d = new Date(date);

  const date_london = d.toLocaleDateString("en-GB", { timeZone: "Europe/London" });
  const date_london_time = d.toLocaleTimeString("en-GB", { timeZone: "Europe/London" }).slice(0, 5);

  // further formatting could be done to make it yyyy/mm/dd HH:MM
  return `${date_london} ${date_london_time}`;
};
