import React, { useState, useContext, FC, ReactNode } from 'react';
import useSWRMutation from 'swr/mutation';

interface Form {
  latLong: [number, number];
  direction: number;
  tilt: number;
  capacity: number;
  setFormData: (direction: number, tilt: number, capacity: number) => void;
  setMapData: (lat: number, long: number) => void;
}

interface FormProviderProps {
  children: ReactNode | ReactNode[];
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
  }).then((res) => res.json());
}

const FormContext = React.createContext<Form | null>(null);

const FormProvider: FC<FormProviderProps> = ({ children }) => {
  const { trigger } = useSWRMutation('/api/[...mockApiRoute]', sendRequest);

  const [latLong, setLatLong] = useState<[number, number]>([0, 0]);
  const [direction, setDirection] = useState(0);
  const [tilt, setTilt] = useState(0);
  const [capacity, setCapacity] = useState(0);

  const sendFormData = () => {
    const data: FormPostData = {
      site_uuid: 1,
      client_name: 'name',
      client_site_id: 1,
      client_site_name: 'site_name',
      latitude: latLong[0],
      longitude: latLong[1],
      installed_capacity_kw: capacity,
      created_utc: 'utc_create',
      updated_utc: 'utc_update',
      orientation: direction,
      tilt: tilt,
    };
    trigger(data);
  };
  const setFormData = (direction: number, tilt: number, capacity: number) => {
    setDirection(direction);
    setTilt(tilt);
    setCapacity(capacity);
    sendFormData();
  };
  const setMapData = (lat: number, long: number) => {
    setLatLong([lat, long]);
  };

  return (
    <FormContext.Provider
      value={{
        latLong,
        direction,
        tilt,
        capacity,
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
