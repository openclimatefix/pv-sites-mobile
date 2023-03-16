import { FC, PropsWithChildren } from 'react';
import { DeleteIcon, EditIcon } from './icons';
import Link from 'next/link';

interface SiteCardProps {
  isEditMode: boolean;
}

const SiteCard: FC<PropsWithChildren<SiteCardProps>> = ({
  isEditMode = false,
}) => {
  return (
    <Link href="/dashboard">
      <span className="h-fit w-full max-w-lg flex bg-ocf-gray-1000 p-3 rounded-lg font-bold">
        <div className="flex flex-col flex-1">
          <h1 className="text-amber text-xl font-bold">My Home</h1>
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
        {isEditMode && (
          <div className="flex flex-col w-fit ">
            <div className="flex-1">
              <EditIcon />
            </div>
            <DeleteIcon />
          </div>
        )}
      </span>
    </Link>
  );
};

export default SiteCard;
