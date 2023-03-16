import Image from 'next/image';
import { FC } from 'react';
import { useSiteData } from '~/lib/hooks';
import { getCurrentTimeForecast } from '~/lib/utils';
import content from '../../content/power-card-content.json';
import NumberDisplay from './NumberDisplay';
import useTime from '~/lib/hooks/useTime';
import NightimeIcon from '../icons/NightimeIcon';

/**
 * Determines the appliance with the greatest energy required that is less than or equal to the current output
 * @param currentOutput the current output in kW based on the getCurrentTimeForecast
 * @returns the index of the appliance with the greatest enrgy requiement less than or equal to the current ouput
 * or -1 if an index could not be found
 */

const getBestRecommendationIndex = (currentOutput: number) => {
  let maxIndex = null;
  let maxKW = 0;

  content.appliances.forEach((appliance, i) => {
    if (Number(appliance.kW) > maxKW && Number(appliance.kW) <= currentOutput) {
      maxIndex = i;
      maxKW = Number(appliance.kW);
    }
  });

  return maxIndex;
};

const EnergyRecommendation: FC<{ siteUUID: string }> = ({ siteUUID }) => {
  const { forecastData, latitude, longitude, isLoading } =
    useSiteData(siteUUID);
  const currentOutput = forecastData
    ? getCurrentTimeForecast(forecastData.forecast_values)
    : undefined;

  const recommendationIdx = currentOutput
    ? getBestRecommendationIndex(currentOutput)
    : null;
  const { isDaytime } = useTime(latitude, longitude);
  if (recommendationIdx === null) {
    return <NumberDisplay title="Recommendations" value="N/A" />;
  } else {
    const appliance = content.appliances[recommendationIdx];
    return (
      <div
        className="
          flex-1
          flex
          my-2
          p-4
          text-center
          justify-center
          align-center
          bg-ocf-gray-1000
          rounded-2xl"
      >
        {isDaytime ? (
          <Image
            src={appliance.icon}
            alt={appliance.name}
            width={34.5}
            height={28.75}
          />
        ) : (
          <NightimeIcon />
        )}
        <div className="text-ocf-gray ml-3 self-center font-normal text-left flex-1 max-w-max">
          <p className="m-0 text-[10px] mb-1">
            {isDaytime
              ? appliance.description
              : 'The solar output is currently 0'}
          </p>
        </div>
      </div>
    );
  }
};

export default EnergyRecommendation;
