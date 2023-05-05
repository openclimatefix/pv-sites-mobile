import Link from 'next/link';
import React, { FC } from 'react';
import SiteGraph from './graphs/SiteGraph';
import { DeleteIcon } from './icons';
import { getCurrentTimeGeneration } from '../generation';
import { useSiteData } from '../sites';
import { Site } from '../types';
import { skeleton } from '../skeleton';
import { useNoScroll } from '../utils';
import { PencilSquareIcon } from '@heroicons/react/24/solid';

interface SiteCardProps {
  site: Site;
  isEditMode: boolean;
}

const SiteCard: FC<SiteCardProps> = ({ site, isEditMode }) => {
  useNoScroll();

  const { forecastData, error } = useSiteData(site.site_uuid);

  const noError = error.errors.every((error) => error === undefined);

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
        <div className="flex w-[60%] flex-1 flex-col p-4 pl-5">
          <h2
            className={`text-xl font-semibold text-amber transition-all ${
              !forecastData ? skeleton : ``
            }`}
          >
            {forecastData ? 'Loading...' : site.client_site_name ?? 'My Site'}
          </h2>
          <div className="mt-2 flex flex-col gap-1">
            <p
              className={`text-xs font-medium text-ocf-gray-500 transition-all ${
                !forecastData ? skeleton : ``
              }`}
            >
              Current output:{' '}
              {currentOutput != undefined
                ? currentOutput.toFixed(2) + ' kW'
                : 'loading...'}
            </p>
            {site.inverter_capacity_kw !== null && (
              <p
                className={`text-xs font-medium text-ocf-gray-500 transition-all ${
                  !forecastData ? skeleton : ''
                }`}
              >
                Max. capacity: {site.inverter_capacity_kw?.toFixed(2)} kW
              </p>
            )}
            <p
              className={`text-xs font-medium text-ocf-gray-500 transition-all ${
                !forecastData ? skeleton : ``
              }`}
            >
              Current yield:{' '}
              {site.inverter_capacity_kw && currentOutput != undefined
                ? (currentOutput / site.inverter_capacity_kw).toFixed(2) + '%'
                : 'loading...'}
            </p>
          </div>
        </div>

        <div className={`pointer-events-none mr-5 w-[40%]`}>
          {/* TODO: find out why this left is necessary */}
          {forecastData || !noError == undefined ? (
            <div className="h-[100px]"></div>
          ) : (
            <div className="relative -left-7">
              <SiteGraph sites={[site]} hidden={isEditMode} />
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
