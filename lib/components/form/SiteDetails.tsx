import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import Location from '~/lib/components/form/Location';
import { useSites } from '../../sites';
import { FormPostData, PanelDetails, Site } from '../../types';
import { originalLng, useIsMobile } from '../../utils';
import { NowcastingLogo } from '../icons/NavbarIcons';
import BackButton from './BackButton';
import Details from './Details';
import { originalLat } from '../../utils';
import useSWRMutation from 'swr/mutation';
import { getAuthenticatedRequestOptions } from '~/lib/swr';

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
  capacity?: number;
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
    capacity: site?.installed_capacity_kw,
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
    const capacity = formData.capacity;
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
      installed_capacity_kw: !!capacity ? capacity : sentinel,
      created_utc: date,
      updated_utc: date,
      orientation: orientation!,
      tilt: tilt!,
    };
    await trigger(data);
  };

  const lastPageCallback = () => {
    if (page === Page.Details) {
      setPage(Page.Location);
    } else {
      router.back();
    }
  };

  const nextPageCallback = () => {
    if (page === Page.Details) {
      router.push(mobile ? '/sites' : '/dashboard');
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
            submitForm={() => postPanelData(formData)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full md:flex-col md:justify-center">
      <div className="flex h-[var(--nav-height)] w-full flex-row items-center justify-between bg-ocf-black px-5 md:justify-center md:py-2">
        <div className="md:hidden">
          {!(page === Page.Location && sites.length === 0) && (
            <BackButton onClick={lastPageCallback} />
          )}
        </div>
        <NowcastingLogo />
      </div>
      {generateFormPage()}
    </div>
  );
};

export default SiteDetails;
