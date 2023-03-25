import { FC, PropsWithChildren } from 'react';
import { DeleteIcon, EditIcon } from './icons';
import Link from 'next/link';
import { useSiteData } from '~/lib/hooks';
import { getCurrentTimeForecast } from '~/lib/utils';

import SiteGraph from './graphs/SiteGraph';

interface SiteCardProps {
  href?: string;
  siteUUID: string;
}

const SiteCard: FC<SiteCardProps> = ({ href, siteUUID }) => {
  const { forecastData, client_site_name, installed_capacity_kw } =
    useSiteData(siteUUID);

  const currentOutput = forecastData
    ? getCurrentTimeForecast(forecastData.forecast_values)
    : undefined;

  return (
    <a
      href={href}
      className="h-fit w-full max-w-lg flex bg-ocf-black-500 p-3 rounded-lg font-bold"
    >
      <div className="flex flex-col flex-1">
        <h2 className="text-amber text-xl font-semibold">{client_site_name}</h2>
        <div className="flex flex-col mt-2 gap-1">
          <p className="text-ocf-gray-500 text-xs font-medium">
            {`Current output: ${
              currentOutput != undefined ? currentOutput + ' kW' : 'loading...'
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
};

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
