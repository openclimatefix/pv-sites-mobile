import NumberDisplay from './NumberDisplay';
import { formatter, useFutureGraphData } from 'lib/utils';

interface ForecastDataPoint {
  target_datetime_utc: number;
  expected_generation_kw: number;
}

const computeMipointRiemmanSum = (points: ForecastDataPoint[] | undefined) => {
  if (!points) {
    return 'Error';
  }

  var approxArea = 0.0;
  console.log(points);

  for (let i = 0; i < points.length - 1; i++) {
    const avgHeight =
      (points[i].expected_generation_kw +
        points[i + 1].expected_generation_kw) /
      2;
    const timeDiffMili =
      new Date(points[i + 1].target_datetime_utc).getTime() -
      new Date(points[i].target_datetime_utc).getTime();

    const timeDiffHours = timeDiffMili / (3.6 * Math.pow(10, 6));
    approxArea += avgHeight * timeDiffHours;
  }

  return approxArea.toFixed(2).toString() + ' kWh';
};

const ExpectedOutput = () => {
  const { data } = useFutureGraphData();
  return (
    <NumberDisplay
      title="Today's Expected Output"
      value={data ? computeMipointRiemmanSum(data.forecast_values) : 'Loading'}
    />
  );
};

export default ExpectedOutput;
