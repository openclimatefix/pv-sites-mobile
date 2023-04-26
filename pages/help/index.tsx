import { withSites } from '~/lib/sites';
import { pages } from '../help/[page]';

const Help = () => {
  return <div />;
};

export default Help;
export const getServerSideProps = withSites({
  async getServerSideProps({ sites }) {
    return {
      redirect: {
        permanent: false,
        destination: `/help/${Object.keys(pages)[0]}`,
      },
    };
  },
});
