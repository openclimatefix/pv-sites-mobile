import { useState } from 'react';
import InverterGraphicIcon from '../icons/InverterGraphicIcon';
import Link from 'next/link';
import useMediaQuery from '~/lib/hooks/useMediaQuery';
import Button from '../Button';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

const LinkInverters = () => {
  const [showInfo, setShowInfo] = useState(false);
  const mobile = useMediaQuery('(max-width: 768px)');

  const mobileSkipButtonClass =
    'w-full text-ocf-yellow underline text-[14px] mt-[5px]';

  const mobileInverterLinkClass =
    'h-[54px] w-[308px] bg-ocf-yellow rounded-md font-semibold mb-[20px]';

  const desktopInverterLinkClass =
    'h-[54px] w-[308px] text-ocf-yellow border-ocf-yellow border-[2px] rounded-md font-semibold';

  return (
    <div className="w-[320px] h-[510px] md:h-[550px] md:w-full flex flex-col items-center md:mt-[75px]">
      <div className="mt-[40px] md:mt-[0px]">
        <InverterGraphicIcon />
      </div>
      <div className="text-white mt-[30px] md:w-[485px] text-[20px] md:text-[24px]">
        Would you like to link your inverter with Enode to provide better
        forecasting?
      </div>
      {mobile && !showInfo && (
        <button
          className="w-full text-right text-ocf-yellow underline text-[14px] mt-[5px]"
          onClick={() => setShowInfo(true)}
        >
          What&apos;s this?
        </button>
      )}
      {(!mobile || showInfo) && (
        <div className="w-full text-ocf-gray-300 text-[14px] mt-[20px] md:w-[485px]">
          Linking your inverter with Enode gives us access to your solar output
          data, providing you with better forecasts and more information
          available within our app.
        </div>
      )}

      {mobile && showInfo && (
        <button
          className="w-full text-right text-ocf-yellow underline text-[14px] mt-[5px]"
          onClick={() => setShowInfo(false)}
        >
          Show less
        </button>
      )}
      <div className="flex flex-col md:justify-start justify-center md:mt-[50px] mt-auto">
        <Link href="https://www.google.com/">
          <button
            className={
              mobile ? mobileInverterLinkClass : desktopInverterLinkClass
            }
          >
            Yes, link my inverter
          </button>
        </Link>
        {mobile && (
          <button className={mobileSkipButtonClass}>Skip this step</button>
        )}
      </div>
      <div className="hidden md:flex md:flex-row md:justify-end w-11/12 mx-auto mt-auto text-[5px]">
        <Button disabled={false} variant="next-hover-button">
          Skip this step
          <ChevronRightIcon width={20} height={20} />
        </Button>
      </div>
    </div>
  );
};

export default LinkInverters;
