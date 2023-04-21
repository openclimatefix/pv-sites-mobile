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
    <div className="mb-[var(--bottom-nav-margin)] flex h-full w-full max-w-lg flex-col items-center gap-3 px-5">
      <div className="mb-4 flex h-12 w-full flex-row items-end">
        <h1 className="flex-1 text-3xl font-bold text-ocf-gray">My Sites</h1>
        <button onClick={() => setEditMode(!editMode)}>
          {editMode ? (
            <p className="text-base font-semibold text-amber">Done</p>
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
