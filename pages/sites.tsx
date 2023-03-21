import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { EditIcon } from '~/components/icons';
import { useState } from 'react';
import SiteCardLink from '~/components/SiteCard';
import { withSites } from '~/lib/utils';
import { forecastFetcher } from '~/lib/hooks/utils';
import useSWR from 'swr';

const Sites = () => {
  const [editMode, setEditMode] = useState(false);

  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sites`
  );

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
      <SiteCardLink isEditMode={editMode} />
      <SiteCardLink isEditMode={editMode} />
      <SiteCardLink isEditMode={editMode} />
      <SiteCardLink isEditMode={editMode} />
    </div>
  );
};

export default Sites;
export const getServerSideProps = withSites();
