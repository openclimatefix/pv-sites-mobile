import Link from 'next/link';
import { FC, useState } from 'react';
import Button from '../Button';
import InverterGraphicIcon from '../icons/InverterGraphicIcon';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { NextRouter, useRouter } from 'next/router';
import { fetcher } from '~/lib/swr';
import { useIsMobile } from '~/lib/utils';

export const getEnodeLinkAndRedirect = async (
  siteUUID: string,
  router: NextRouter
) => {
  const res = await fetcher(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL_GET
    }/enode/link?${new URLSearchParams({
      redirect_uri: encodeURIComponent(
        `${process.env.NEXT_PUBLIC_BASE_URL}/inverters/${siteUUID}`
      ),
    })}`
  );
  router.push(res);
};

const LinkInverters: FC<{ siteUUID: string }> = ({ siteUUID }) => {
  const [showInfo, setShowInfo] = useState(false);
  const isMobile = useIsMobile();
  const router = useRouter();

  const mobileSkipButtonClass =
    'flex items-center text-ocf-yellow text-[14px] mt-[5px]';

  return (
    <div className="flex min-h-[70vh] w-full flex-col px-5 md:mt-[75px]">
      <div className="mt-[40px] self-center md:mt-[0px]">
        <InverterGraphicIcon />
      </div>
      <div className="mt-[30px] self-center text-[20px] text-white md:w-[485px] md:text-[24px]">
        Would you like to link your inverter with Enode to provide better
        forecasting?
      </div>
      {!showInfo && (
        <button
          className="mt-[5px] block w-full self-center text-right text-[14px] text-ocf-yellow underline md:hidden"
          onClick={() => setShowInfo(true)}
        >
          What&apos;s this?
        </button>
      )}

      <div
        className={`mt-[20px] w-full self-center text-[14px] text-ocf-gray-300 md:block md:w-[485px] ${
          showInfo ? 'block' : 'hidden'
        }`}
      >
        Linking your inverter with Enode gives us access to your solar output
        data, providing you with better forecasts and more information available
        within our app.
      </div>

      {showInfo && (
        <button
          className="mt-[5px] block w-full self-center text-right text-[14px] text-ocf-yellow underline md:hidden"
          onClick={() => setShowInfo(false)}
        >
          Show less
        </button>
      )}

      <a className="mt-auto self-center md:mt-5">
        <Button
          variant="outlined"
          onClick={() => getEnodeLinkAndRedirect(siteUUID, router)}
          className="w-[250px]"
        >
          Yes, link my inverter
        </Button>
      </a>

      <div className="mx-auto mb-3 mt-3 flex justify-end md:mb-8 md:mt-auto md:w-10/12">
        <Link href={isMobile ? '/sites' : `/dashboard/${siteUUID}`} passHref>
          <a className={mobileSkipButtonClass}>
            Skip this step{' '}
            <ChevronRightIcon
              width="24"
              height="24"
              className="hidden md:block"
            />
          </a>
        </Link>
      </div>
    </div>
  );
};

export default LinkInverters;
