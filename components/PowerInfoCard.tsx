import { FC } from 'react';
import Image from 'next/image';

type PowerInfo = {
  src: string;
  appliance: string;
  kW: string;
};

const PowerInfoCard: FC<PowerInfo> = ({ src, appliance, kW }) => {
  return (
    <div className="w-full pt-3 pb-8 flex justify-center align-middle gap-4">
      <Image src={src} alt="" width={65} height={65} className="flex-1" />
      <div className="text-ocf-gray ml-3 self-center font-semibold text-left">
        <p className="m-0 text-base mb-1 font-semibold">{appliance}</p>
        <p className="text-sm ">{kW} kW</p>
      </div>
    </div>
  );
};

export default PowerInfoCard;
