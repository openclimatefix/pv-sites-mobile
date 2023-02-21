import type { NextApiRequest, NextApiResponse } from 'next';

import pvActualJson from '../../data/pv-actual.json';
import pvForecastJson from '../../data/pv-forecast.json';
import siteListJson from '../../data/site-list.json';

function handler(req: NextApiRequest, res: NextApiResponse) {
  const { mockApiRoute } = req.query;

  if (
    (mockApiRoute as string[]).join('/') ===
    'sites/pv_actual/b97f68cd-50e0-49bb-a850-108d4a9f7b7e'
  ) {
    res.status(200).json(pvActualJson);
  } else if (
    (mockApiRoute as string[]).join('/') ===
    'sites/pv_forecast/b97f68cd-50e0-49bb-a850-108d4a9f7b7e'
  ) {
    res.status(200).json(pvForecastJson);
  } else if ((mockApiRoute as string[]).join('/') === 'sites/site_list') {
    res.status(200).json(siteListJson);
  } else {
    res.status(404).send('URL Not Found');
  }
}

export default handler;
