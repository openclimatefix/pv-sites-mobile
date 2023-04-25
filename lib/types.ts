export interface Site {
  site_uuid: string;
  client_name: string;
  client_site_id: string;
  client_site_name: string;
  region?: string;
  dno?: string;
  gsp?: string;
  orientation?: number;
  tilt?: number;
  latitude: number;
  longitude: number;
  installed_capacity_kw: number;
  created_utc: string;
  updated_utc: string;
}

export interface GenerationDataPoint {
  datetime_utc: Date;
  generation_kw: number;
}

export interface UnparsedForecastData {
  forecast_uuid: string;
  site_uuid: string;
  forecast_creation_datetime: string;
  forecast_version: string;
  forecast_values: UnparsedForecastDataPoint[];
}

export interface UnparsedForecastDataPoint {
  target_datetime_utc: string;
  expected_generation_kw: number;
}

export type ForecastData = Omit<
  UnparsedForecastData,
  'forecast_values' | 'forecast_creation_datetime'
> & {
  forecast_creation_datetime: Date;
  forecast_values: GenerationDataPoint[];
};

export interface UnparsedActualData {
  site_uuid: string;
  pv_actual_values: UnparsedActualDataPoint[];
}

export interface UnparsedActualDataPoint {
  datetime_utc: string;
  actual_generation_kw: number;
}

export type ActualData = Omit<UnparsedActualData, 'pv_actual_values'> & {
  pv_actual_values: GenerationDataPoint[];
};

export interface UnparsedClearSkyData {
  clearsky_estimate: UnparsedClearSkyDataPoint[];
}

export interface UnparsedClearSkyDataPoint {
  target_datetime_utc: string;
  clearsky_generation_kw: number;
}

export type ClearSkyData = Omit<UnparsedClearSkyData, 'clearsky_estimate'> & {
  clearsky_estimate: GenerationDataPoint[];
};

export interface LatitudeLongitude {
  latitude: number;
  longitude: number;
}

export interface Form {
  siteCoordinates: LatitudeLongitude;
  panelDetails: PanelDetails;
  setFormData: ({ siteName, direction, tilt, capacity }: PanelDetails) => void;
  setSiteCoordinates: ({ latitude, longitude }: LatitudeLongitude) => void;
  postPanelData: () => Promise<void>;
}

export interface PanelDetails {
  siteName: string;
  direction: string;
  tilt: string;
  capacity: string;
}

export type FormPostData = {
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

export type Inverter = {
  id: string;
  vendor: string;
  chargingLocationId: string | null;
  lastSeen: string;
  isReachable: boolean;
  productionState: {
    productionRate: number | null;
    isProducing: boolean | null;
    totalLifetimeProduction: number | null;
    lastUpdated: string | null;
  };
  information: {
    id: string;
    brand: string;
    model: string;
    siteName: string;
    installationDate: string;
  };
  location: {
    longitude: number | null;
    latitude: number | null;
  };
};

export type Inverters = {
  inverters: Inverter[];
};
