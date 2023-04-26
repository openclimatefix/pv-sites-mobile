import LinkInverters from '~/lib/components/form/LinkInverters';
import { withSites } from '~/lib/sites';

const Inverters = () => {
  return <LinkInverters />;
};

export default Inverters;
export const getServerSideProps = withSites();
