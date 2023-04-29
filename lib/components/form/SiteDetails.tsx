import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import Location from '~/lib/components/form/Location';
import { useSites } from '../../sites';
import { FormPostData, PanelDetails, Site } from '../../types';
import { originalLng, useIsMobile } from '../../utils';
import { originalLat } from '../../utils';
import useSWRMutation from 'swr/mutation';
import { getAuthenticatedRequestOptions } from '~/lib/swr';
import Details from './Details';
import BackNav from '../navigation/BackNav';

enum Page {
  Details = 'Details',
  Location = 'Location',
}

interface SiteDetailsProps {
  site?: Site;
}

export interface SiteFormData {
  siteName?: string;
  direction?: number;
  tilt?: number;
  inverterCapacity?: number;
  moduleCapacity?: number;
  latitude: number;
  longitude: number;
}

const SiteDetails: FC<SiteDetailsProps> = ({ site }) => {
  const [page, setPage] = useState<Page>(Page.Location);
  const mobile = useIsMobile();
  const router = useRouter();
  const { sites } = useSites();
  const [formData, setFormData] = useState<SiteFormData>({
    siteName: site?.client_site_name,
    direction: site?.orientation,
    tilt: site?.tilt,
    inverterCapacity: site?.inverter_capacity_kw,
    moduleCapacity: site?.module_capacity_kw,
    latitude: originalLat,
    longitude: originalLng,
  });

  async function sendRequest(url: string, { arg }: { arg: FormPostData }) {
    const options = await getAuthenticatedRequestOptions(url);
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(arg),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  }

  const { trigger } = useSWRMutation(
    `${process.env.NEXT_PUBLIC_API_BASE_URL_POST}/sites`,
    sendRequest
  );

  const postPanelData = async (formData: SiteFormData) => {
    const date = new Date().toISOString();
    const inverterCapacity = formData.inverterCapacity;
    const moduleCapacity = formData.moduleCapacity;
    const tilt = formData.tilt;
    const orientation = formData.direction;

    const sentinel = 1;
    const data: FormPostData = {
      site_uuid: 1,
      client_name: 'name',
      client_site_id: 1,
      client_site_name: formData.siteName!,
      latitude: formData.latitude,
      longitude: formData.longitude,
      inverter_capacity_kw: !!inverterCapacity ? inverterCapacity : sentinel,
      module_capacity_kw: !!moduleCapacity ? moduleCapacity : sentinel,
      created_utc: date,
      updated_utc: date,
      orientation: orientation!,
      tilt: tilt!,
    };
    const res = await trigger(data);
    return res;
  };

  const lastPageCallback = () => {
    if (page === Page.Details) {
      setPage(Page.Location);
    } else {
      router.back();
    }
  };

  const nextPageCallback = (site?: Site) => {
    if (page === Page.Details) {
      // @TODO: redirect to error page if site not created
      router.push(`/link/${site?.site_uuid}`);
    } else {
      setPage(Page.Details);
    }
  };

  const generateFormPage = () => {
    switch (page) {
      case Page.Details:
        return (
          <Details
            lastPageCallback={lastPageCallback}
            nextPageCallback={nextPageCallback}
            formData={formData}
            setFormData={setFormData}
            submitForm={() => postPanelData(formData)}
          />
        );
      case Page.Location:
        return (
          <Location
            nextPageCallback={nextPageCallback}
            lastPageCallback={lastPageCallback}
            formData={formData}
            setFormData={setFormData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full md:flex-col md:justify-center">
      <BackNav
        backButton={!(page === Page.Location && sites.length === 0)}
        lastPageCallback={lastPageCallback}
      />
      {generateFormPage()}
    </div>
  );
};

export default SiteDetails;
