import {
  ResponsiveContainer,
  YAxis,
  AreaChart,
  LabelList,
  Area,
  ReferenceLine,
} from 'recharts';
import useSWR, { Fetcher } from 'swr';
import {
  FutureThresholdLegendIcon,
  UpArrowIcon,
  DownArrowIcon,
  LineCircle,
} from './icons/future_threshold';
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

const formatter = new Intl.DateTimeFormat(['en-US', 'en-GB'], {
  hour: 'numeric',
  minute: 'numeric',
});

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

/* Represents the threshold (2000 kWh) for the graph */
const graphThreshold = 0.7;

const FutureGraph = () => {
  const { data, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sites/pv_forecast/${siteUUID}`,
    fetcher
  );

  /* The index of the current time in the forecast data */
  const getCurrentTimeForecastIndex = () => {
    return 9;
  };

  /**
   * Renders two types of labels for the graph:
   * - A circle for the current time
   * - A threshold label
   * @param props data about the point, such as x and y position on the graph
   * @returns SVG element
   */
  const renderGraphLabels = (props: any) => {
    const { x, y, index } = props;

    if (!isLoading && data && data.forecast_values.length > 0) {
      if (index === getCurrentTimeForecastIndex()) {
        return (
          <g>
            <LineCircle x={x} y={y} />
          </g>
        );
      } else if (index === 0) {
        return (
          <svg
            x={x - 30}
            y={-78.95 * graphThreshold + 76.84}
            width="20"
            height="17"
            viewBox="0 0 20 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              style={{ position: 'relative', marginLeft: '30px' }}
              d="M0.36044 6.09264V5.45627L2.32919 3.4165C2.53942 3.19491 2.71271 3.00078 2.84908 2.83411C2.98733 2.66555 3.09055 2.50551 3.15874 2.354C3.22692 2.20248 3.26101 2.0415 3.26101 1.87105C3.26101 1.67786 3.21555 1.5112 3.12464 1.37105C3.03374 1.229 2.90968 1.1201 2.75249 1.04434C2.59529 0.966689 2.41821 0.927863 2.22124 0.927863C2.0129 0.927863 1.83108 0.970477 1.67578 1.0557C1.52048 1.14093 1.40116 1.2612 1.31783 1.4165C1.23449 1.5718 1.19283 1.75362 1.19283 1.96195H0.354759C0.354759 1.60779 0.436198 1.29813 0.599077 1.03298C0.761955 0.767825 0.98544 0.562333 1.26953 0.4165C1.55362 0.268772 1.87654 0.194909 2.23828 0.194909C2.60381 0.194909 2.92578 0.267825 3.20419 0.413659C3.48449 0.557598 3.70324 0.754568 3.86044 1.00457C4.01764 1.25267 4.09624 1.53298 4.09624 1.84548C4.09624 2.06139 4.05552 2.27256 3.97408 2.479C3.89453 2.68544 3.75533 2.91555 3.55646 3.16934C3.3576 3.42123 3.08108 3.72711 2.72692 4.08695L1.57067 5.29718V5.3398H4.18999V6.09264H0.36044ZM7.29226 6.18923C6.84339 6.18733 6.45987 6.06896 6.14169 5.83411C5.82351 5.59926 5.58014 5.25741 5.41158 4.80855C5.24302 4.35968 5.15874 3.81896 5.15874 3.18639C5.15874 2.5557 5.24302 2.01688 5.41158 1.56991C5.58203 1.12294 5.82635 0.78203 6.14453 0.547182C6.46461 0.312333 6.84718 0.194909 7.29226 0.194909C7.73733 0.194909 8.11896 0.31328 8.43714 0.550022C8.75533 0.784871 8.9987 1.12578 9.16726 1.57275C9.33771 2.01783 9.42294 2.5557 9.42294 3.18639C9.42294 3.82086 9.33866 4.36252 9.1701 4.81139C9.00154 5.25836 8.75817 5.60021 8.43999 5.83695C8.1218 6.0718 7.73923 6.18923 7.29226 6.18923ZM7.29226 5.4307C7.6862 5.4307 7.99396 5.23847 8.21555 4.854C8.43904 4.46953 8.55078 3.91366 8.55078 3.18639C8.55078 2.70343 8.49964 2.29529 8.39737 1.96195C8.29699 1.62673 8.15211 1.37294 7.96271 1.20059C7.77521 1.02635 7.55173 0.939227 7.29226 0.939227C6.90021 0.939227 6.59245 1.13241 6.36896 1.51877C6.14548 1.90514 6.03279 2.46101 6.03089 3.18639C6.03089 3.67123 6.08108 4.08127 6.18146 4.4165C6.28374 4.74983 6.42862 5.00267 6.61612 5.17502C6.80362 5.34548 7.029 5.4307 7.29226 5.4307ZM12.4563 6.18923C12.0075 6.18733 11.6239 6.06896 11.3058 5.83411C10.9876 5.59926 10.7442 5.25741 10.5756 4.80855C10.4071 4.35968 10.3228 3.81896 10.3228 3.18639C10.3228 2.5557 10.4071 2.01688 10.5756 1.56991C10.7461 1.12294 10.9904 0.78203 11.3086 0.547182C11.6287 0.312333 12.0112 0.194909 12.4563 0.194909C12.9014 0.194909 13.283 0.31328 13.6012 0.550022C13.9194 0.784871 14.1628 1.12578 14.3313 1.57275C14.5018 2.01783 14.587 2.5557 14.587 3.18639C14.587 3.82086 14.5027 4.36252 14.3342 4.81139C14.1656 5.25836 13.9222 5.60021 13.604 5.83695C13.2859 6.0718 12.9033 6.18923 12.4563 6.18923ZM12.4563 5.4307C12.8503 5.4307 13.158 5.23847 13.3796 4.854C13.6031 4.46953 13.7148 3.91366 13.7148 3.18639C13.7148 2.70343 13.6637 2.29529 13.5614 1.96195C13.4611 1.62673 13.3162 1.37294 13.1268 1.20059C12.9393 1.02635 12.7158 0.939227 12.4563 0.939227C12.0643 0.939227 11.7565 1.13241 11.533 1.51877C11.3095 1.90514 11.1969 2.46101 11.195 3.18639C11.195 3.67123 11.2451 4.08127 11.3455 4.4165C11.4478 4.74983 11.5927 5.00267 11.7802 5.17502C11.9677 5.34548 12.1931 5.4307 12.4563 5.4307ZM17.6204 6.18923C17.1715 6.18733 16.788 6.06896 16.4698 5.83411C16.1516 5.59926 15.9083 5.25741 15.7397 4.80855C15.5711 4.35968 15.4869 3.81896 15.4869 3.18639C15.4869 2.5557 15.5711 2.01688 15.7397 1.56991C15.9102 1.12294 16.1545 0.78203 16.4727 0.547182C16.7927 0.312333 17.1753 0.194909 17.6204 0.194909C18.0655 0.194909 18.4471 0.31328 18.7653 0.550022C19.0835 0.784871 19.3268 1.12578 19.4954 1.57275C19.6658 2.01783 19.7511 2.5557 19.7511 3.18639C19.7511 3.82086 19.6668 4.36252 19.4982 4.81139C19.3297 5.25836 19.0863 5.60021 18.7681 5.83695C18.4499 6.0718 18.0674 6.18923 17.6204 6.18923ZM17.6204 5.4307C18.0143 5.4307 18.3221 5.23847 18.5437 4.854C18.7672 4.46953 18.8789 3.91366 18.8789 3.18639C18.8789 2.70343 18.8278 2.29529 18.7255 1.96195C18.6251 1.62673 18.4802 1.37294 18.2908 1.20059C18.1033 1.02635 17.8799 0.939227 17.6204 0.939227C17.2283 0.939227 16.9206 1.13241 16.6971 1.51877C16.4736 1.90514 16.3609 2.46101 16.359 3.18639C16.359 3.67123 16.4092 4.08127 16.5096 4.4165C16.6119 4.74983 16.7567 5.00267 16.9442 5.17502C17.1317 5.34548 17.3571 5.4307 17.6204 5.4307ZM2.8093 14.6125L2.80362 13.5756H2.95135L4.68999 11.729H5.70703L3.72408 13.8313H3.59055L2.8093 14.6125ZM2.02805 16.0926V10.2745H2.87749V16.0926H2.02805ZM4.78374 16.0926L3.22124 14.0188L3.80646 13.425L5.82635 16.0926H4.78374ZM7.68857 16.0926L6.07493 10.2745H6.99822L8.13175 14.7801H8.18572L9.3647 10.2745H10.2795L11.4585 14.783H11.5124L12.6431 10.2745H13.5692L11.9528 16.0926H11.0692L9.84482 11.7347H9.79936L8.57493 16.0926H7.68857ZM15.1509 13.5017V16.0926H14.3015V10.2745H15.1396V12.4392H15.1935C15.2958 12.2044 15.4521 12.0178 15.6623 11.8796C15.8725 11.7413 16.1471 11.6722 16.4862 11.6722C16.7854 11.6722 17.0468 11.7337 17.2702 11.8568C17.4956 11.9799 17.6699 12.1637 17.793 12.408C17.918 12.6504 17.9805 12.9534 17.9805 13.3171V16.0926H17.131V13.4193C17.131 13.0993 17.0487 12.8512 16.8839 12.675C16.7191 12.497 16.4899 12.408 16.1964 12.408C15.9956 12.408 15.8157 12.4506 15.6566 12.5358C15.4994 12.621 15.3754 12.746 15.2844 12.9108C15.1954 13.0737 15.1509 13.2707 15.1509 13.5017Z"
              fill="#FFD053"
            />
          </svg>
        );
      }
    }

    return null;
  };

  /**
   * Generates the gradient for the graph based on the threshold
   * @returns SVG gradient
   */
  const generateGraphGradient = () => {
    if (!isLoading && data) {
      const aboveThreshold = data.forecast_values.some(
        (forecast) => forecast.expected_generation_kw > graphThreshold
      );

      if (aboveThreshold) {
        let gradientPercentage = -107.5 * graphThreshold + 99.25;

        if (gradientPercentage < 0) {
          gradientPercentage = 0;
        }

        return (
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="1%" stopColor="#444444" stopOpacity={0} />
            <stop
              offset={`${gradientPercentage}%`}
              stopColor="#FFD053"
              stopOpacity={0.4}
            />
            <stop offset="0%" stopColor="#FFD053" stopOpacity={0} />
          </linearGradient>
        );
      }
      return null;
    }
    return null;
  };

  /**
   * Returns the start and end time label on the graph's x-axis
   * @returns
   */
  const renderStartAndEndTime = () => {
    if (!isLoading && data) {
      const numForecastValues = data.forecast_values.length;

      if (numForecastValues > 0) {
        const startTime = formatter.format(
          new Date(data.forecast_values[0].target_datetime_utc)
        );
        const endTime = formatter.format(
          new Date(
            data.forecast_values[numForecastValues - 1].target_datetime_utc
          )
        );

        return (
          <div className="flex flex-row justify-between">
            <p className="text-white text-xs font-medium ml-6">{startTime}</p>
            <p className="text-white text-xs font-medium mr-6">{endTime}</p>
          </div>
        );
      }
    }

    return null;
  };

  const solarIncreasingText = (formattedDate: string) => {
    return (
      <div className="flex flex-row justify-center mt-2">
        <UpArrowIcon />
        <p className="text-white text-sm font-normal ml-2">
          Solar activity is increasing until {formattedDate}
        </p>
      </div>
    );
  };

  const solarDecreasingText = (formattedDate: string) => {
    return (
      <div className="flex flex-row justify-center mt-2">
        <DownArrowIcon />
        <p className="text-white text-sm font-normal ml-2">
          Solar activity is decreasing until {formattedDate}
        </p>
      </div>
    );
  };

  /**
   * Calculates the next peak/trough starting from the current time
   * and returns text indicating increasing/decreasing solar activity
   */
  const getSolarActivityText = () => {
    if (data) {
      let currIndex = getCurrentTimeForecastIndex() + 1;

      while (currIndex < data.forecast_values.length) {
        const currentExpectedGenerationKW =
          data.forecast_values[currIndex].expected_generation_kw;
        const previousExpectedGenerationKW =
          data.forecast_values[currIndex - 1].expected_generation_kw;
        const formattedDate = formatter.format(
          new Date(data.forecast_values[currIndex].target_datetime_utc)
        );

        if (currIndex === data.forecast_values.length - 1) {
          if (currentExpectedGenerationKW > previousExpectedGenerationKW) {
            return solarIncreasingText(formattedDate);
          } else if (
            currentExpectedGenerationKW < previousExpectedGenerationKW
          ) {
            return solarDecreasingText(formattedDate);
          }
        } else {
          const nextExpectedGenerationKW =
            data.forecast_values[currIndex + 1].expected_generation_kw;

          if (
            currentExpectedGenerationKW > previousExpectedGenerationKW &&
            currentExpectedGenerationKW > nextExpectedGenerationKW
          ) {
            return solarIncreasingText(formattedDate);
          } else if (
            currentExpectedGenerationKW < previousExpectedGenerationKW &&
            currentExpectedGenerationKW < nextExpectedGenerationKW
          ) {
            return solarDecreasingText(formattedDate);
          }
        }
        currIndex += 1;
      }
    }

    return '';
  };

  return (
    <div className="relative my-2 w-full h-[260px] bg-ocf-gray-1000 rounded-2xl content-center">
      <div className="flex flex-col w-full justify-start">
        <div className="flex justify-end mt-[20px] mr-10 text-sm">
          <FutureThresholdLegendIcon />
        </div>
        <ResponsiveContainer className="mt-[15px] " width="100%" height={100}>
          <AreaChart
            data={data?.forecast_values}
            margin={{
              top: 0,
              right: 40,
              left: 0,
              bottom: 10,
            }}
          >
            <defs>{generateGraphGradient()}</defs>
            <YAxis
              type="number"
              domain={[0, 1.1]}
              axisLine={false}
              tick={false}
            />
            <Area
              type="monotone"
              dataKey="expected_generation_kw"
              strokeWidth={2}
              stroke="white"
              strokeDasharray="2"
              fill="url(#colorUv)"
            >
              <LabelList
                dataKey="expected_generation_kw"
                content={renderGraphLabels}
              />
            </Area>
            <ReferenceLine
              y={graphThreshold}
              strokeWidth={2}
              stroke="#FFD053"
              strokeDasharray="2"
            ></ReferenceLine>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col justify-center content-center absolute bottom-8 inset-x-0 text-center">
        {renderStartAndEndTime()}

        <p className="text-white text-base font-semibold">
          {formatter.format(Date.now())}
        </p>
        {getSolarActivityText()}
      </div>
    </div>
  );
};

export default FutureGraph;
