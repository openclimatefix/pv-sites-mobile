import InverterView from '~/components/InverterView';
import { withSites } from '~/lib/utils';

const Inverter = () => (
  <div className="w-full h-full">
    <InverterView siteUUID="abcdefg" />
  </div>
);

export default Inverter;
export const getServerSideProps = withSites();
