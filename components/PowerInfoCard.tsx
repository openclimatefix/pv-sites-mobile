import { FC } from 'react';
import Image from 'next/image';

type PowerInfo = {
  src: string;
  applicance: string;
  kW: string;
};

const PowerInfoCard: FC<PowerInfo> = ({ src, applicance, kW }) => {
  return (
    <div className="w-full">
      <div className="bg-ocf-gray-1000 pt-3 pb-8 rounded-lg flex justify-center align-middle gap-4">
        <Image
          src={src}
          alt={applicance}
          width={75}
          height={75}
          className="flex-1"
        />
        <div className="bg-ocf-gray-1000 rounded-2xl ml-3 self-center">
          <p className="text-ocf-gray text-left m-0 text-base mb-1 font-semibold">
            {applicance}
          </p>
          <p className="text-ocf-gray text-left m-0 text-sm font-semibold">
            {kW} kW
          </p>
        </div>
      </div>
    </div>
  );
};

export default PowerInfoCard;
