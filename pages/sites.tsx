import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';
import SiteCard from '~/lib/components/SiteCard';
import { useSites, withSites } from '~/lib/sites';

const Sites = () => {
  const [editMode, setEditMode] = useState(false);
  const { sites } = useSites();

  return (
    <div className="mb-[var(--bottom-nav-margin)] flex h-full w-full max-w-lg flex-col items-center gap-3 px-5">
      <div className="flex h-6 w-full flex-row items-start">
        <h1 className="flex-1 text-xl font-semibold text-ocf-gray">My Sites</h1>
        <button onClick={() => setEditMode(!editMode)}>
          {editMode ? (
            <p className="text-base font-semibold text-amber">Done</p>
          ) : (
            <PencilSquareIcon color="#E4E4E4" width="24" height="24" />
          )}
        </button>
      </div>
      <hr className="mx-[-100px] mb-4 h-[1px] w-[500%] border-0 bg-ocf-black-500 md:hidden" />
      {sites.map((site) => (
        <SiteCard key={site.site_uuid} site={site} isEditMode={editMode} />
      ))}
      {editMode && (
        <Link href="/site-details">
          <div className="mt-4 flex flex-row justify-center gap-2">
            <PlusCircleIcon width={28} height={28} color="#FFD053" />
            <h2 className="text-bold text-xl text-ocf-yellow-500">
              Add a site
            </h2>
          </div>
        </Link>
      )}
    </div>
  );
};

export default Sites;
export const getServerSideProps = withSites();
