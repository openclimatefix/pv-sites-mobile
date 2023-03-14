import type { NextApiRequest, NextApiResponse } from 'next';
import {
  clearUsers,
  getLinkedVendors,
  getLinkRedirectURL,
  testClientID,
} from '~/lib/enode';
import pvActualMultipleJson from '../../data/pv-actual-multiple.json';
import pvActualJson from '../../data/pv-actual.json';
import pvForecastMultipleJson from '../../data/pv-forecast-multiple.json';
import pvForecastJson from '../../data/pv-forecast.json';
import siteListJson from '../../data/site-list.json';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let { mockApiRoute } = req.query;
  if (!mockApiRoute) {
    res.status(404).send('Not found');
    return;
  }

  if (typeof mockApiRoute === 'string') {
    mockApiRoute = [mockApiRoute];
  }
  mockApiRoute = mockApiRoute.join('/');

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
        console.log('POST request received! Contents:');
        console.log(req.body);
        res.status(200).send('success');
      } else {
        res.status(400).send('PV site metadata missing required props');
      }
    }
  }

  if (req.method == 'GET') {
    if (
      mockApiRoute === 'sites/b97f68cd-50e0-49bb-a850-108d4a9f7b7e/pv_actual'
    ) {
      res.status(200).json(pvActualJson);
    } else if (
      mockApiRoute === 'sites/b97f68cd-50e0-49bb-a850-108d4a9f7b7e/pv_forecast'
    ) {
      res.status(200).json(pvForecastJson);
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
    } else if ('enode/clear-users') {
      await clearUsers([testClientID]);
      res.redirect(307, '/account');
    } else {
      res.status(404).send('URL Not Found');
    }
  }
}

export default handler;
