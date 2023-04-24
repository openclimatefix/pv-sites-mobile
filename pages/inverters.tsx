import { withSites } from '~/lib/utils';
import LinkInverters from '~/components/form/LinkInverters';

const Inverters = () => {
  return <LinkInverters />;
};

export default Inverters;
export const getServerSideProps = withSites();
