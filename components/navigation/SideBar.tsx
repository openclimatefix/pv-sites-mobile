import React, { useEffect, useRef } from 'react';
import { useSideBarContext } from '~/lib/context/sidebar';

import { ExitIcon, CirclePlusIcon } from '../icons';

import { useRouter } from 'next/router';
import { useClickedOutside } from '../../lib/hooks';

import { useSites } from '../../lib/hooks';
import MenuLink from './MenuLink';
import DashboardLink from './DashboardLink';

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
        .slice(0, 5)
        .map((site, idx) => (
          <DashboardLink
            key={site.client_site_id}
            siteName={site.client_site_name || `Site ${idx + 1}`}
            currentPath={router.asPath}
            linkProps={{ href: `/dashboard/${site.site_uuid}` }}
            allSiteUUID={[site.site_uuid]}
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
          <div className="flex flex-col gap-3 pb-3">
            <DashboardLink
              siteName="Aggregate"
              currentPath={router.asPath}
              linkProps={{ href: `/dashboard` }}
              allSiteUUID={sites?.map((site) => site.site_uuid) || []}
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
