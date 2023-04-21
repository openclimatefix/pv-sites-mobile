import { useState } from 'react';
import InverterGraphicIcon from '../icons/InverterGraphicIcon';
import Link from 'next/link';
import useMediaQuery from '~/lib/hooks/useMediaQuery';
import Button from '../Button';
import Spinner from '../Spinner';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

const LinkInverters = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const mobile = useMediaQuery('(max-width: 768px)');

  const mobileSkipButtonClass =
    'w-full text-[#FFD053] underline text-[14px] mt-[5px]';

  const mobileInverterLinkClass =
    'h-[54px] w-[308px] bg-[#FFD053] rounded-md font-semibold mb-[20px]';

  const deslktopInverterLinkClass =
    'h-[54px] w-[308px] text-[#FFD053] border-[#FFD053] border-[2px] rounded-md font-semibold';

  return (
    <div className="w-[320px] h-[550px] md:w-full flex flex-col items-center md:mt-[75px]">
      <InverterGraphicIcon />
      <div className="text-white mt-[30px] md:w-[485px] text-[20px] md:text-[24px]">
        Would you like to link your inverter with Enode to provide better
        forecasting?
      </div>
      {mobile && !showDisclaimer && (
        <button
          className="w-full text-right text-[#FFD053] underline text-[14px] mt-[5px]"
          onClick={() => setShowDisclaimer(!showDisclaimer)}
        >
          What&apos;s this?
        </button>
      )}
      {mobile ? (
        showDisclaimer && (
          <div className="w-full text-[#DDDDDD] text-[14px] mt-[20px] md:w-[485px]">
            Linking your inverter with Enode gives us access to your solar
            output data, providing you with better forecasts and more
            information available within our app.
          </div>
        )
      ) : (
        <div className="w-full text-[#DDDDDD] text-[16px] mt-[20px] md:w-[485px]">
          Linking your inverter with Enode gives us access to your solar output
          data, providing you with better forecasts and more information
          available within our app.
        </div>
      )}

      {mobile && showDisclaimer && (
        <button
          className="w-full text-right text-[#FFD053] underline text-[14px] mt-[5px]"
          onClick={() => setShowDisclaimer(!showDisclaimer)}
        >
          Show less
        </button>
      )}
      <div className="flex flex-col md:justify-start justify-center md:mt-[50px] mt-auto">
        <Link href="https://www.cnn.com/2023/04/17/us/kansas-city-teen-shot-wrong-house/index.html">
          <button
            className={
              mobile ? mobileInverterLinkClass : deslktopInverterLinkClass
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
        <Button disabled={false} variant="nextHoverButton">
          Skip this step
          <ChevronRightIcon width={20} height={20} />
        </Button>
      </div>
    </div>
  );
};

export default LinkInverters;
