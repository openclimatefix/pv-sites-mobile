import dayjs from 'dayjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { parseNowcastingDatetime } from '~/lib/api';
import {
  clearUsers,
  getLinkRedirectURL,
  getLinkedVendors,
  testClientID,
} from '~/lib/enode';
import {
  UnparsedActualData,
  UnparsedClearSkyData,
  UnparsedForecastData,
} from '~/lib/types';
import clearskyJson from '../../data/clearsky.json';
import invertersJson from '../../data/inverters.json';
import pvActualMultipleJson from '../../data/pv-actual-multiple.json';
import pvActualJson from '../../data/pv-actual.json';
import pvClearskyMultipleJson from '../../data/pv-clearsky-multiple.json';
import pvForecastMultipleJson from '../../data/pv-forecast-multiple.json';
import pvForecastJson from '../../data/pv-forecast.json';
import siteListJson from '../../data/site-list.json';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let { mockApiRoute, site_uuids, redirect_uri } = req.query;

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

  if (req.method === 'PUT') {
    if (
      mockApiRoute === 'sites/725a8670-d012-474d-b901-1179f43e7182/inverters'
    ) {
      res.status(200).json('Done');
    }
  }

  if (req.method == 'POST') {
    if (mockApiRoute === 'sites') {
      const PVSiteMetadataProps = [
        'client_name',
        'client_site_id',
        'client_site_name',
        'latitude',
        'longitude',
        'inverter_capacity_kw',
        'tilt',
        'orientation',
      ];
      const doesPropertyExist = (propname: string) => !!req.body[propname];

      if (PVSiteMetadataProps.every(doesPropertyExist)) {
        res.status(200).json(siteListJson.site_list[0]);
      } else {
        res.status(400).send('PV site metadata missing required props');
      }
    }
  }

  if (req.method == 'GET') {
    if (
      mockApiRoute === 'sites/725a8670-d012-474d-b901-1179f43e7182/pv_actual' ||
      mockApiRoute === 'sites/b97f68cd-50e0-49bb-a850-108d4a9f7b7e/pv_actual' ||
      mockApiRoute === 'sites/b97f68cd-50e0-49bb-a850-108d4a9f7b7f/pv_actual'
    ) {
      const pvActual = pvActualJson as UnparsedActualData;
      res.status(200).json({
        ...pvActual,
        pv_actual_values: fakeDates(pvActual.pv_actual_values, 'datetime_utc'),
      });
    } else if (
      mockApiRoute ===
        'sites/725a8670-d012-474d-b901-1179f43e7182/pv_forecast' ||
      mockApiRoute ===
        'sites/b97f68cd-50e0-49bb-a850-108d4a9f7b7e/pv_forecast' ||
      mockApiRoute === 'sites/b97f68cd-50e0-49bb-a850-108d4a9f7b7f/pv_forecast'
    ) {
      const pvForecast = pvForecastJson as UnparsedForecastData;
      res.status(200).json({
        ...pvForecast,
        forecast_values: fakeDates(pvForecast.forecast_values),
      });
    } else if (
      mockApiRoute ===
        'sites/725a8670-d012-474d-b901-1179f43e7182/clearsky_estimate' ||
      mockApiRoute ===
        'sites/b97f68cd-50e0-49bb-a850-108d4a9f7b7e/clearsky_estimate' ||
      mockApiRoute ===
        'sites/b97f68cd-50e0-49bb-a850-108d4a9f7b7f/clearsky_estimate'
    ) {
      const clearSky = clearskyJson as UnparsedClearSkyData;
      res.status(200).json({
        ...clearSky,
        clearsky_estimate: fakeDates(clearSky.clearsky_estimate),
      });
    } else if (
      mockApiRoute ===
        'sites/pv_forecast?site_uuids=725a8670-d012-474d-b901-1179f43e7182' ||
      mockApiRoute ===
        'sites/pv_forecast?site_uuids=b97f68cd-50e0-49bb-a850-108d4a9f7b7e' ||
      mockApiRoute ===
        'sites/pv_forecast?site_uuids=b97f68cd-50e0-49bb-a850-108d4a9f7b7f'
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
        'sites/clearsky_estimate?site_uuids=725a8670-d012-474d-b901-1179f43e7182' ||
      mockApiRoute ===
        'sites/clearsky_estimate?site_uuids=b97f68cd-50e0-49bb-a850-108d4a9f7b7e' ||
      mockApiRoute ===
        'sites/clearsky_estimate?site_uuids=b97f68cd-50e0-49bb-a850-108d4a9f7b7f'
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
        'sites/pv_actual?site_uuids=725a8670-d012-474d-b901-1179f43e7182' ||
      mockApiRoute ===
        'sites/pv_actual?site_uuids=b97f68cd-50e0-49bb-a850-108d4a9f7b7e' ||
      mockApiRoute ===
        'sites/pv_actual?site_uuids=b97f68cd-50e0-49bb-a850-108d4a9f7b7f'
    ) {
      const actualMultiple = [pvActualJson] as UnparsedActualData[];
      res.status(200).json([
        ...actualMultiple.map((actuals) => ({
          ...actuals,
          pv_actual_values: fakeDates(actuals.pv_actual_values, 'datetime_utc'),
        })),
      ]);
    } else if (
      mockApiRoute ===
      'sites/pv_actual?site_uuids=725a8670-d012-474d-b901-1179f43e7182,b97f68cd-50e0-49bb-a850-108d4a9f7b7e'
    ) {
      const actualMultiple = pvActualMultipleJson as UnparsedActualData[];
      res.status(200).json([
        ...actualMultiple.map((actuals) => ({
          ...actuals,
          pv_actual_values: fakeDates(actuals.pv_actual_values, 'datetime_utc'),
        })),
      ]);
    } else if (
      mockApiRoute ===
      'sites/pv_forecast?site_uuids=725a8670-d012-474d-b901-1179f43e7182,b97f68cd-50e0-49bb-a850-108d4a9f7b7e'
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
      'sites/clearsky_estimate?site_uuids=725a8670-d012-474d-b901-1179f43e7182,b97f68cd-50e0-49bb-a850-108d4a9f7b7e'
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
    } else if (mockApiRoute === 'enode/inverters') {
      res.status(200).json({ inverters: invertersJson });
    } else if (
      mockApiRoute.startsWith('sites') &&
      mockApiRoute.endsWith('inverters')
    ) {
      res.status(200).json(invertersJson);
    } else if (mockApiRoute === 'enode/link') {
      const redirectURL = await getLinkRedirectURL(
        testClientID,
        redirect_uri as string
      );

      // Maxed connections
      if (!redirectURL) {
        res.redirect(307, '/inverters?linkSuccess=false');
        throw new Error('ERR!');
        return;
      }

      res.status(200).json(redirectURL);
    } else if (mockApiRoute === 'enode/link-return') {
      const linkedVendors = await getLinkedVendors(testClientID);
      const linkSuccess =
        linkedVendors.length > 0 &&
        linkedVendors.every((vendor) => vendor.isValid);
      const redirectURL =
        '/inverters/?' +
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
  newStart = dayjs(newStart).subtract(1, 'days').toDate();
  const difference = newStart.getTime() - oldStart.getTime();

  return forecastData.map((value) => {
    const date = new Date(parseNowcastingDatetime(value[key]));
    return {
      ...value,
      [key]: dayjs(date).add(difference).toISOString(),
    };
  });
}

export default handler;
