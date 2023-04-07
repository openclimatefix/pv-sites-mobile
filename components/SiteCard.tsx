import Link from 'next/link';
import React, { FC } from 'react';
import { useSiteData } from '~/lib/hooks';
import { getCurrentTimeGeneration } from '~/lib/utils';
import SiteGraph from './graphs/SiteGraph';
import { DeleteIcon, EditIcon } from './icons';

interface SiteCardProps {
  href?: string;
  onClick?: () => void;
  siteUUID: string;
  isEditMode: boolean;
}

const SiteCard = React.forwardRef<HTMLAnchorElement, SiteCardProps>(
  ({ href, siteUUID, onClick, isEditMode }, ref) => {
    const {
      forecastData,
      client_site_name,
      installed_capacity_kw,
      isLoading,
      error,
    } = useSiteData(siteUUID);

    const skeleton = `flex-1 text-transparent bg-ocf-gray-1000 w-[100%] rounded-2xl animate-pulse select-none`;
    const noError = error.errors.every((error) => error === undefined);

    const currentOutput = forecastData
      ? getCurrentTimeGeneration(forecastData.forecast_values)
      : undefined;

    return (
      <div className="relative overflow-hidden rounded-lg w-full">
        <a
          onClick={onClick}
          ref={ref}
          href={!isEditMode ? href : '#0'}
          className={`h-fit w-full max-w-lg flex items-center bg-ocf-black-500 font-bold overflow-hidden ${
            isEditMode && 'pointer-events-none'
          }`}
        >
          <div className="flex flex-col flex-1 w-[60%] p-4 pl-5">
            <h2
              className={`text-amber text-xl font-semibold transition-all ${
                isLoading || !noError ? skeleton : ``
              }`}
            >
              {isLoading ? 'Loading...' : client_site_name ?? 'My Site'}
            </h2>
            <div className="flex flex-col mt-2 gap-1">
              <p
                className={`text-ocf-gray-500 text-xs font-medium transition-all ${
                  isLoading || !noError ? skeleton : ``
                }`}
              >
                {`Current output: ${
                  currentOutput != undefined
                    ? currentOutput.toFixed(2) + ' kW'
                    : 'loading...'
                }`}
              </p>
              {installed_capacity_kw && (
                <p
                  className={`text-ocf-gray-500 font-medium text-xs transition-all ${
                    isLoading || !noError ? skeleton : ``
                  }`}
                >
                  Max. capacity: {installed_capacity_kw.toFixed(2)} kW
                </p>
              )}
              <p
                className={`text-ocf-gray-500 font-medium text-xs transition-all ${
                  isLoading || !noError ? skeleton : ``
                }`}
              >
                {`Current yield:
            ${
              installed_capacity_kw && currentOutput != undefined
                ? (currentOutput / installed_capacity_kw).toFixed(2) + '%'
                : 'loading...'
            }`}
              </p>
            </div>
          </div>

          <div className={`mr-5 w-[40%] pointer-events-none`}>
            {/* TODO: find out why this left is necessary */}
            {isLoading || !noError == undefined ? (
              <div className="h-[100px]"></div>
            ) : (
              <div className="relative -left-7">
                <SiteGraph siteUUID={siteUUID} hidden={isEditMode} />
              </div>
            )}
          </div>
        </a>
        <div
          // @ts-ignore
          inert={!isEditMode ? '' : null}
          className={'absolute left-[100%] top-0 flex h-full w-full'}
        >
          <Link href={'/site-details'} passHref>
            <a
              className={`flex h-full bg-amber w-[15%] min-w-[70px] flex-end justify-center ease-in-out transition duration-[700ms] pointer-events-auto ${
                isEditMode ? '-translate-x-[200%]' : 'duration-[500ms]'
              }`}
            >
              <div className="flex flex-col self-center justify-center items-center">
                <div className="flex-1 mb-2">
                  <EditIcon color="#14120E" />
                </div>
                <p className="flex-1 text-[8px]	text-center px-5">
                  Edit site details
                </p>
              </div>
            </a>
          </Link>
          <Link href={'/site-details'} passHref>
            <a
              className={`flex h-full bg-[#D44545] flex-end w-[15%] min-w-[70px] justify-center ease-in-out transition duration-[500ms] pointer-events-auto ${
                isEditMode ? '-translate-x-[200%]' : 'duration-[700ms]'
              }`}
            >
              <div className="flex flex-col self-center justify-center items-center">
                <div className="flex-1 mb-2">
                  <DeleteIcon />
                </div>
                <p className="flex-1 text-[8px]	text-center px-5 text-[#E4E4E4] mb-2">
                  Delete site
                </p>
              </div>
            </a>
          </Link>
        </div>
      </div>
    );
  }
);

SiteCard.displayName = 'SiteCard';

interface SiteCardLinkProps {
  isEditMode: boolean;
  siteUUID: string;
}

const SiteCardLink: FC<SiteCardLinkProps> = ({ isEditMode, siteUUID }) => {
  return (
    <Link href={`/dashboard/${siteUUID}`} passHref>
      <SiteCard siteUUID={siteUUID} isEditMode={isEditMode} />
    </Link>
  );
};

export default SiteCardLink;
