import React, { useState, useContext, FC, PropsWithChildren } from 'react';
import useSWRMutation from 'swr/mutation';
import { originalLng, originalLat } from '../utils';
import { LatitudeLongitude, Form, PanelDetails, FormPostData } from '../types';
import { getAuthenticatedRequestOptions } from '../swr';

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

const FormContext = React.createContext<Form | null>(null);

const FormProvider: FC<PropsWithChildren> = ({ children }) => {
  const { trigger } = useSWRMutation(
    `${process.env.NEXT_PUBLIC_API_BASE_URL_POST}/sites`,
    sendRequest
  );

  const [siteCoordinates, setSiteCoordinates] = useState<LatitudeLongitude>({
    latitude: originalLat,
    longitude: originalLng,
  });

  const [panelDetails, setPanelDetails] = useState<PanelDetails>({
    siteName: '',
    direction: '',
    tilt: '',
    capacity: '',
  });

  const setFormData = ({
    siteName,
    direction,
    tilt,
    capacity,
  }: PanelDetails) => {
    setPanelDetails({
      siteName: siteName,
      direction: String(direction),
      tilt: String(tilt),
      capacity: String(capacity),
    });
  };

  const postPanelData = async () => {
    const date = new Date().toISOString();
    const capacity = parseFloat(panelDetails.capacity);
    const tilt = parseFloat(panelDetails.tilt);
    const orientation = parseFloat(panelDetails.direction);

    const sentinel = 1;
    const data: FormPostData = {
      site_uuid: 1,
      client_name: 'name',
      client_site_id: 1,
      client_site_name: panelDetails.siteName,
      latitude: siteCoordinates.latitude,
      longitude: siteCoordinates.longitude,
      installed_capacity_kw: !!capacity ? capacity : sentinel,
      created_utc: date,
      updated_utc: date,
      orientation: orientation,
      tilt: tilt,
    };
    await trigger(data);
  };

  return (
    <FormContext.Provider
      value={{
        siteCoordinates,
        panelDetails,
        setFormData,
        setSiteCoordinates,
        postPanelData,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);

  if (context === null) {
    throw new Error('Component is not in provider.');
  }

  return context;
};

export { FormContext, FormProvider };
