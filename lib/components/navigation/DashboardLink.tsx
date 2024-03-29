import Link from 'next/link';
import { useRouter } from 'next/router';
import { MouseEventHandler, useMemo } from 'react';
import { getCurrentTimeGeneration } from '~/lib/generation';
import { useSitesGeneration } from '~/lib/sites';
import { GenerationDataPoint, Site } from '~/lib/types';
import SiteGraph from '../graphs/SiteGraph';

type DashboardLinkProps = {
  siteName: string;
  href: string;
  sites: Site[];
  active?: boolean;
  generationData: GenerationDataPoint[] | undefined;
  onClick?: MouseEventHandler;
};

const DashboardLink: React.FC<DashboardLinkProps> = ({
  href,
  siteName,
  sites,
  onClick,
  active,
  generationData,
}) => {
  const { asPath: path } = useRouter();
  const isActive = active ?? href === path;
  const textColor = isActive ? 'text-white' : 'text-ocf-gray-800';
  const borderColor = isActive ? 'border-amber' : 'border-ocf-gray-1000';

  const currentOutput = useMemo(() => {
    return generationData?.length
      ? getCurrentTimeGeneration(generationData).toFixed(2)
      : undefined;
  }, [generationData]);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${borderColor} flex h-fit flex-1 flex-row justify-center rounded-lg border bg-ocf-black-500 p-5 text-center md:text-left`}
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
          generationData={generationData}
          hidden={false}
          height={50}
          color={
            isActive ? '#FFD053' /* ocf-yellow */ : '#909090' /*ocf-gray-800*/
          }
          period={3}
        />
      </div>
    </Link>
  );
};

export default DashboardLink;
