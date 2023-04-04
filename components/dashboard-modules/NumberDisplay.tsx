import { FC } from 'react';

interface Props {
  title: string;
  value: string;
}

const NumberDisplay: FC<Props> = ({ title, value }) => {
  return (
    <div className="flex-1 p-4 text-center md:text-left bg-ocf-black-500 rounded-2xl h-[100%]">
      {value !== 'Loading...' ? (
        <div>
          <div className="mb-2 text-xs md:text-lg text-ocf-gray font-semibold">
            {title}
          </div>
          <div className="mb-1 text-2xl text-ocf-yellow font-semibold">
            {value}
          </div>
        </div>
      ) : (
        <div>
          <div className="bg-ocf-gray-1000 mt-[0.5px] mb-2.5 h-6 w-44 rounded-2xl animate-pulse"></div>
          <div className="bg-ocf-gray-1000 mb-[5.5px] h-8 w-32 rounded-2xl animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

export default NumberDisplay;
