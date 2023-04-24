import { FC } from 'react';
import Image from 'next/image';

type PowerInfo = {
  src: string;
  appliance: string;
  kW: string;
};

const PowerInfoCard: FC<PowerInfo> = ({ src, appliance, kW }) => {
  return (
    <div className="flex w-full justify-center gap-4 pb-8 pt-3 align-middle">
      <div className="aspect-square h-full">
        <Image src={src} alt="" width={65} height={65} />
      </div>
      <div className="ml-3 self-center text-left font-semibold text-ocf-gray">
        <p className="m-0 mb-1 text-base font-semibold">{appliance}</p>
        <p className="text-sm ">{kW} kW</p>
      </div>
    </div>
  );
};

export default PowerInfoCard;
