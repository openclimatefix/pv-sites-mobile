import React, { useState, useContext, FC, PropsWithChildren } from 'react';
import useSWRMutation from 'swr/mutation';
import { originalLng, originalLat } from '../utils';
interface Form {
  latLong: [number, number];
  panelDetails: PanelDetails;
  setFormData: (
    direction: number,
    tilt: number,
    capacity: number,
    shouldTrigger: boolean
  ) => void;
  setMapData: (lat: number, long: number) => void;
}
interface PanelDetails {
  direction: string;
  tilt: string;
  capacity: string;
}

type FormPostData = {
  site_uuid: number;
  client_name: string;
  client_site_id: number;
  client_site_name: string;
  latitude: number;
  longitude: number;
  installed_capacity_kw: number;
  created_utc: string;
  updated_utc: string;
  orientation: number;
  tilt: number;
};

async function sendRequest(url: string, { arg }: { arg: FormPostData }) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg),
    headers: {
      'content-type': 'application/json',
    },
  });
}

const FormContext = React.createContext<Form | null>(null);

const FormProvider: FC<PropsWithChildren> = ({ children }) => {
  const { trigger } = useSWRMutation(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sites`,
    sendRequest
  );

  const [latLong, setLatLong] = useState<[number, number]>([
    originalLat,
    originalLng,
  ]);
  const [panelDetails, setPanelDetails] = useState<PanelDetails>({
    direction: '',
    tilt: '',
    capacity: '',
  });

  const setFormData = (
    direction: number,
    tilt: number,
    capacity: number,
    shouldTrigger: boolean
  ) => {
    setPanelDetails({
      direction: String(direction),
      tilt: String(tilt),
      capacity: String(capacity),
    });

    if (shouldTrigger) {
      const date = new Date().toISOString();
      const sentinel = 1;
      const data: FormPostData = {
        site_uuid: 1,
        client_name: 'name',
        client_site_id: 1,
        client_site_name: 'site_name',
        latitude: latLong[0],
        longitude: latLong[1],
        installed_capacity_kw: !!capacity ? capacity : sentinel,
        created_utc: date,
        updated_utc: date,
        orientation: direction,
        tilt: tilt,
      };
      trigger(data);
    }
  };
  const setMapData = (lat: number, long: number) => {
    setLatLong([lat, long]);
  };

  return (
    <FormContext.Provider
      value={{
        latLong,
        panelDetails,
        setFormData,
        setMapData,
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
