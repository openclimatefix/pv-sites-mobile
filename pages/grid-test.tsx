import { withSites } from '~/lib/utils';

const Grid = () => {
  return (
    <div className="grid grid-areas-dashboard-mobile grid-cols-mobile-columns grid-rows-mobile-rows md:grid-areas-dashboard-desktop md:grid-cols-desktop-columns md:grid-rows-desktop-rows h-[500px] w-full gap-5">
      <div className="grid-in-Heading1 bg-white"></div>
      <div className="grid-in-Heading2 bg-blue-900"></div>
      <div className="grid-in-Sunny bg-pink-400"></div>
      <div className="grid-in-Expected bg-purple-400"></div>
      <div className="grid-in-poop bg-orange-400"></div>
      <div className="grid-in-Recommendation bg-yellow-400"></div>
      <div className="grid-in-Graph bg-green-400"></div>
      <div className="grid-in-Site-Graph bg-blue-400"></div>
    </div>
  );
};

export default Grid;
export const getServerSideProps = withSites();
