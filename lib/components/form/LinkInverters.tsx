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
    <div
      className="flex h-[520px] w-[320px] flex-col items-center md:mt-[75px] md:h-[550px] md:w-full"
      suppressHydrationWarning
    >
      <div className="mt-[40px] md:mt-[0px]" suppressHydrationWarning>
        <InverterGraphicIcon />
      </div>
      <div
        className="mt-[30px] text-[20px] text-white md:w-[485px] md:text-[24px]"
        suppressHydrationWarning
      >
        Would you like to link your inverter with Enode to provide better
        forecasting?
      </div>
      {mobile && !showInfo && (
        <button
          suppressHydrationWarning
          className="mt-[5px] w-full text-right text-[14px] text-ocf-yellow underline"
          onClick={() => setShowInfo(true)}
        >
          What&apos;s this?
        </button>
      )}
      {(!mobile || showInfo) && (
        <div className="mt-[20px] w-full text-[14px] text-ocf-gray-300 md:w-[485px]">
          Linking your inverter with Enode gives us access to your solar output
          data, providing you with better forecasts and more information
          available within our app.
        </div>
      )}

      {mobile && showInfo && (
        <button
          suppressHydrationWarning
          className="mt-[5px] w-full text-right text-[14px] text-ocf-yellow underline"
          onClick={() => setShowInfo(false)}
        >
          Show less
        </button>
      )}
      <div
        suppressHydrationWarning
        className="mt-auto flex flex-col justify-center md:mt-[75px] md:justify-start"
      >
        <Link href="https://www.google.com/">
          <Button variant="outlined">Yes, link my inverter</Button>
        </Link>
        {mobile && (
          <button className={mobileSkipButtonClass}>Skip this step</button>
        )}
      </div>
      <div
        suppressHydrationWarning
        className="mx-auto mt-auto hidden w-11/12 text-[5px] md:flex md:flex-row md:justify-end"
      >
        <Button variant="solid">
          Skip this step
          <ChevronRightIcon width={20} height={20} />
        </Button>
      </div>
    </div>
  );
};

export default LinkInverters;
