import InverterView from '~/components/InverterView';
import { withSites } from '~/lib/utils';

const Inverter = () => (
  <div className="w-full h-full">
    <InverterView siteUUID="abcdefg" isSelectMode={true} />
  </div>
);

export default Inverter;
export const getServerSideProps = withSites();
