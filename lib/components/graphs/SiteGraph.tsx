import { FC, useMemo, useState } from 'react';
import { generationDataOverDateRange } from '~/lib/generation';
import { makeGraphable } from '~/lib/graphs';
import { useSiteAggregation } from '~/lib/sites';
import { useSiteTime } from '~/lib/time';
import { Site } from '~/lib/types';

import { Area, AreaChart, ResponsiveContainer } from 'recharts';

interface SiteGraphProps {
  sites: Site[];
  hidden?: boolean;
  height?: number;
  color?: string;
}

const SiteGraph: FC<SiteGraphProps> = ({
  sites,
  hidden = false,
  height = 100,
  color = '#FFD053',
}) => {
  const representativeSite = sites[0];
  const { aggregateForecastedGeneration } = useSiteAggregation(sites);
  const [timeEnabled, setTimeEnabled] = useState(
    aggregateForecastedGeneration !== undefined
  );

  const { isAfterDayTime, sunrise, sunset, tomorrowTimes } = useSiteTime(
    representativeSite,
    {
      updateEnabled: timeEnabled,
    }
  );

  const graphData = useMemo(() => {
    if (aggregateForecastedGeneration) {
      return generationDataOverDateRange(
        aggregateForecastedGeneration,
        isAfterDayTime ? tomorrowTimes.sunrise : sunrise,
        isAfterDayTime ? tomorrowTimes.sunset : sunset
      );
    }
    return null;
  }, [
    aggregateForecastedGeneration,
    isAfterDayTime,
    tomorrowTimes,
    sunrise,
    sunset,
  ]);

  if (!graphData) return null;

  const gradientID = `siteGraphArea-${color}`;

  return (
    <ResponsiveContainer
      width="100%"
      height={height}
      className={`${hidden ? 'opacity-0' : 'opacity-1'} transition-opacity`}
    >
      <AreaChart data={makeGraphable(graphData)}>
        <defs>
          <linearGradient id={gradientID} x1="0" y1="0" x2="0" y2="1">
            <stop offset={'0%'} stopColor={color} stopOpacity={0.4} />
            <stop offset={'100%'} stopColor={color} stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="generation_kw"
          strokeWidth={1}
          stroke={color}
          fillOpacity={1}
          fill={`url(#${gradientID})`}
          onAnimationEnd={() => setTimeEnabled(true)}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SiteGraph;
