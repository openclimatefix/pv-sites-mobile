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
          p-3
          text-center
          justify-center
          items-center
          bg-ocf-black-500
          rounded-2xl
          h-[100%]
          md:flex-col
          md:justify-center
          md:gap-5"
    >
      <div className="relative h-[70%] aspect-square md:h-[unset] md:w-full md:max-w-[90px]">
        <Image src={src} alt={alt} layout="fill" />
      </div>
      <div className="text-ocf-gray ml-3 self-center font-normal text-left md:flex-initial md:max-w-[75%] md:ml-0">
        <p className="m-0 text-[10px] mb-1 font-medium md:text-lg md:text-center">
          {description}
        </p>
      </div>
    </div>
  );
};

export default RecommendationDisplay;
