import React, { ReactNode, useCallback, useEffect, useRef } from 'react';
import { useSideBarContext } from '~/lib/context/sidebar';
import Link from 'next/link';

import { ExitIcon, CirclePlusIcon } from '../icons';

import { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { useClickedOutside } from '../../lib/hooks';

import { useSites, useSiteData, useSiteAggregation } from '../../lib/hooks';
import { getCurrentTimeGeneration } from '~/lib/utils';
import { useMemo } from 'react';

import SiteGraph from '../graphs/SiteGraph';

type MenuLinkProps = {
  linkProps: LinkProps;
  label: string;
  svg: ReactNode;
  currentPath: string;
};

const MenuLink: React.FC<MenuLinkProps> = ({
  linkProps,
  label,
  svg,
  currentPath,
}) => {
  const textColor =
    linkProps.href === currentPath ? 'text-amber' : 'text-white';
  return (
    <Link {...linkProps}>
      <a>
        <div
          className={`px-4 py-2 flex items-center rounded-md text-gray-600 hover:text-gray-700 hover:bg-ocf-gray-1000 transition-colors transform`}
        >
          <div className={textColor}>{svg}</div>
          <span
            className={`mx-4 font-medium flex-1 align-center text-lg ${textColor}`}
          >
            {label}
          </span>
        </div>
      </a>
    </Link>
  );
};

type DashboardLinkProps = {
  siteName: string;
  linkProps: LinkProps;
  currentPath: string;
  siteUUID?: string;
  allSiteUUID?: string[];
};

const DashboardLink: React.FC<DashboardLinkProps> = ({
  linkProps,
  siteName,
  currentPath,
  siteUUID,
  allSiteUUID,
}) => {
  const textColor =
    linkProps.href === currentPath ? 'text-white' : 'text-ocf-gray-800';
  const borderColor =
    linkProps.href === currentPath ? 'border-amber' : 'border-ocf-gray-1000';

  // const { forecastData } = useSiteData(siteUUID || '');
  // const { totalExpectedGeneration } = useSiteAggregation(allSiteUUID || []);

  // const currentOutput = useMemo(() => {
  //   if (allSiteUUID) {
  //     return totalExpectedGeneration
  //       ? getCurrentTimeGeneration(totalExpectedGeneration)
  //       : undefined;
  //   }
  //   return forecastData
  //     ? getCurrentTimeGeneration(forecastData.forecast_values)
  //     : undefined;
  // }, [forecastData, allSiteUUID, totalExpectedGeneration]);

  return (
    <Link {...linkProps}>
      <div
        className={`${borderColor} border flex-1 p-5 flex flex-row justify-center text-center md:text-left bg-ocf-black-500 rounded-2xl w-full h-full`}
      >
        <div className="flex flex-col flex-1 justify-center">
          <div
            className={`mb-2 text-lg ${textColor} font-semibold transition-all md:font-medium md:leading-none`}
          >
            {siteName}
          </div>
          {/* {currentOutput !== undefined && (
            <div
              className={`text-md ${textColor} font-medium leading-none transition-all md:leading-none`}
            >
              Current output: {currentOutput} kW
            </div>
          )} */}
        </div>
        <div className="flex-1">
          {siteUUID && <SiteGraph siteUUID={siteUUID} hidden={false} />}
        </div>
      </div>
    </Link>
  );
};

const SideBar = () => {
  const { isSideBarOpen, closeSideBar } = useSideBarContext();
  const router = useRouter();
  useEffect(() => {
    router.events.on('routeChangeComplete', closeSideBar);
    return () => router.events.off('routeChangeComplete', closeSideBar);
  }, [closeSideBar, router]);
  const wrapperRef = useRef(null);

  const { sites } = useSites();

  const clickOutsideSideBarHandler = () => {
    if (isSideBarOpen) {
      closeSideBar();
    }
  };

  useClickedOutside(wrapperRef, clickOutsideSideBarHandler);

  const generateSiteLinks = () => {
    if (sites) {
      // TODO: remove hard-coded limit of 5 solar panel sites
      return sites
        .filter((_, idx) => idx < 5)
        .map((site, idx) => (
          <DashboardLink
            key={site.client_site_id}
            siteName={site.client_site_name || `Site ${idx + 1}`}
            currentPath={router.asPath}
            linkProps={{ href: `/dashboard/${site.site_uuid}` }}
            siteUUID={site.site_uuid}
          />
        ));
    }
    return null;
  };

  return (
    <div
      className={`z-50 transition-all duration-500 h-full fixed top-0 ${
        isSideBarOpen
          ? 'translate-x-0 shadow-lg shadow-ocf-black'
          : '-translate-x-[100%]'
      }`}
      // @ts-ignore
      inert={!isSideBarOpen ? '' : null}
      ref={wrapperRef}
    >
      <div className="flex h-full overflow-y-auto flex-col bg-ocf-black w-84 px-4 py-8 relative">
        <div className="flex mt-2 w-full flex-row justify-between content-center">
          <h1 className="text-white text-xl font-medium">Dashboards</h1>
          <button
            onClick={closeSideBar}
            className="text-white w-8 h-8 rounded-full flex items-center justify-center ml-6"
          >
            <ExitIcon />
          </button>
        </div>
        <div className="text-xs	flex flex-col mt-6 justify-between flex-1">
          <div className="flex flex-col gap-3">
            <DashboardLink
              siteName="Aggregate"
              currentPath={router.asPath}
              linkProps={{ href: `/dashboard` }}
              allSiteUUID={sites?.map((site) => site.site_uuid)}
            />

            <h1 className="text-white text-lg mt-5 font-normal">
              Site Dashboards
            </h1>

            {generateSiteLinks()}
          </div>
          <div className="flex flex-col gap-3">
            <MenuLink
              linkProps={{
                href: `/site-details`,
              }}
              label="Add a site"
              svg={<CirclePlusIcon />}
              currentPath={router.asPath}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
