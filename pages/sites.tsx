import { PencilSquareIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import SiteCardLink from '~/lib/components/SiteCard';
import { useSites, withSites } from '~/lib/sites';

const Sites = () => {
  const [editMode, setEditMode] = useState(false);

  const { sites: allSites } = useSites();

  // TODO: Paginate this or something... when pulling from actual API it's just too many
  const sites = allSites.slice(0, 5);

  return (
    <div className="h-full w-full flex flex-col gap-3 items-center px-5 mb-[var(--bottom-nav-margin)] max-w-lg">
      <div className="flex flex-row w-full h-12 items-end mb-4">
        <h1 className="flex-1 font-bold text-3xl text-ocf-gray">My Sites</h1>
        <button onClick={() => setEditMode(!editMode)}>
          {editMode ? (
            <p className="text-amber text-base font-semibold">Done</p>
          ) : (
            <PencilSquareIcon color="#E4E4E4" width="24" height="24" />
          )}
        </button>
      </div>
      {sites.map((site) => (
        <SiteCardLink key={site.site_uuid} site={site} isEditMode={editMode} />
      ))}
    </div>
  );
};

export default Sites;
export const getServerSideProps = withSites();
