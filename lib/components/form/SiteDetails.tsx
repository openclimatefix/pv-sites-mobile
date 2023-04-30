import { useRouter } from 'next/router';
import { FC, useState, useEffect } from 'react';
import Location from '~/lib/components/form/Location';
import { useSites } from '../../sites';
import { FormPostData, PanelDetails, Site } from '../../types';
import { originalLng, useIsMobile } from '../../utils';
import { originalLat } from '../../utils';
import useSWRMutation from 'swr/mutation';
import { getAuthenticatedRequestOptions } from '~/lib/swr';
import Details from './Details';
import BackNav from '../navigation/BackNav';
import { NavbarLink } from '../navigation/NavBar';

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
  const [page, setPage] = useState<Page>(site ? Page.Details : Page.Location);
  const isMobile = useIsMobile();
  const backUrl = isMobile ? '/sites' : '/dashboard';
  const router = useRouter();
  const { sites } = useSites();
  const [formData, setFormData] = useState<SiteFormData>({
    siteName: site?.client_site_name,
    direction: site?.orientation,
    tilt: site?.tilt,
    inverterCapacity: site?.inverter_capacity_kw,
    moduleCapacity: site?.module_capacity_kw,
    latitude: site?.latitude || originalLat,
    longitude: site?.longitude || originalLng,
  });
  const [edited, setEdited] = useState(false);

  useEffect(() => {
    if (
      site?.client_site_name === formData.siteName &&
      site?.orientation === formData.direction &&
      site?.tilt === formData.tilt &&
      site?.inverter_capacity_kw === formData.inverterCapacity &&
      site?.module_capacity_kw === formData.moduleCapacity &&
      site?.latitude === formData.latitude &&
      site?.longitude === formData.longitude
    ) {
      setEdited(false);
    } else {
      setEdited(true);
    }
  }, [formData, site]);

  const sendFormData =
    (method: string) =>
    async (url: string, { arg }: { arg: FormPostData }) => {
      const options = await getAuthenticatedRequestOptions(url);
      return fetch(url, {
        method,
        body: JSON.stringify(arg),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
    };

  const { trigger: createSite } = useSWRMutation(
    `${process.env.NEXT_PUBLIC_API_BASE_URL_POST}/sites`,
    sendFormData('POST')
  );

  const { trigger: updateSite } = useSWRMutation(
    `${process.env.NEXT_PUBLIC_API_BASE_URL_POST}/sites/${site?.site_uuid}`,
    sendFormData('PUT')
  );

  const submitForm = async (formData: SiteFormData) => {
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
      created_utc: site?.created_utc || date,
      updated_utc: date,
      orientation: orientation!,
      tilt: tilt!,
    };

    return !!site ? updateSite(data) : createSite(data);
  };

  const lastPageCallback = () => {
    if (page === Page.Details) {
      setPage(Page.Location);
    } else {
      router.back();
    }
  };

  const editModeLastPageCallback = () => {
    if (page === Page.Location) {
      setPage(Page.Details);
    } else {
      router.push(backUrl);
    }
  };

  const nextPageCallback = (site?: Site) => {
    if (page === Page.Details) {
      router.push(isMobile ? '/sites' : `/dashboard/${site?.site_uuid}`);
    } else {
      setPage(Page.Details);
    }
  };

  const mapButtonCallback = () => {
    setPage(Page.Location);
  };

  const generateFormPage = () => {
    switch (page) {
      case Page.Details:
        return (
          <Details
            lastPageCallback={
              !site ? lastPageCallback : editModeLastPageCallback
            }
            nextPageCallback={nextPageCallback}
            formData={formData}
            setFormData={setFormData}
            submitForm={() => submitForm(formData)}
            mapButtonCallback={mapButtonCallback}
            isEditing={!!site}
            edited={edited}
          />
        );
      case Page.Location:
        return (
          <Location
            lastPageCallback={
              !site ? lastPageCallback : editModeLastPageCallback
            }
            nextPageCallback={nextPageCallback}
            formData={formData}
            setFormData={setFormData}
            isEditing={!!site}
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
        lastPageCallback={!site ? lastPageCallback : editModeLastPageCallback}
      />
      {site && page == Page.Details && (
        <div className="flex w-full justify-center">
          <div className="mb-2 flex w-4/5 md:w-8/12">
            <NavbarLink
              title="Details"
              href={`/site-details/${site?.site_uuid}`}
            />
            <NavbarLink
              title="Inverters"
              href={`/inverters/edit/${site?.site_uuid}`}
            />
          </div>
        </div>
      )}
      {generateFormPage()}
    </div>
  );
};

export default SiteDetails;
