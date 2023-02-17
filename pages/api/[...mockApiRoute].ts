import type { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";

// import gbPvGSPJson from "../../../data/dummy-res/fc-gsp.json";
// import gspRegions from "../../../data/dummy-res/gsp-regions.json";
// import forecastNat from "../../../data/dummy-res/forecast-national.json";
// import truthAll from "../../../data/dummy-res/truth-all.json";
// import fc_0 from "../../../data/dummy-res/fc-latest-0.json";
// import fc_all from "../../../data/dummy-res/fc-all.json";

import pvActualJson from '../../data/pv-actual.json'
import pvForecastJson from '../../data/pv-forecast.json'
import siteListJson from '../../data/site-list.json'


function handler(req: NextApiRequest, res: NextApiResponse) {
  const { mockApiRoute } = req.query;
  console.log(mockApiRoute)

  if ((mockApiRoute as string[]).join("/") === "sites/pv_actual/b97f68cd-50e0-49bb-a850-108d4a9f7b7e") {
    res.status(200).json(pvActualJson);
  } else if ((mockApiRoute as string[]).join("/") === "sites/pv_forecast/b97f68cd-50e0-49bb-a850-108d4a9f7b7e") {
    res.status(200).json(pvForecastJson);
  } else if ((mockApiRoute as string[]).join("/") === "sites/site_list") {
    res.status(200).json(siteListJson);
  } else {
    res.status(404).send("URL Not Found")
  }
}

export default withSentry(handler);
