import { addMilliseconds, subDays } from 'date-fns';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  clearUsers,
  getInverters,
  getLinkRedirectURL,
  getLinkedVendors,
  testClientID,
} from '~/lib/enode';
import { parseNowcastingDatetime } from '~/lib/hooks/utils';
import {
  UnparsedActualData,
  UnparsedClearSkyData,
  UnparsedForecastData,
} from '~/lib/types';
import pvClearskyMultipleJson from '../../data/pv-clearsky-multiple.json';
import clearskyJson from '../../data/clearsky.json';
import pvActualMultipleJson from '../../data/pv-actual-multiple.json';
import pvActualJson from '../../data/pv-actual.json';
import pvForecastMultipleJson from '../../data/pv-forecast-multiple.json';
import pvForecastJson from '../../data/pv-forecast.json';
import siteListJson from '../../data/site-list.json';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let { mockApiRoute, site_uuids } = req.query;

  if (!mockApiRoute) {
    res.status(404).send('Not found');
    return;
  }

  if (typeof mockApiRoute === 'string') {
    mockApiRoute = [mockApiRoute];
  }
  mockApiRoute = mockApiRoute.join('/');

  if (site_uuids) {
    mockApiRoute += `?site_uuids=${site_uuids}`;
  }

  if (req.method == 'POST') {
    if (mockApiRoute === 'sites') {
      const PVSiteMetadataProps = [
        'site_uuid',
        'client_name',
        'client_site_id',
        'client_site_name',
        'latitude',
        'longitude',
        'installed_capacity_kw',
        'created_utc',
        'updated_utc',
      ];
      const doesPropertyExist = (propname: string) => !!req.body[propname];

      if (PVSiteMetadataProps.every(doesPropertyExist)) {
        res.status(200).send('success');
      } else {
        res.status(400).send('PV site metadata missing required props');
      }
    }
  }

  if (req.method == 'GET') {
    if (
      mockApiRoute === 'sites/725a8670-d012-474d-b901-1179f43e7182/pv_actual'
    ) {
      const pvActual = pvActualJson as UnparsedActualData;
      res.status(200).json({
        ...pvActual,
        pv_actual_values: fakeDates(pvActual.pv_actual_values, 'datetime_utc'),
      });
    } else if (
      mockApiRoute === 'sites/725a8670-d012-474d-b901-1179f43e7182/pv_forecast'
    ) {
      const pvForecast = pvForecastJson as UnparsedForecastData;
      res.status(200).json({
        ...pvForecast,
        forecast_values: fakeDates(pvForecast.forecast_values),
      });
    } else if (
      mockApiRoute ===
      'sites/725a8670-d012-474d-b901-1179f43e7182/clearsky_estimate'
    ) {
      const clearSky = clearskyJson as UnparsedClearSkyData;
      res.status(200).json({
        ...clearSky,
        clearsky_estimate: fakeDates(clearSky.clearsky_estimate),
      });
    } else if (
      mockApiRoute ===
      'sites/pv_forecast?site_uuids=725a8670-d012-474d-b901-1179f43e7182'
    ) {
      const forecastMultiple = [pvForecastJson] as UnparsedForecastData[];
      res.status(200).json([
        ...forecastMultiple.map((forecast) => ({
          ...forecast,
          forecast_values: fakeDates(forecast.forecast_values),
        })),
      ]);
    } else if (
      mockApiRoute ===
      'sites/clearsky_estimate?site_uuids=725a8670-d012-474d-b901-1179f43e7182'
    ) {
      const clearskyMultiple = [clearskyJson] as UnparsedClearSkyData[];
      res.status(200).json([
        ...clearskyMultiple.map((forecast) => ({
          ...forecast,
          clearsky_estimate: fakeDates(forecast.clearsky_estimate),
        })),
      ]);
    } else if (
      mockApiRoute ===
      'sites/pv_actual?site_uuids=725a8670-d012-474d-b901-1179f43e7182'
    ) {
      const actualMultiple = [pvActualJson] as UnparsedActualData[];
      res.status(200).json([
        ...actualMultiple.map((actuals) => ({
          ...actuals,
          pv_actual_values: fakeDates(actuals.pv_actual_values, "datetime_utc"),
        })),
      ]);
    } else if (
      mockApiRoute ===
      'sites/pv_actual?site_uuids=725a8670-d012-474d-b901-1179f43e7182,b97f68cd-50e0-49bb-a850-108d4a9f7b7e,b97f68cd-50e0-49bb-a850-108d4a9f7b7f,b97f68cd-50e0-49bb-a850-108d4a9f7b7g'
    ) {
      const actualMultiple = pvActualMultipleJson as UnparsedActualData[];
      res.status(200).json([
        ...actualMultiple.map((actuals) => ({
          ...actuals,
          pv_actual_values: fakeDates(actuals.pv_actual_values, "datetime_utc"),
        })),
      ]);
    } else if (
      mockApiRoute ===
      'sites/pv_forecast?site_uuids=725a8670-d012-474d-b901-1179f43e7182,b97f68cd-50e0-49bb-a850-108d4a9f7b7e,b97f68cd-50e0-49bb-a850-108d4a9f7b7f,b97f68cd-50e0-49bb-a850-108d4a9f7b7g'
    ) {
      const forecastMultiple = pvForecastMultipleJson as UnparsedForecastData[];
      res.status(200).json([
        ...forecastMultiple.map((forecast) => ({
          ...forecast,
          forecast_values: fakeDates(forecast.forecast_values),
        })),
      ]);
    } else if (
      mockApiRoute ===
      'sites/pv_clearsky?site_uuids=725a8670-d012-474d-b901-1179f43e7182,b97f68cd-50e0-49bb-a850-108d4a9f7b7e,b97f68cd-50e0-49bb-a850-108d4a9f7b7f,b97f68cd-50e0-49bb-a850-108d4a9f7b7g'
    ) {
      const clearskyMultiple = pvClearskyMultipleJson as UnparsedClearSkyData[];
      res.status(200).json([
        ...clearskyMultiple.map((forecast) => ({
          ...forecast,
          clearsky_estimate: fakeDates(forecast.clearsky_estimate),
        })),
      ]);
    } else if (mockApiRoute === 'sites') {
      res.status(200).json(siteListJson);
    } else if (mockApiRoute === 'inverters') {
      res.status(200).json(await getInverters(testClientID));
    } else if (mockApiRoute === 'enode/link') {
      const redirectURL = await getLinkRedirectURL(
        testClientID,
        process.env.AUTH0_BASE_URL + '/api/enode/link-return' // Should use a different redirect URL in the future (not AUTH0 base)
      );

      // Maxed connections
      if (!redirectURL) {
        res.redirect(307, '/account?linkSuccess=false');
      }

      res.redirect(307, redirectURL);
    } else if (mockApiRoute === 'enode/link-return') {
      const linkedVendors = await getLinkedVendors(testClientID);
      const linkSuccess =
        linkedVendors.length > 0 &&
        linkedVendors.every((vendor) => vendor.isValid);
      const redirectURL =
        '/account?' +
        new URLSearchParams({ linkSuccess: linkSuccess.toString() });
      res.redirect(307, redirectURL);
    } else if (mockApiRoute === 'enode/clear-users') {
      await clearUsers([testClientID]);
      res.redirect(307, '/account');
    } else {
      res.status(404).send('URL Not Found');
    }
  }
}

function fakeDates(forecastData: any[], key = 'target_datetime_utc') {
  const oldStart = new Date(parseNowcastingDatetime(forecastData[0][key]));
  let newStart = new Date();
  newStart.setUTCHours(oldStart.getUTCHours());
  newStart.setUTCMinutes(oldStart.getUTCMinutes());
  newStart.setUTCSeconds(0);
  newStart.setUTCMilliseconds(0);
  newStart = subDays(newStart, 1);
  const difference = newStart.getTime() - oldStart.getTime();

  return forecastData.map((value) => {
    const date = new Date(parseNowcastingDatetime(value[key]));
    return {
      ...value,
      [key]: addMilliseconds(date, difference).toISOString(),
    };
  });
}

export default handler;
