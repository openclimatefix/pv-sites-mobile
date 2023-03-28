import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import content from '../content/power-card-content.json';
import { Carousel } from 'react-responsive-carousel';
import PowerInfoCard from '~/components/PowerInfoCard';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Image from 'next/image';
import { withSites } from '~/lib/utils';

const MoreInfo = () => {
  return (
    <div className="bg-ocf-black w-screen min-h-screen max-w-screen-lg px-4">
      <h1 className="my-2 mt-4 text-ocf-gray text-3xl font-bold">More Info</h1>
      <div className="bg-ocf-black-500 rounded-lg">
        <Carousel
          showStatus={false}
          showThumbs={false}
          renderArrowPrev={(clickHandler) => {
            return (
              <div
                className={`absolute top-0 bottom-0 left-0 flex items-center p-3 cursor-pointer z-20`}
                onClick={clickHandler}
              >
                <Image
                  src="/left-arrow.svg"
                  alt="left-arrow"
                  height={16}
                  width={10}
                />
              </div>
            );
          }}
          renderArrowNext={(clickHandler) => {
            return (
              <div
                className="absolute top-0 bottom-0 right-0 flex items-center p-3 cursor-pointer z-20"
                onClick={clickHandler}
              >
                <Image
                  src="/right-arrow.svg"
                  alt="left-arrow"
                  height={16}
                  width={10}
                />
              </div>
            );
          }}
          renderIndicator={(clickHandler, isSelected, index, label) => {
            return (
              <li
                className={`rounded-full w-[8px] h-[8px] cursor-pointer mx-2 inline-block ${
                  isSelected ? 'bg-ocf-yellow' : 'bg-ocf-gray-200'
                }`}
                onClick={clickHandler}
                onKeyDown={clickHandler}
                value={index}
                key={index}
                role="button"
                tabIndex={0}
                aria-label={`${label} ${index + 1}`}
              />
            );
          }}
        >
          {content.appliances.map((element) => (
            <PowerInfoCard
              key={element.name}
              src={element.icon}
              appliance={element.name}
              kW={element.kW}
            />
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default MoreInfo;

export const getServerSideProps = withSites();
