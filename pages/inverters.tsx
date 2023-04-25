import LinkInverters from '~/lib/components/form/LinkInverters';
import ViewInverters from '~/lib/components/form/ViewInverters';
import { withSites } from '~/lib/sites';

const Inverters = () => {
  return <ViewInverters siteUUID="askdjfaskjldf" isSelectMode />;
};

export default Inverters;
export const getServerSideProps = withSites();
