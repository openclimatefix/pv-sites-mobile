import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import SiteCard from '~/components/SiteCard';
import { EditIcon } from '~/components/icons';
import { useState } from 'react';

const Sites = () => {
  const [editMode, setEditMode] = useState(false);

  return (
    <div className="h-full w-full flex flex-col gap-3 items-center px-5">
      <div className="flex flex-row w-full h-12 items-end mb-4 max-w-lg ">
        <h1 className="flex-1 font-bold text-3xl text-ocf-gray">My Sites</h1>
        <button onClick={() => setEditMode(!editMode)}>
          {editMode ? (
            <p className="text-amber text-md font-semibold">Done</p>
          ) : (
            <EditIcon />
          )}
        </button>
      </div>
      <SiteCard isEditMode={editMode} />
      <SiteCard isEditMode={editMode} />
      <SiteCard isEditMode={editMode} />
      <SiteCard isEditMode={editMode} />
    </div>
  );
};

export default Sites;
export const getServerSideProps = withPageAuthRequired();
