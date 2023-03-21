import { FC } from 'react';

import { Area, AreaChart, YAxis, ResponsiveContainer } from 'recharts';

import { useSiteData } from 'lib/hooks';

const SiteGraph: FC<{ siteUUID: string }> = ({ siteUUID }) => {
  const { forecastData, installed_capacity_kw } = useSiteData(siteUUID);

  if (forecastData && installed_capacity_kw) {
    return (
      <ResponsiveContainer width="100%" height={75}>
        <AreaChart data={forecastData?.forecast_values}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset={'0%'} stopColor="#FFD053" stopOpacity={0.4} />
              <stop offset={'100%'} stopColor="#FFD053" stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis
            type="number"
            domain={[0, installed_capacity_kw]}
            axisLine={false}
            tick={false}
          />
          <Area
            type="monotone"
            dataKey="expected_generation_kw"
            strokeWidth={1}
            stroke="#FFD053"
            fill="url(#colorUv)"
          ></Area>
        </AreaChart>
      </ResponsiveContainer>
    );
  }
  return null;
};

export default SiteGraph;
