export enum VIEWS {
  FORECAST = "FORECAST",
  DELTA = "DELTA",
  SOLAR_SITES = "SOLAR SITES"
}

export enum DELTA_BUCKET {
  NEG4 = -80,
  NEG3 = -60,
  NEG2 = -40,
  NEG1 = -20,
  ZERO = 0,
  POS1 = 20,
  POS2 = 40,
  POS3 = 60,
  POS4 = 80
}
export const getDeltaBucketKeys = () => Object.keys(DELTA_BUCKET).filter((k) => isNaN(Number(k)));
