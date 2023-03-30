import { addMilliseconds, getDate } from 'date-fns';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  clearUsers,
  getInverters,
  getLinkedVendors,
  getLinkRedirectURL,
  testClientID,
} from '~/lib/enode';
import { parseNowcastingDatetime } from '~/lib/hooks/utils';
import { UnparsedForecastData } from '~/lib/types';
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
      const pvActualJsonFake = fakeDates(pvActualJson as any);
      res.status(200).json(pvActualJsonFake);
    } else if (
      mockApiRoute === 'sites/725a8670-d012-474d-b901-1179f43e7182/pv_forecast'
    ) {
      const pvForecastJSONFake = fakeDates(pvForecastJson as any);
      res.status(200).json(pvForecastJSONFake);
    } else if (
      mockApiRoute ===
      'sites/pv_actual?site_uuids=725a8670-d012-474d-b901-1179f43e7182,9570f807-fc9e-47e9-b5e3-5915ddddef3d'
    ) {
      res.status(200).json(pvActualMultipleJson);
    } else if (
      mockApiRoute ===
      'sites/pv_forecast?site_uuids=725a8670-d012-474d-b901-1179f43e7182,9570f807-fc9e-47e9-b5e3-5915ddddef3d'
    ) {
      res.status(200).json(pvForecastMultipleJson);
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
      return;
    } else if (mockApiRoute === 'enode/clear-users') {
      await clearUsers([testClientID]);
      res.redirect(307, '/account');
    } else {
      res.status(404).send('URL Not Found');
    }
  }
}

function fakeDates(forecastData: UnparsedForecastData) {
  const today = new Date();
  const oldStart = new Date(
    parseNowcastingDatetime(forecastData.forecast_values[0].target_datetime_utc)
  );
  const newStart = new Date(oldStart);
  newStart.setUTCDate(today.getDate());
  const difference = newStart.getTime() - oldStart.getTime();
  const forecast_values = forecastData.forecast_values.map((value) => {
    const date = new Date(parseNowcastingDatetime(value.target_datetime_utc));
    return {
      ...value,
      target_datetime_utc: addMilliseconds(date, difference).toISOString(),
    };
  });

  return {
    ...forecastData,
    forecast_creation_datetime: newStart.toISOString(),
    forecast_values,
  } as UnparsedForecastData;
}

export default handler;
