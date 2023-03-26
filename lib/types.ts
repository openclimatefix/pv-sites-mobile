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

export interface SiteList {
  site_list: Site[];
}

export interface ForecastDataPoint {
  target_datetime_utc: number;
  expected_generation_kw: number;
}

export interface ForecastData {
  forecast_uuid: string;
  site_uuid: string;
  forecast_creation_datetime: number;
  forecast_version: string;
  forecast_values: ForecastDataPoint[];
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
export interface LatitudeLongitude {
  latitude: number;
  longitude: number;
}

export interface Form {
  siteCoordinates: LatitudeLongitude;
  panelDetails: PanelDetails;
  setFormData: ({ siteName, direction, tilt, capacity }: PanelDetails) => void;
  setSiteCoordinates: ({ latitude, longitude }: LatitudeLongitude) => void;
  postPanelData: () => void;
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
