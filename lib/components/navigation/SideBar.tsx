import { FC, useEffect, useRef, useState } from 'react';

import { PencilSquareIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import { useClickedOutside } from '~/lib/utils';

import {
  useSitesGeneration,
  useSites,
  getPreferredSiteName,
} from '~/lib/sites';
import DashboardLink from './DashboardLink';
import MenuLink from './MenuLink';
import Button from '../Button';

const sitesDisplayedIncrement = 5;

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
  const [isEditMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [maxSitesDisplayed, setMaxSitesDisplayed] = useState(
    sitesDisplayedIncrement
  );
  const { manyForecastData, aggregateForecastedGeneration } =
    useSitesGeneration(sites);
  const wrapperRef = useRef(null);

  useClickedOutside(wrapperRef, () => {
    if (open) {
      resetStatesAndClose();
    }
  });

  const handleEditClick = () => {
    setEditMode(!isEditMode);
    setSelected(null);
  };

  const resetStatesAndClose = () => {
    setEditMode(false);
    setSelected(null);
    onClose();
  };

  const generateSiteLinks = () => {
    if (!sites || !manyForecastData) {
      return null;
    }

    return sites.slice(0, maxSitesDisplayed).map((site, i) => (
      <div
        key={site.site_uuid}
        className="flex flex-row"
        onClick={() => {
          if (isEditMode) {
            setSelected(selected === site.site_uuid ? null : site.site_uuid);
          }
        }}
      >
        {isEditMode && (
          <div className="self-center">
            <input
              type="radio"
              className="peer sr-only mr-5"
              checked={site.site_uuid === selected}
            />
            <span className="mr-5 inline-block h-5 w-5 cursor-pointer rounded-full border-[3px] border-ocf-black ring-2 ring-ocf-gray-300 peer-checked:rounded-full peer-checked:bg-ocf-gray-300" />
          </div>
        )}
        <DashboardLink
          key={site.site_uuid}
          siteName={getPreferredSiteName(site)}
          href={`/dashboard/${site.site_uuid}`}
          sites={[site]}
          active={isEditMode ? site.site_uuid === selected : undefined}
          generationData={manyForecastData[i].forecast_values}
          onClick={(e) => {
            if (isEditMode) {
              e.preventDefault();
            }
          }}
        />
      </div>
    ));
  };

  return (
    <div
      className={`fixed top-0 z-50 h-full transition-all duration-500 ${
        open
          ? 'translate-x-0 border-r-[0.5px] border-white'
          : '-translate-x-[100%]'
      }`}
      // @ts-ignore
      inert={!open ? '' : null}
      ref={wrapperRef}
    >
      <div className="relative flex h-full w-96 flex-col justify-between overflow-y-auto bg-ocf-black px-10 py-8 pt-12">
        <div className="flex flex-col">
          {sites.length > 1 && (
            <>
              <div className="mb-7 flex flex-row items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Dashboards</h2>
                <button onClick={resetStatesAndClose}>
                  <XMarkIcon height="30" width="30" color="white" />
                </button>
              </div>

              <DashboardLink
                siteName="Aggregate"
                href="/dashboard"
                sites={sites}
                generationData={aggregateForecastedGeneration}
                active={isEditMode ? false : undefined}
                onClick={(e) => {
                  if (isEditMode) {
                    e.preventDefault();
                  }
                }}
              />
            </>
          )}

          <h2 className="mb-3 mt-8 text-sm font-medium text-white">
            Site Dashboards
          </h2>

          <div className="flex flex-col gap-3">
            {open && generateSiteLinks()}

            {sites.length > maxSitesDisplayed && (
              <Button
                className="self-center"
                variant="outlined"
                onClick={() => {
                  setMaxSitesDisplayed(
                    (current) => current + sitesDisplayedIncrement
                  );
                }}
              >
                Load more sites
              </Button>
            )}
          </div>
        </div>
        {selected && (
          <button
            onClick={() => {
              router.push(`/site-details/${selected}`);
            }}
            disabled={selected === null}
            className="mt-5 rounded-md border-2 border-amber text-center"
          >
            <div className="rounded-md py-3 text-center text-gray-600 transition-all">
              <p className="text-center text-base font-medium text-amber">
                Continue to editing site
              </p>
            </div>
          </button>
        )}
        <div className="mt-10 flex flex-col">
          <button onClick={handleEditClick}>
            <div className="flex items-center gap-3 rounded-md px-4 py-2 text-gray-600 transition-all hover:bg-ocf-gray-1000 hover:text-gray-700">
              <div className={isEditMode ? 'text-amber' : 'text-white'}>
                <PencilSquareIcon height="24" width="24" />
              </div>
              <span
                className={`text-lg font-medium ${
                  isEditMode ? 'text-amber' : 'text-white'
                }`}
              >
                Edit site details
              </span>
            </div>
          </button>
          <MenuLink
            href="/site-details"
            label="Add a site"
            svg={<PlusCircleIcon height="24" width="24" color="white" />}
          />
        </div>
      </div>
    </div>
  );
};

export default SideBar;
