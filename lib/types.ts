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
