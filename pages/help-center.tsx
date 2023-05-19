import { Carousel } from 'react-responsive-carousel';
import PowerInfoCard from '~/lib/components/PowerInfoCard';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Image from 'next/image';
import { withSites } from '~/lib/sites';
import { appliances } from '~/lib/appliances';
import FAQLink from '~/lib/components/navigation/FAQLink';
import { pages } from './help/[page]';
import { hyphensToTitleCase } from '~/lib/utils';
import { FC } from 'react';

const MoreInfo: FC = () => {
  const sortedAppliances = appliances.sort((a, b) => b.kW - a.kW);

  const renderCarouselArrow = (
    src: string,
    type: 'left' | 'right',
    onClick: () => void,
    hasElement: boolean,
    label: string
  ) => (
    <div
      className={`absolute bottom-0  top-0 z-20 flex cursor-pointer select-none items-center p-3 transition-all ${
        type === 'left' ? 'left-0' : 'right-0'
      } ${
        hasElement
          ? 'opacity-1 pointer-events-auto'
          : 'pointer-events-none opacity-0'
      }`}
      onClick={onClick}
    >
      <Image src={src} alt={label} height={16} width={10} />
    </div>
  );

  return (
    <div className="min-h-screen w-screen max-w-screen-lg bg-ocf-black px-4">
      <h1 className="my-4 text-3xl font-bold text-ocf-gray">Help Center</h1>
      <h2 className="my-6 text-base font-semibold leading-none text-ocf-gray">
        Energy usage by appliance
      </h2>
      <div className="rounded-lg bg-ocf-black-500">
        <Carousel
          showStatus={false}
          showThumbs={false}
          infiniteLoop
          renderArrowPrev={(...args) =>
            renderCarouselArrow('/left-arrow.svg', 'left', ...args)
          }
          renderArrowNext={(...args) =>
            renderCarouselArrow('/right-arrow.svg', 'right', ...args)
          }
          renderIndicator={(clickHandler, isSelected, index, label) => {
            return (
              <li
                className={`mx-2 inline-block h-[8px] w-[8px] cursor-pointer rounded-full ${
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
          {sortedAppliances.map((element) => (
            <PowerInfoCard key={element.name} {...element} />
          ))}
        </Carousel>
      </div>
      <h2 className="my-6 text-base font-semibold leading-none text-ocf-gray">
        Help Topics
      </h2>
      <div>
        {Object.keys(pages).map((page) => {
          return (
            <FAQLink
              key={page}
              title={hyphensToTitleCase(page)}
              href={`/help/${page}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MoreInfo;

export const getServerSideProps = withSites();
