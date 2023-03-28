import { FC } from 'react';
import Image from 'next/image';

interface Props {
  src: string;
  alt: string;
  description: string;
}

const RecommendationDisplay: FC<Props> = ({ src, alt, description }) => {
  return (
    <div
      className="
          flex-1
          flex
          my-2
          p-4
          text-center
          justify-center
          align-center
          bg-ocf-gray-1000
          rounded-2xl
          h-[100%]"
    >
      <Image src={src} alt={alt} width={34.5} height={28.75} />
      <div className="text-ocf-gray ml-3 self-center font-normal text-left flex-1 max-w-max">
        <p className="m-0 text-[10px] mb-1">{description}</p>
      </div>
    </div>
  );
};

export default RecommendationDisplay;
