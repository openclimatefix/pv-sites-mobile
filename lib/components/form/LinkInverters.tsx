import Link from 'next/link';
import { FC, useState } from 'react';
import Button from '../Button';
import InverterGraphicIcon from '../icons/InverterGraphicIcon';
import { ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import { fetcher } from '~/lib/swr';
import { useIsMobile } from '~/lib/utils';
import ema from '~/public/inverters/ema.png';
import enphase from '~/public/inverters/enphase.png';
import fronius from '~/public/inverters/fronius.png';
import goodwe from '~/public/inverters/goodwe.png';
import growatt from '~/public/inverters/growatt.png';
import solaredge from '~/public/inverters/solaredge.png';
import solis from '~/public/inverters/solis.png';

const brands = {
  EMA: ema,
  Enphase: enphase,
  Fronius: fronius,
  Goodwe: goodwe,
  Growatt: growatt,
  SolarEdge: solaredge,
  Solis: solis,
} as const;

const SupportedInverters = () => {
  return (
    <div>
      {Object.keys(brands).map((brand) => {
        return (
          <div key={brand} className="flex flex-row">
            <img
              src={brands[brand as keyof typeof brands].src}
              alt={`${brand} logo`}
            ></img>
            <div className="my-2 self-center text-ocf-gray-300">{brand}</div>
          </div>
        );
      })}
    </div>
  );
};

const LinkInverters: FC<{ siteUUID: string }> = ({ siteUUID }) => {
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);
  const [showInvertersModal, setShowInvertersModal] = useState<boolean>(false);
  const isMobile = useIsMobile();
  const router = useRouter();

  const getLinkAndRedirect = async () => {
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

  const mobileSkipButtonClass =
    'flex items-center text-ocf-yellow text-[14px] mt-[5px]';

  return (
    <div className="flex h-[90vh] w-full flex-col px-5 md:overflow-hidden md:pb-6 md:pt-[75px]">
      <div className="mt-[40px] self-center md:mt-[0px]">
        <InverterGraphicIcon />
      </div>
      <div className="mx-8 mt-[30px] self-center text-[20px] text-white md:w-[485px] md:text-[24px]">
        Would you like to link your inverter with Enode to provide better
        forecasting?
      </div>
      <button
        className="mt-[5px] block w-full self-center text-right text-[14px] text-ocf-yellow underline md:hidden"
        onClick={() => setShowInfoModal(true)}
      >
        What&apos;s this?
      </button>

      {showInfoModal && (
        <div
          className="fixed inset-0 flex h-[var(--onboarding-height)] w-full items-center justify-center bg-ocf-black bg-opacity-50"
          onClick={() => setShowInfoModal(false)}
        >
          <div
            className="h-auto rounded-lg bg-ocf-black-500 px-4 py-3 text-white opacity-100"
            onClick={(e: React.MouseEvent<HTMLInputElement>) =>
              e.stopPropagation()
            }
          >
            <div className="mt-[15px] block w-[225px] self-center text-[14px] text-ocf-gray-300 md:block md:w-[485px]">
              Linking your inverter with Enode gives us access to your solar
              output data, providing you with better forecasts and more
              information available within our app.
            </div>
            <div className="w-100 flex h-auto items-center justify-end">
              <button
                className="block h-8 w-20 rounded-md bg-ocf-yellow text-center text-xs font-bold text-ocf-black shadow transition duration-150"
                onClick={() => setShowInfoModal(false)}
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={
          'mt-[20px] hidden self-center text-[14px] text-ocf-gray-300 md:block md:w-[485px]'
        }
      >
        Linking your inverter with Enode gives us access to your solar output
        data, providing you with better forecasts and more information available
        within our app.
      </div>

      <div className="block self-center md:hidden">
        <div className="mt-10 self-center text-ocf-gray-300">
          Supported Inverters
        </div>
        <div className="mt-3 max-h-44 self-center overflow-y-scroll px-6">
          {SupportedInverters()}
        </div>
      </div>

      <a className="mt-10 self-center md:mt-5">
        <Button
          variant="outlined"
          onClick={getLinkAndRedirect}
          className="w-[250px]"
        >
          Yes, link my inverter
        </Button>
      </a>

      <button
        className="mt-4 hidden w-full self-center text-[14px] text-ocf-yellow md:block"
        onClick={() => setShowInvertersModal(true)}
      >
        View supported inverters
      </button>

      {showInvertersModal && (
        <div
          className="fixed inset-0 flex h-full w-full items-center justify-center bg-ocf-black bg-opacity-50"
          onClick={() => setShowInvertersModal(false)}
        >
          <div
            className="h-auto rounded-lg bg-ocf-black-500 px-4 py-3 text-white opacity-100"
            onClick={(e: React.MouseEvent<HTMLInputElement>) =>
              e.stopPropagation()
            }
          >
            <div className="flex flex-col self-center">
              <div className="flex w-full justify-end">
                <div className="flex-grow" />
                <button
                  className="w-fit"
                  onClick={() => setShowInvertersModal(false)}
                >
                  <XMarkIcon className="h-5 w-5"></XMarkIcon>
                </button>
              </div>
              <div className="mx-10 text-center text-ocf-gray-300">
                Supported Inverters
              </div>
              <div className="mt-3 self-center px-6">
                {SupportedInverters()}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto my-3 flex justify-end md:mt-auto md:w-10/12">
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
