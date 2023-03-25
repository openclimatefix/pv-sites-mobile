import { FC, PropsWithChildren } from 'react';
import { DeleteIcon, EditIcon } from './icons';
import Link from 'next/link';

import SiteGraph from './graphs/SiteGraph';

interface SiteCardProps {
  href?: string;
}

const siteUUID = 'b97f68cd-50e0-49bb-a850-108d4a9f7b7e';

const SiteCard: FC<SiteCardProps> = ({ href }) => (
  <a
    href={href}
    className="h-fit w-full max-w-lg flex flex-row bg-ocf-gray-1000 rounded-lg font-bold overflow-hidden"
  >
    <div className="flex flex-col flex-1 p-3">
      <h2 className="text-amber text-xl font-semibold">My Home</h2>
      <div className="flex flex-col mt-2 gap-1">
        <p className="text-ocf-gray-500 text-xs font-medium">
          Panel direction: 135
        </p>
        <p className="text-ocf-gray-500 font-medium text-xs">Panel tilt: 40</p>
        <p className="text-ocf-gray-500 font-medium text-xs">
          Max. capacity: 2800 kWh
        </p>
      </div>
    </div>
    {href ? (
      <div className="flex-1">
        <SiteGraph siteUUID={siteUUID} />
      </div>
    ) : (
      <div className="w-4/12 flex">
        <Link href={'/form/details'}>
          <a className="w-6/12 flex bg-amber flex-end justify-center">
            <div className="self-center justify-center">
              <EditIcon />
              <p className="text-xs	text-center">Edit site details</p>
            </div>
          </a>
        </Link>
        <Link href={'/form/details'}>
          <a className="w-6/12 flex bg-[#D44545] flex-end justify-center">
            <div className="self-center justify-center">
              <DeleteIcon />
              <p className="text-xs	text-center">Delete site</p>
            </div>
          </a>
        </Link>
      </div>
    )}
  </a>
);

interface SiteCardLinkProps {
  isEditMode: boolean;
}

const SiteCardLink: FC<SiteCardLinkProps> = ({ isEditMode }) => {
  return isEditMode ? (
    <SiteCard />
  ) : (
    <Link href="/dashboard" passHref>
      <SiteCard />
    </Link>
  );
};

export default SiteCardLink;
