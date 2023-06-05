import { PencilSquareIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { FC } from 'react';
import { getCurrentTimeGeneration } from '../generation';
import { skeleton } from '../skeleton';
import { ForecastData, Site } from '../types';
import { useNoScroll } from '../utils';
import SiteGraph from './graphs/SiteGraph';
import { DeleteIcon } from './icons';
import { getPreferredSiteName } from '../sites';

interface SiteCardProps {
  site: Site;
  forecastData: ForecastData;
  isEditMode: boolean;
}

const SiteCard: FC<SiteCardProps> = ({ site, forecastData, isEditMode }) => {
  useNoScroll();

  const currentOutput = forecastData
    ? getCurrentTimeGeneration(forecastData.forecast_values)
    : undefined;

  return (
    <div className="relative w-full overflow-hidden rounded-lg">
      <Link
        href={`/dashboard/${site.site_uuid}`}
        className={`flex h-fit w-full max-w-lg items-center overflow-hidden bg-ocf-black-500 font-bold ${
          isEditMode && 'pointer-events-none'
        }`}
      >
        <div className="flex w-[60%] flex-1 flex-col p-3 pl-5">
          <h2
            className={`text-lg font-semibold text-amber transition-all ${
              !forecastData ? skeleton : ``
            }`}
          >
            {!forecastData ? 'Loading...' : getPreferredSiteName(site)}
          </h2>
          <div className="mt-1 flex flex-col gap-1">
            <p
              className={`text-[10px] font-medium text-ocf-gray-500 transition-all ${
                !forecastData ? skeleton : ``
              }`}
            >
              Current output:{' '}
              {currentOutput != undefined
                ? currentOutput.toFixed(1) + ' kW'
                : 'loading...'}
            </p>
            {site.inverter_capacity_kw !== null && (
              <p
                className={`text-[10px] font-medium text-ocf-gray-500 transition-all ${
                  !forecastData ? skeleton : ''
                }`}
              >
                Max. capacity: {site.inverter_capacity_kw?.toFixed(1)} kW
              </p>
            )}
            <p
              className={`text-[10px] font-medium text-ocf-gray-500 transition-all ${
                !forecastData ? skeleton : ``
              }`}
            >
              Current yield:{' '}
              {site.inverter_capacity_kw && currentOutput != undefined
                ? (currentOutput / site.inverter_capacity_kw).toFixed(1) + '%'
                : 'loading...'}
            </p>
          </div>
        </div>

        <div className={`pointer-events-none mr-5 w-[40%]`}>
          {/* TODO: find out why this left is necessary */}
          {!forecastData ? (
            <div className="h-[100px]"></div>
          ) : (
            <div className="relative -left-7 top-2">
              <SiteGraph
                height={80}
                generationData={forecastData.forecast_values}
                sites={[site]}
                hidden={isEditMode}
                period={5}
              />
            </div>
          )}
        </div>
      </Link>
      <div
        // @ts-ignore
        inert={!isEditMode ? '' : null}
        className={'absolute left-[100%] top-0 flex h-full w-full'}
      >
        <Link
          href={`/site-details/${site.site_uuid}`}
          className={`flex-end pointer-events-auto flex h-full w-[15%] min-w-[70px] justify-center bg-amber transition duration-[700ms] ease-in-out ${
            isEditMode ? '-translate-x-[200%]' : 'duration-[500ms]'
          }`}
        >
          <div className="flex flex-col items-center justify-center self-center">
            <div className="mb-2 flex-1">
              <PencilSquareIcon color="#14120E" width="24" height="24" />
            </div>
            <p className="flex-1 px-5	text-center text-[8px]">
              Edit site details
            </p>
          </div>
        </Link>
        <Link
          href={'/site-details'}
          className={`flex-end pointer-events-auto flex h-full w-[15%] min-w-[70px] justify-center bg-[#D44545] transition duration-[500ms] ease-in-out ${
            isEditMode ? '-translate-x-[200%]' : 'duration-[700ms]'
          }`}
        >
          <div className="flex flex-col items-center justify-center self-center">
            <div className="mb-2 flex-1">
              <DeleteIcon />
            </div>
            <p className="mb-2 flex-1	px-5 text-center text-[8px] text-[#E4E4E4]">
              Delete site
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SiteCard;
