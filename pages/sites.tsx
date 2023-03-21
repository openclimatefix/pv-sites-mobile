import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { EditIcon } from '~/components/icons';
import { useState } from 'react';
import SiteCardLink from '~/components/SiteCard';
import { withSites } from '~/lib/utils';
import { SiteList } from '~/lib/types';
import useSWR from 'swr';

const ParseSiteUUIDs = (data: SiteList): string[] => {
  const res = [];
  if (data) {
    for (let i = 0; i < data.site_list.length; i++) {
      res.push(data.site_list[i].site_uuid);
    }
  }
  return res;
};
const Sites = () => {
  const [editMode, setEditMode] = useState(false);

  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sites`
  );

  const siteUUIDs: string[] = ParseSiteUUIDs(data);

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
      {siteUUIDs.map((site_uuid: string, idx: number) => (
        <SiteCardLink key={idx} siteUUID={site_uuid} isEditMode={editMode} />
      ))}
    </div>
  );
};

export default Sites;
export const getServerSideProps = withSites();
