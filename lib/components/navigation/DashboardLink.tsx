import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { getCurrentTimeGeneration } from '~/lib/generation';
import { useSiteAggregation } from '~/lib/sites';
import { Site } from '~/lib/types';
import SiteGraph from '../graphs/SiteGraph';

type DashboardLinkProps = {
  siteName: string;
  href: string;
  sites: Site[];
};

const DashboardLink: React.FC<DashboardLinkProps> = ({
  href,
  siteName,
  sites,
}) => {
  const { asPath: path } = useRouter();
  const isActive = href === path;
  const textColor = isActive ? 'text-white' : 'text-ocf-gray-800';
  const borderColor = isActive ? 'border-amber' : 'border-ocf-gray-1000';

  const { totalForecastedGeneration } = useSiteAggregation(sites);

  const currentOutput = useMemo(() => {
    return totalForecastedGeneration?.length
      ? Math.round(getCurrentTimeGeneration(totalForecastedGeneration) * 100) /
          100
      : undefined;
  }, [totalForecastedGeneration]);

  return (
    <Link href={href} passHref>
      <a
        className={`${borderColor} flex h-48 w-72 flex-1 flex-row justify-center rounded-2xl border bg-ocf-black-500 p-5 text-center md:text-left`}
      >
        <div className="flex w-8/12 flex-col justify-center">
          <div
            className={`mb-2 text-sm ${textColor} font-semibold transition-all md:font-medium md:leading-none`}
          >
            {siteName}
          </div>
          {currentOutput !== undefined && (
            <div
              className={`text-xs ${textColor} font-medium leading-none transition-all md:leading-none`}
            >
              Current output: {currentOutput} kW
            </div>
          )}
        </div>
        <div className="pointer-events-none w-1/2 pl-4">
          <SiteGraph
            sites={sites}
            hidden={false}
            height={50}
            color={
              isActive ? '#FFD053' /* ocf-yellow */ : '#909090' /*ocf-gray-800*/
            }
          />
        </div>
      </a>
    </Link>
  );
};

export default DashboardLink;
