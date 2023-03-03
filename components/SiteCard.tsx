import { FC, PropsWithChildren } from 'react';
import { EditIcon, DeleteIcon } from './icons/sidebar_icons';
import Link from 'next/link';

const SiteCard: FC<PropsWithChildren<{}>> = () => {
  return (
    <Link href="/dashboard">
      <span className="h-fit w-full flex bg-ocf-gray-1000 p-3 rounded-md font-bold">
        <div className="flex flex-col flex-1">
          <h1 className="text-amber text-xl font-bold">My Home</h1>
          <h3 className="text-ocf-gray-500 text-sm mt-1.5">
            Panel direction: 135
          </h3>
          <h3 className="text-ocf-gray-500 text-sm">Panel tilt: 40</h3>
          <h3 className="text-ocf-gray-500 text-sm">Max. capacity: 2800 kWh</h3>
        </div>
        <div className="flex flex-col w-fit ">
          <div className="flex-1">
            <EditIcon />
          </div>
          <DeleteIcon />
        </div>
      </span>
    </Link>
  );
};

export default SiteCard;
