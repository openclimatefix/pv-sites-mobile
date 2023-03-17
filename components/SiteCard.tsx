import { FC, PropsWithChildren } from 'react';
import { DeleteIcon, EditIcon } from './icons';
import Link from 'next/link';

interface SiteCardProps {
  href?: string;
}

const SiteCard: FC<SiteCardProps> = ({ href }) => (
  <a
    href={href}
    className="h-fit w-full max-w-lg flex bg-ocf-gray-1000 p-3 rounded-lg font-bold"
  >
    <div className="flex flex-col flex-1">
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
    {!href && (
      <div className="flex flex-col w-fit">
        <div className="flex-1">
          <button>
            <EditIcon />
          </button>
        </div>
        <button>
          <DeleteIcon />
        </button>
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
