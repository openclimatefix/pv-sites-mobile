import { withSites } from '~/lib/utils';
import { pages } from '../help/[page]'

const Help = () => {
  return <div />;
};

export default Help;
export const getServerSideProps = withSites({
  async getServerSideProps({ siteList }) {
    return {
      redirect: {
        permanent: false,
        destination: `/help/${Object.keys(pages)[0]}`,
      },
    };
  },
});
