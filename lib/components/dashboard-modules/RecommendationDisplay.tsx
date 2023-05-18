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
          flex
          h-[100%]
          flex-1
          rounded-lg
          bg-ocf-black-500
          p-3"
    >
      <div
        className="fade-in
          flex
          items-center
          justify-center
          text-center
          md:flex-col
          md:justify-center
          md:gap-5"
      >
        <div className="relative aspect-square h-[70%] md:h-[unset] md:w-full md:max-w-[90px]">
          <Image src={src} alt={alt} fill priority />
        </div>
        <div className="ml-3 self-center text-left font-normal text-ocf-gray md:ml-0 md:max-w-[75%] md:flex-initial">
          <p className="m-0 mb-1 text-[10px] font-medium md:text-center md:text-lg">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecommendationDisplay;
