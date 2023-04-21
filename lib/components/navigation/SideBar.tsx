import { FC, useEffect, useRef } from 'react';

import { XMarkIcon } from '@heroicons/react/24/solid';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { useClickedOutside } from '~/lib/utils';

import { useSites } from '~/lib/sites';
import DashboardLink from './DashboardLink';
import MenuLink from './MenuLink';

interface SideBarProps {
  open: boolean;
  onClose: () => void;
}

const SideBar: FC<SideBarProps> = ({ open, onClose }) => {
  const router = useRouter();
  useEffect(() => {
    router.events.on('routeChangeComplete', onClose);
    return () => router.events.off('routeChangeComplete', onClose);
  }, [onClose, router]);

  const { sites } = useSites();

  const wrapperRef = useRef(null);
  useClickedOutside(wrapperRef, () => {
    if (open) {
      onClose();
    }
  });

  const generateSiteLinks = () => {
    if (sites) {
      // TODO: remove hard-coded limit of 5 solar panel sites
      return sites
        .slice(0, 5)
        .map((site, idx) => (
          <DashboardLink
            key={site.site_uuid}
            siteName={site.client_site_name || `Site ${idx + 1}`}
            href={`/dashboard/${site.site_uuid}`}
            sites={[site]}
          />
        ));
    }
    return null;
  };

  return (
    <div
      className={`fixed top-0 z-50 h-full transition-all duration-500 ${
        open
          ? 'translate-x-0 shadow-side-bar shadow-ocf-black'
          : '-translate-x-[100%]'
      }`}
      // @ts-ignore
      inert={!open ? '' : null}
      ref={wrapperRef}
    >
      <div className="w-84 relative flex h-full flex-col overflow-y-auto bg-ocf-black px-10 py-8">
        <div className="mt-6 flex flex-1 flex-col justify-between text-xs">
          <div className="flex flex-col">
            {sites.length > 1 && (
              <>
                <div className="mb-7 flex flex-row items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">
                    Dashboards
                  </h2>
                  <button onClick={onClose}>
                    <XMarkIcon height="30" width="30" color="white" />
                  </button>
                </div>

                <DashboardLink
                  siteName="Aggregate"
                  href="/dashboard"
                  sites={sites}
                />
              </>
            )}

            <h2 className="mb-3 mt-8 text-sm font-medium text-white">
              Site Dashboards
            </h2>

            <div className="flex flex-col gap-3">{generateSiteLinks()}</div>
          </div>
          <div className="flex flex-col gap-3">
            <MenuLink
              href="/site-details"
              label="Add a site"
              svg={<PlusCircleIcon height="24" width="24" color="white" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
