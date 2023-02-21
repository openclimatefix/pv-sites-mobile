import React from "react";
import { Header } from "./header";
import { VIEWS } from "@openclimatefix/nowcasting-ui.config.constants";

export const BasicHeader = () => {
  const [view, setView] = React.useState(VIEWS.FORECAST);
  return <Header version={"0.0.1"} setView={setView} view={view} />;
};
