import { withSites } from '~/lib/utils';

const Grid = () => {
  return (
    <div className="grid grid-areas-layout grid-cols-layout grid-rows-layout h-[500px] w-full">
      <div className="grid-in-header bg-red-400"></div>
      <div className="grid-in-main bg-blue-400"></div>
      <div className="grid-in-footer bg-green-400"></div>
    </div>
  );
};

export default Grid;
export const getServerSideProps = withSites();
