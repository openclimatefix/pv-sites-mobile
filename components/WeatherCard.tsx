import { FC } from 'react';
import { getTotalExpectedOutput } from '~/lib/utils';
import { useSiteData } from '~/lib/hooks';

type WeatherProps = {
  kWh: number;
  siteUUID: string;
};

export const cloudyThreshold = 0.3;
export const sunnyThreshold = 0.7;

const WeatherCard: FC<WeatherProps> = ({ kWh, siteUUID }) => {
  const { forecastData } = useSiteData(siteUUID);
  if (forecastData) {
    const totalExpectedOutput = getTotalExpectedOutput(
      forecastData.forecast_values
    );
  }

  return (
    <div className="bg-ocf-black-500 rounded-lg">
      <div className="w-full pt-3 pb-8 flex justify-center align-middle gap-4"></div>
    </div>
  );
};

export default WeatherCard;
