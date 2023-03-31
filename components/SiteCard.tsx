import Link from 'next/link';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useSiteData } from '~/lib/hooks';
import { getCurrentTimeForecast } from '~/lib/utils';
import { DeleteIcon, EditIcon } from './icons';
import { transitionDuration } from '~/pages/sites';
import SiteGraph from './graphs/SiteGraph';

interface SiteCardProps {
  href?: string;
  onClick?: () => void;
  siteUUID: string;
  isEditMode: boolean;
}

const SiteCard = React.forwardRef<HTMLAnchorElement, SiteCardProps>(
  ({ href, siteUUID, onClick, isEditMode }, ref) => {
    const animationElement = useRef<HTMLDivElement>(null);
    const [displayGraph, setDisplayGraph] = useState(!isEditMode);
    const { forecastData, client_site_name, installed_capacity_kw, isLoading } =
      useSiteData(siteUUID);

    const currentOutput = forecastData
      ? getCurrentTimeForecast(forecastData.forecast_values)
      : undefined;

    useEffect(() => {
      animationElement.current?.addEventListener('transitionend', () => {
        if (isEditMode) {
          setDisplayGraph(false);
        } else {
          setDisplayGraph(true);
        }
      });
    }, [isEditMode]);

    return (
      <a
        onClick={onClick}
        ref={ref}
        href={!isEditMode ? href : '#0'}
        className={`h-fit w-full max-w-lg flex flex-row bg-ocf-black-500 rounded-lg font-bold overflow-hidden ${
          isEditMode && 'pointer-events-none'
        }`}
        tabIndex={isEditMode ? -1 : 1}
      >
        <div className="flex flex-col flex-1 p-4 pl-5">
          <h2 className="text-amber text-xl font-semibold">
            {isLoading ? 'Loading...' : client_site_name ?? 'My Site'}
          </h2>
          <div className="flex flex-col mt-2 gap-1">
            <p className="text-ocf-gray-500 text-xs font-medium">
              {`Current output: ${
                currentOutput != undefined
                  ? currentOutput.toFixed(2) + ' kW'
                  : 'loading...'
              }`}
            </p>
            {installed_capacity_kw && (
              <p className="text-ocf-gray-500 font-medium text-xs">
                Max. capacity: {installed_capacity_kw.toFixed(2)} kW
              </p>
            )}
            <p className="text-ocf-gray-500 font-medium text-xs">
              {`Current yield:
            ${
              installed_capacity_kw && currentOutput != undefined
                ? (currentOutput / installed_capacity_kw).toFixed(2) + '%'
                : 'loading...'
            }`}
            </p>
          </div>
        </div>

        <div
          className={`justify-center self-center mr-5 transition-all overflow-hidden max-w-[250px] ${
            !isEditMode ? 'flex-1' : 'flex-0 w-0'
          } duration-[${transitionDuration}ms]`}
          ref={animationElement}
        >
          {displayGraph && <SiteGraph siteUUID={siteUUID} />}
        </div>

        <div
          className={`transition-all ${
            isEditMode ? 'w-4/12' : 'w-0'
          } duration-[${transitionDuration}ms] flex translate-x-40`}
        >
          <Link
            href={'/site-details'}
            className={`fixed right-0`}
            passHref
            legacyBehavior
          >
            <a
              className={`w-full flex bg-amber flex-end justify-center ease-in-out transition duration-[${transitionDuration}ms] pointer-events-auto ${
                isEditMode ? '-translate-x-40' : 'translate-x-40'
              }`}
              tabIndex={isEditMode ? 1 : -1}
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
          <Link
            href={'/site-details'}
            className={`fixed right-0`}
            passHref
            legacyBehavior
          >
            <a
              className={`w-full flex bg-[#D44545] flex-end justify-center ease-in-out transition duration-[${transitionDuration}ms] pointer-events-auto ${
                isEditMode ? '-translate-x-40' : 'translate-x-0'
              }`}
              tabIndex={isEditMode ? 1 : -1}
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
      </a>
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
    <Link href="/dashboard" passHref>
      <SiteCard siteUUID={siteUUID} isEditMode={isEditMode} />
    </Link>
  );
};

export default SiteCardLink;
