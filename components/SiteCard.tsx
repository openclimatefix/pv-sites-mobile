import { FC, useEffect, useRef, useState } from 'react';
import { DeleteIcon, EditIcon } from './icons';
import Link from 'next/link';

import SiteGraph from './graphs/SiteGraph';

interface SiteCardProps {
  href?: string;
  isEditMode: boolean;
}

const siteUUID = 'b97f68cd-50e0-49bb-a850-108d4a9f7b7e';

const SiteCard: FC<SiteCardProps> = ({ isEditMode }) => {
  const animationElement = useRef<HTMLDivElement>(null);
  const [displayGraph, setDisplayGraph] = useState(!isEditMode);

  useEffect(() => {
    animationElement.current?.addEventListener('transitionend', () => {
      if (isEditMode) {
        setDisplayGraph(false);
      } else {
        setDisplayGraph(true);
      }
    });
  }, [isEditMode]);

  console.log(displayGraph);

  return (
    <a
      className={`h-fit w-full max-w-lg flex flex-row bg-ocf-gray-1000 rounded-lg font-bold overflow-hidden ${
        !isEditMode ?? 'pointer-events-none'
      }`}
    >
      <div className="flex flex-col flex-1 p-3">
        <h2 className="text-amber text-xl font-semibold">My Home</h2>
        <div className="flex flex-col mt-2 gap-1">
          <p className="text-ocf-gray-500 text-xs font-medium">
            Panel direction: 135
          </p>
          <p className="text-ocf-gray-500 font-medium text-xs">
            Panel tilt: 40
          </p>
          <p className="text-ocf-gray-500 font-medium text-xs">
            Max. capacity: 2800 kWh
          </p>
        </div>
      </div>

      <div
        className={`justify-center self-center mr-5 transition-all overflow-hidden max-w-[250px] ${
          !isEditMode ? 'flex-1' : 'flex-0 w-0'
        } duration-[900ms]`}
        ref={animationElement}
      >
        {displayGraph && <SiteGraph siteUUID={siteUUID} />}
      </div>

      <div
        className={`transition-all ${
          isEditMode ? 'w-4/12' : 'w-0'
        } duration-[900ms] flex translate-x-40`}
      >
        <Link href={'/form/details'} className={`fixed right-0`}>
          <a
            className={`w-full flex bg-amber flex-end justify-center ease-in-out transition duration-[900ms] ${
              isEditMode ? '-translate-x-40' : 'translate-x-40'
            } ${!isEditMode ?? 'pointer-events-none'}`}
          >
            <div className="flex flex-col self-center justify-center items-center">
              <div className="flex-1 mb-2">
                <EditIcon color="#14120E" />
              </div>
              <p className="flex-1 text-[8px]	text-center px-5">
                Edit site details
              </p>
            </div>
          </a>
        </Link>
        <Link href={'/form/details'} className={`fixed right-0`}>
          <a
            className={`w-full flex bg-[#D44545] flex-end justify-center ease-in-out transition duration-[900ms] ${
              isEditMode ? '-translate-x-40' : 'translate-x-0'
            } ${!isEditMode ?? 'pointer-events-none'}`}
            
          >
            <div className="flex flex-col self-center justify-center items-center">
              <div className="flex-1 mb-2">
                <DeleteIcon />
              </div>
              <p className="flex-1 text-[8px]	text-center px-5 text-[#E4E4E4] mb-2">
                Delete site
              </p>
            </div>
          </a>
        </Link>
      </div>
    </a>
  );
};

interface SiteCardLinkProps {
  isEditMode: boolean;
}

const SiteCardLink: FC<SiteCardLinkProps> = ({ isEditMode }) => {
  return (
    <Link href="/dashboard" passHref>
      <SiteCard isEditMode={isEditMode} />
    </Link>
  );
};

export default SiteCardLink;
