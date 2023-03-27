import Link from 'next/link';
import React, { FC } from 'react';
import { useSiteData } from '~/lib/hooks';
import { getCurrentTimeForecast } from '~/lib/utils';
import { DeleteIcon, EditIcon } from './icons';

interface SiteCardProps {
  href?: string;
  onClick?: () => void;
  siteUUID: string;
}

const SiteCard = React.forwardRef<HTMLAnchorElement, SiteCardProps>(
  ({ href, siteUUID, onClick }, ref) => {
    const { forecastData, client_site_name, installed_capacity_kw, isLoading } =
      useSiteData(siteUUID);

    const currentOutput = forecastData
      ? getCurrentTimeForecast(forecastData.forecast_values)
      : undefined;

    return (
      <a
        onClick={onClick}
        ref={ref}
        href={href}
        className="h-fit w-full max-w-lg flex bg-ocf-black-500 p-3 rounded-lg font-bold"
      >
        <div className="flex flex-col flex-1">
          <h2 className="text-amber text-xl font-semibold">
            {isLoading ? 'Loading...' : client_site_name ?? 'My Site'}
          </h2>
          <div className="flex flex-col mt-2 gap-1">
            <p className="text-ocf-gray-500 text-xs font-medium">
              {`Current output: ${
                currentOutput != undefined
                  ? currentOutput + ' kW'
                  : 'loading...'
              }`}
            </p>
            {installed_capacity_kw && (
              <p className="text-ocf-gray-500 font-medium text-xs">
                Max. capacity: {installed_capacity_kw} kW
              </p>
            )}
            <p className="text-ocf-gray-500 font-medium text-xs">
              {`Current yield:
            ${
              installed_capacity_kw && currentOutput != undefined
                ? currentOutput / installed_capacity_kw + '%'
                : 'loading...'
            }`}
            </p>
          </div>
        </div>
        {!href && (
          <div className="flex flex-col w-fit">
            <div className="flex-1">
              <button>
                <EditIcon />
              </button>
            </div>
            <button>
              <DeleteIcon />
            </button>
          </div>
        )}
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
  return isEditMode ? (
    <SiteCard siteUUID={siteUUID} />
  ) : (
    <Link href={'/dashboard/' + siteUUID} passHref>
      <SiteCard siteUUID={siteUUID} />
    </Link>
  );
};

export default SiteCardLink;
