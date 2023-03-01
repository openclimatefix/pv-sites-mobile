import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { LegendLineGraphIcon } from '@openclimatefix/nowcasting-ui.icons.icons';
import useSWR, { Fetcher } from 'swr';

interface ForecastDataPointProps {
  target_datetime_utc: number;
  expected_generation_kw: number;
}

interface ForecastDataProps {
  forecast_uuid: string;
  site_uuid: string;
  forecast_creation_datetime: number;
  forecast_version: string;
  forecast_values: ForecastDataPointProps[];
}

interface UnparsedForecastDataPointProps {
  target_datetime_utc: string | number;
  expected_generation_kw: number;
}

interface UnparsedForecastDataProps {
  forecast_uuid: string;
  site_uuid: string;
  forecast_creation_datetime: string | number;
  forecast_version: string;
  forecast_values: UnparsedForecastDataPointProps[];
}

const fetcher: Fetcher<ForecastDataProps> = async (url: string) => {
  const tempData: UnparsedForecastDataProps = await fetch(url).then((res) =>
    res.json()
  );

  if (typeof tempData.forecast_creation_datetime === 'string') {
    tempData.forecast_creation_datetime = Date.parse(
      tempData.forecast_creation_datetime
    );
  } else {
    throw new Error('Data contains values with incompatible types');
  }

  tempData.forecast_values.map(({ target_datetime_utc }) => {
    if (typeof target_datetime_utc === 'string') {
      target_datetime_utc = Date.parse(target_datetime_utc);
    } else {
      throw new Error('Data contains values with incompatible types');
    }
  });
  return tempData as ForecastDataProps;
};

const siteUUID = 'b97f68cd-50e0-49bb-a850-108d4a9f7b7e';

const formatter = new Intl.DateTimeFormat(['en-US', 'en-GB'], {
  hour: 'numeric',
  minute: 'numeric',
});

const Graph = () => {
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sites/pv_forecast/${siteUUID}`,
    fetcher
  );

  const MAX = data
    ? Math.max(
        ...data.forecast_values.map(
          (obj: ForecastDataPointProps) => obj.expected_generation_kw
        )
      )
    : 0;

  const tickArray = [0, MAX / 4, MAX / 2, (3 * MAX) / 4, MAX];

  return (
    <div className=" w-full h-[300px] bg-[#444444] rounded-lg">
      <div className="flex ml-[5%] mt-[20px] mb-[20px] text-sm">
        <LegendLineGraphIcon className="text-[#FFD053]" />
        <p className="text-white ml-[5px] mt-[2px]">OCF Final Forecast</p>
      </div>

      <ResponsiveContainer className="mt-[50px]" width="100%" height={200}>
        <LineChart
          data={data?.forecast_values}
          margin={{
            top: 0,
            right: 10,
            left: -25,
            bottom: 50,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" color="white" />
          <XAxis
            scale="band"
            fontSize="10px"
            dataKey="target_datetime_utc"
            stroke="white"
            axisLine={false}
            tickFormatter={(point: string) =>
              formatter.format(Date.parse(point))
            }
          />
          <YAxis
            tickCount={5}
            ticks={tickArray}
            domain={[0, MAX * 1.25]}
            interval={0}
            fontSize="10px"
            axisLine={false}
            stroke="white"
            tickFormatter={(val: number) => val.toFixed(2)}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#444444', opacity: '.7' }}
            labelStyle={{ color: 'white' }}
            formatter={(value: number, name, props) => [
              parseInt(value.toFixed(4)),
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
  );
};

export default Graph;
