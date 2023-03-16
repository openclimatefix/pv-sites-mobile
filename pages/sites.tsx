import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import SiteCard from '~/components/SiteCard';
import { EditIcon } from '~/components/icons';

const Sites = () => {
  return (
    <div className="h-full w-full flex flex-col gap-3 items-center px-5">
      <div className="flex flex-row w-full h-12 items-end mb-4 pr-3">
        <h1 className="flex-1 font-bold text-3xl text-ocf-gray">My Sites</h1>
        <EditIcon/>
      </div>
      <SiteCard isEditMode={true} />
      <SiteCard isEditMode={false} />
      <SiteCard isEditMode={false} />
      <SiteCard isEditMode={false} />
    </div>
  );
}

export default Sites
export const getServerSideProps = withPageAuthRequired();