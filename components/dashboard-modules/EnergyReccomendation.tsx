import Image from 'next/image';
import { FC } from 'react';
import { useSiteData } from '~/lib/hooks';
import { getCurrentTimeForecast } from '~/lib/utils';
import content from '../../content/energy-rec-content.json';

/**
 * Determines the appliance with the greatest energy required that is less than or equal to the current output
 * @param currentOutput the current output in kw based on the getCurrentTimeForecast
 * @returns the index of the appliance with the greatest enrgy requiement less than or equal to the current ouput
 */

const getBestRecomendationIndex = (currentOutput: number | undefined) => {
  if (currentOutput != undefined) {
    let maxIndex = -1;
    let maxKW = 0;
    for (let i = 0; i < content.appliances.length; i++) {
      const currAppliance = content.appliances[i];
      if (currAppliance.kW > maxKW && currAppliance.kW <= currentOutput) {
        maxIndex = i;
        maxKW = currAppliance.kW;
      }
    }
    return maxIndex;
  }
  return -1;
};

const EnergyRecommendation: FC<{ siteUUID: string }> = ({ siteUUID }) => {
  const { forecastData, isLoading } = useSiteData(siteUUID);
  const currentOutput = forecastData
    ? getCurrentTimeForecast(forecastData.forecast_values)
    : undefined;
  const testOuput = 240;
  const reccomendation = getBestRecomendationIndex(testOuput);
  console.log(reccomendation);
  //   console.log(content.appliances[reccomendation]);
  return (
    <div
      className="
      flex-1
      flex
      my-2
      p-4
      text-center
      bg-ocf-gray-1000
      rounded-2xl"
    >
      <Image src="/car.svg" alt="" width={75} height={75} className="flex-1" />
      <div className="text-ocf-gray ml-3 self-center font-semibold text-left">
        <p className="m-0 text-[10px] mb-1 font-semibold">
          You have enough energy to charge your car.
        </p>
        {/* <p className="text-sm ">10 kW</p> */}
      </div>
    </div>
  );
};

export default EnergyRecommendation;
