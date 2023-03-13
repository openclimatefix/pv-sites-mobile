import Image from 'next/image';
import { FC } from 'react';
import { useSiteData } from '~/lib/hooks';
import { getCurrentTimeForecast } from '~/lib/utils';

/**
 * Determines the appliance with the greatest energy required that is less than or equal to the current output
 * @param forecast_values expected generated forecast values (kilowatts) at specific times
 * @returns Object containing hour difference between the next date and
 */
const getBestRecomendationIndex = (currentOutput: number) => {
  //   for (let i = 0; i <)
};

const EnergyRecommendation: FC<{ siteUUID: string }> = ({ siteUUID }) => {
  const { forecastData, isLoading } = useSiteData(siteUUID);
  const currentOutput = forecastData
    ? getCurrentTimeForecast(forecastData.forecast_values)
    : undefined;
  console.log(typeof currentOutput);
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
