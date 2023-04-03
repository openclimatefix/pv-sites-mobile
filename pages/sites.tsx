import { EditIcon } from '~/components/icons';
import { useState } from 'react';
import SiteCardLink from '~/components/SiteCard';
import { withSites } from '~/lib/utils';
import { SiteList } from '~/lib/types';
import useSWR from 'swr';

/**
 * Helper function that returns a string[] of all the UUIDs collected from our data
 * @param data the raw list of all site objects (contains more than just uuid)
 * @returns siteUUIDs, a string array of all the valid site UUIDs
 */
const parseSiteUUIDs = (data: SiteList): string[] => {
  const siteUUIDs = [];
  if (data) {
    for (let i = 0; i < data.site_list.length; i++) {
      siteUUIDs.push(data.site_list[i].site_uuid);
    }
  }
  return siteUUIDs;
};

export const transitionDuration = 900;

const Sites = () => {
  const [editMode, setEditMode] = useState(false);

  const [isDisabled, setIsDisabled] = useState(false);
  const { data } = useSWR<SiteList>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL_GET}/sites`
  );

  // TODO: Paginate this or something... when pulling from actual API it's just too many
  const siteData = { site_list: data?.site_list.slice(0, 5) ?? [] };

  const siteUUIDs = parseSiteUUIDs(siteData);

  return (
    <div className="h-full w-full flex flex-col gap-3 items-center px-5">
      <div className="flex flex-row w-full h-12 items-end mb-4 max-w-lg ">
        <h1 className="flex-1 font-bold text-3xl text-ocf-gray">My Sites</h1>
        <button
          onClick={() => {
            setEditMode(!editMode);
            setIsDisabled(true);
            setTimeout(() => {
              setIsDisabled(false);
            }, transitionDuration);
          }}
          className={isDisabled ? 'pointer-events-none' : ''}
        >
          {editMode ? (
            <p className="text-amber text-md font-semibold">Done</p>
          ) : (
            <EditIcon color="#E4E4E4" />
          )}
        </button>
      </div>
      {siteUUIDs.map((siteUUID: string) => (
        <SiteCardLink
          key={siteUUID}
          siteUUID={siteUUID}
          isEditMode={editMode}
        />
      ))}
    </div>
  );
};

export default Sites;
export const getServerSideProps = withSites();
