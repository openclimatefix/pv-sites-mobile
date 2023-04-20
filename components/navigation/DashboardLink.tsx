import React from 'react';

import Link from 'next/link';

import { LinkProps } from 'next/link';

import { useSiteAggregation } from '../../lib/hooks';
import { getCurrentTimeGeneration } from '~/lib/utils';
import { useMemo } from 'react';

import SiteGraph from '../graphs/SiteGraph';

type DashboardLinkProps = {
  siteName: string;
  linkProps: LinkProps;
  currentPath: string;
  allSiteUUID: string[];
};

const DashboardLink: React.FC<DashboardLinkProps> = ({
  linkProps,
  siteName,
  currentPath,
  allSiteUUID,
}) => {
  const isActive = linkProps.href === currentPath;
  const textColor = isActive ? 'text-white' : 'text-ocf-gray-800';
  const borderColor = isActive ? 'border-amber' : 'border-ocf-gray-1000';

  const { totalExpectedGeneration } = useSiteAggregation(allSiteUUID);

  const currentOutput = useMemo(() => {
    return totalExpectedGeneration
      ? Math.round(getCurrentTimeGeneration(totalExpectedGeneration) * 100) /
          100
      : undefined;
  }, [totalExpectedGeneration]);

  const generateThresholdGraph = () => {
    if (allSiteUUID.length === 0) {
      return null;
    }

    return <SiteGraph siteUUID={allSiteUUID[0]} hidden={false} height={50} />;
  };

  return (
    <Link {...linkProps} passHref>
      <a
        className={`${borderColor} border flex-1 p-5 flex flex-row justify-center text-center md:text-left bg-ocf-black-500 rounded-2xl w-72 h-48`}
      >
        <div className="flex flex-col w-8/12 justify-center">
          <div
            className={`mb-2 text-lg ${textColor} font-semibold transition-all md:font-medium md:leading-none`}
          >
            {siteName}
          </div>
          {currentOutput !== undefined && (
            <div
              className={`text-md ${textColor} font-medium leading-none transition-all md:leading-none`}
            >
              Current output: {currentOutput} kW
            </div>
          )}
        </div>
        <div className="pl-4 w-1/2">{generateThresholdGraph()}</div>
      </a>
    </Link>
  );
};

export default DashboardLink;
