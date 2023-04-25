import { withSites } from '~/lib/utils';

const Help = () => {
  return <div />;
};

export default Help;
export const getServerSideProps = withSites({
  async getServerSideProps({ siteList }) {
    return {
      redirect: {
        permanent: false,
        destination: `/help/add-site-location`,
      },
    };
  },
});
