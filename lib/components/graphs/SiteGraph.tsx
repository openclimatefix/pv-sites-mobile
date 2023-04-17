import { FC, useMemo, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts';
import { generationDataOverDateRange } from '~/lib/generation';
import { makeGraphable } from '~/lib/graphs';
import { useSiteData } from '~/lib/sites';
import { useSiteTime } from '~/lib/time';
import { Site } from '~/lib/types';

interface SiteGraphProps {
  site: Site;
  hidden?: boolean;
}

const SiteGraph: FC<SiteGraphProps> = ({ site, hidden = false }) => {
  const { forecastData, isLoading } = useSiteData(site.site_uuid);
  const [timeEnabled, setTimeEnabled] = useState(forecastData !== undefined);

  const { dusk, dawn } = useSiteTime(site, {
    updateEnabled: timeEnabled,
  });

  const graphData = useMemo(() => {
    if (forecastData) {
      return generationDataOverDateRange(
        forecastData.forecast_values,
        dawn,
        dusk
      );
    }
    return null;
  }, [forecastData, dawn, dusk]);

  if (!isLoading && graphData) {
    return (
      <ResponsiveContainer
        width="100%"
        height={100}
        className={`${hidden ? 'opacity-0' : 'opacity-1'} transition-opacity`}
      >
        <AreaChart data={makeGraphable(graphData)}>
          <defs>
            <linearGradient id="siteGraphArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset={'0%'} stopColor="#FFD053" stopOpacity={0.4} />
              <stop offset={'100%'} stopColor="#FFD053" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <YAxis
            type="number"
            domain={[0, site.installed_capacity_kw]}
            axisLine={false}
            tick={false}
          />
          <Area
            type="monotone"
            dataKey="generation_kw"
            strokeWidth={1}
            stroke="#FFD053"
            fillOpacity={1}
            fill="url(#siteGraphArea)"
            onAnimationEnd={() => setTimeEnabled(true)}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }
  return null;
};

export default SiteGraph;
