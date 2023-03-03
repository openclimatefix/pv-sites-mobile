import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  AreaChart,
  Area,
  ReferenceLine,
} from 'recharts';
import { LegendLineGraphIcon } from '@openclimatefix/nowcasting-ui.icons.icons';
import useSWR, { Fetcher } from 'swr';
import { FutureThresholdLegendIcon, ArrowIcon} from './icons/future_threshold';

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

const FutureGraph = () => {
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

    const CustomYAxisTick = (x, y, name) => {
          return (<g transform={`translate(${0},${y})`}>
              <text x={0} y={0}
                  textAnchor="start"
                  fill="#666">{payload.value}</text>
          </g>);
    };

  return (
    <div className="relative my-2 w-full h-[260px] bg-ocf-gray-1000 rounded-2xl content-center">
      <div className="flex flex-col w-11/12 justify-start">
        <div className="flex justify-end mt-[20px] text-sm">
          <FutureThresholdLegendIcon />
        </div>
        <ResponsiveContainer className="mt-[15px] " width="100%" height={100}>
          <AreaChart
            data={data?.forecast_values}
            margin={{
              top: 0,
              right: 0,
              left: 40,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="3%" stopColor="#444444" stopOpacity={0} />
                <stop offset="60%" stopColor="#FFD053" stopOpacity={0.4} />
                <stop offset="0%" stopColor="#FFD053" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="expected_generation_kw"
              strokeWidth={2}
              stroke="white"
              strokeDasharray="2"
              fill="url(#colorUv)"
            />
            <ReferenceLine
              y={0.2}
              strokeWidth={2}
              stroke="#FFD053"
              strokeDasharray="2"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="w-11/2  flex flex-col justify-center content-center absolute bottom-10 inset-x-0 text-center">
        <div className="flex flex-row justify-between">
          <p className="text-white text-xs font-medium">19:00</p>
          <p className="text-white text-xs font-medium">1:00</p>
        </div>

        <p className="text-white text-base font-semibold">19:06</p>
        <div className="flex flex-row justify-center mt-2">
          <ArrowIcon/>
          <p className="text-white text-sm font-normal ml-2">Solar activity is increasing until 20:20 </p>
        </div>
      </div>
    </div>
  );
};

export default FutureGraph;
