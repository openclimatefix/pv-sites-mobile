import Link from 'next/link';
import { FC, useState } from 'react';
import Button from '../Button';
import InverterGraphicIcon from '../icons/InverterGraphicIcon';
import { ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import { fetcher } from '~/lib/swr';
import { useIsMobile } from '~/lib/utils';
import Modal from '~/lib/components/Modal';
import ema from '../../../public/inverters/ema.png';
import enphase from '../../../public/inverters/enphase.png';
import fronius from '../../../public/inverters/fronius.png';
import goodwe from '../../../public/inverters/goodwe.png';
import growatt from '../../../public/inverters/growatt.png';
import solaredge from '../../../public/inverters/solaredge.png';
import solis from '../../../public/inverters/solis.png';

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
          <div className="flex flex-row">
            <img
              src={brands[brand as keyof typeof brands].src}
              alt={brand}
            ></img>
            <div className="my-2 self-center text-ocf-gray-300">{brand}</div>
          </div>
        );
      })}
    </div>
  );
};

const LinkInverters: FC<{ siteUUID: string }> = ({ siteUUID }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
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
    <div className="flex min-h-[70vh] w-full flex-col px-5 md:mt-[75px]">
      <div className="mt-[40px] self-center md:mt-[0px]">
        <InverterGraphicIcon />
      </div>
      <div className="mx-8 mt-[30px] self-center text-[20px] text-white md:w-[485px] md:text-[24px]">
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
          className="mt-[5px] w-full self-center text-center text-[14px] text-ocf-yellow underline md:hidden"
          onClick={() => setShowInfo(false)}
        >
          Show less
        </button>
      )}

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
        className="mt-4 hidden w-full self-center text-[14px] font-semibold text-ocf-yellow md:block"
        onClick={() => setShowModal(true)}
      >
        View supported inverters
      </button>

      {showModal && (
        <div
          className="fixed inset-0 flex h-full w-full items-center justify-center bg-ocf-black bg-opacity-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="h-auto rounded-lg bg-ocf-gray-1000 px-4 py-3 text-white opacity-100"
            onClick={(e: React.MouseEvent<HTMLInputElement>) =>
              e.stopPropagation()
            }
          >
            <div className="flex flex-col self-center">
              <div className="flex w-full justify-end">
                <div className="flex-grow" />
                <button className="w-fit" onClick={() => setShowModal(false)}>
                  <XMarkIcon className="h-5 w-5"></XMarkIcon>
                </button>
              </div>
              <div className="text-center text-ocf-gray-300">
                Supported Inverters
              </div>
              <div className="mt-3 max-h-56 self-center overflow-y-scroll px-6">
                {SupportedInverters()}
              </div>
            </div>
          </div>
        </div>
      )}

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
