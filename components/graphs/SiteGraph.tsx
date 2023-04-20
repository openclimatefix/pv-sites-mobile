import { FC, useMemo, useState } from 'react';

import { Area, AreaChart, ResponsiveContainer, YAxis, XAxis } from 'recharts';

import { useSiteData } from 'lib/hooks';

import useTime from '~/lib/hooks/useTime';

import { generationDataOverDateRange, makeGraphable } from 'lib/graphs';

interface Props {
  siteUUID: string;
  hidden?: boolean;
  height?: number;
}

const SiteGraph: FC<Props> = ({ siteUUID, hidden = false, height = 100 }) => {
  const {
    forecastData,
    latitude,
    longitude,
    installed_capacity_kw,
    isLoading,
  } = useSiteData(siteUUID);
  const [timeEnabled, setTimeEnabled] = useState(forecastData !== undefined);

  const { duskTime, dawnTime } = useTime(latitude, longitude, {
    updateEnabled: timeEnabled,
  });

  const graphData = useMemo(() => {
    if (forecastData && dawnTime && duskTime) {
      return generationDataOverDateRange(
        forecastData.forecast_values,
        dawnTime,
        duskTime
      );
    }
    return null;
  }, [forecastData, dawnTime, duskTime]);

  if (!isLoading && graphData && installed_capacity_kw) {
    return (
      <ResponsiveContainer
        width="100%"
        height={height}
        className={`${hidden ? 'opacity-0' : 'opacity-1'} transition-opacity`}
      >
        <AreaChart data={makeGraphable(graphData)}>
          <defs>
            <linearGradient id="siteGraphArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset={'0%'} stopColor="#FFD053" stopOpacity={0.4} />
              <stop offset={'100%'} stopColor="#FFD053" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          {/* <YAxis
            type="number"
            domain={[0, installed_capacity_kw]}
            axisLine={false}
            tick={false}
          /> */}
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
