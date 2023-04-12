import { FC } from 'react';
import Image from 'next/image';

type Props = {
  icon: string;
  name: string;
  kW: number;
  duration: number;
};

function formatDuration(duration: number) {
  let timeUnit = duration === 1 ? 'hour' : 'hours';

  if (duration < 1) {
    duration *= 60;
    timeUnit = duration === 1 ? 'minute' : 'minutes';
  }

  return `${duration.toPrecision(2)} ${timeUnit}`;
}

const PowerInfoCard: FC<Props> = ({ icon, name, kW, duration }) => {
  return (
    <div className="w-full pt-3 pb-10 flex justify-center gap-4 px-10">
      <div className="relative flex-auto flex-grow-0 w-[100px]">
        <Image src={`/appliances/icons/${icon}`} alt={name} fill />
      </div>
      <div className="text-ocf-gray self-center font-semibold text-left min-w-[150px]">
        <p className="m-0 text-base mb-1 font-semibold">{name}</p>
        <p className="text-sm ">
          Requires {kW} kW during
          {duration > 0
            ? ' a single use spanning ' + formatDuration(duration)
            : ' its operation'}
          , consuming {(kW * (duration > 0 ? duration : 12)).toPrecision(2)} kWh{' '}
          {duration < 0 && 'over 12 hours'}
        </p>
      </div>
    </div>
  );
};

export default PowerInfoCard;
