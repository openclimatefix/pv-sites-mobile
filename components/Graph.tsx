import React from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { LegendLineGraphIcon } from '@openclimatefix/nowcasting-ui.icons.icons';
import useSWR, { Fetcher } from 'swr';

interface forecastDataPointProps {
  target_datetime_utc: number;
  expected_generation_kw: number;
}

interface forecastDataProps {
  forecast_uuid: string;
  site_uuid: string;
  forecast_creation_datetime: number;
  forecast_version: string;
  forecast_values: forecastDataPointProps[];
}

interface unparsedForecastDataPointProps {
  target_datetime_utc: string | number;
  expected_generation_kw: number;
}

interface unparsedForecastDataProps {
  forecast_uuid: string;
  site_uuid: string;
  forecast_creation_datetime: string | number;
  forecast_version: string;
  forecast_values: unparsedForecastDataPointProps[];
}

const fetcher: Fetcher<forecastDataProps> = async (url: string) => {
  const tempData: unparsedForecastDataProps = await fetch(url).then((res) =>
    res.json()
  );
  tempData.forecast_creation_datetime = Date.parse(
    tempData.forecast_creation_datetime as string
  );
  tempData.forecast_values.map(({ target_datetime_utc }) => {
    target_datetime_utc = Date.parse(target_datetime_utc as string);
  });
  return tempData as forecastDataProps;
};

const Graph = () => {
  const { data, error, isLoading } = useSWR(
    'http://localhost:3000/api/sites/pv_forecast/b97f68cd-50e0-49bb-a850-108d4a9f7b7e',
    fetcher
  );

  const formatter = new Intl.DateTimeFormat(['en-US', 'en-GB'], {
    hour: 'numeric',
    minute: 'numeric',
  });

  const truncateDecimals = (number: number, digits: number) => {
    var multiplier = Math.pow(10, digits),
      adjustedNum = number * multiplier,
      truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

    return truncatedNum / multiplier;
  };

  return (
    <>
      <div className="w-full h-[400px] bg-[#444444] rounded-lg">
        <div className="flex ml-[100px] mt-[20px]">
          <LegendLineGraphIcon className="text-[#FFD053] mb-[20px]"></LegendLineGraphIcon>
          <p className="text-white ml-[15px]">OCF Final Forecast</p>
        </div>

        <ResponsiveContainer width="100%" height="85%">
          <LineChart
            width={500}
            height={300}
            data={data?.forecast_values}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="target_datetime_utc"
              tickFormatter={(point: string) =>
                formatter.format(Date.parse(point))
              }
            />
            <YAxis />
            <Tooltip
              formatter={(value: number, name, props) => [
                truncateDecimals(value, 5),
                'KW',
              ]}
              labelFormatter={(point: string) =>
                formatter.format(Date.parse(point))
              }
            />
            <Line
              type="monotone"
              dataKey="expected_generation_kw"
              stroke="#FFD053"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default Graph;
