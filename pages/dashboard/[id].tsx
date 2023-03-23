import { useRouter } from 'next/router';
import { withSites } from '~/lib/utils';

const ID = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log(id);
  return <></>;
};

export default ID;
export const getServerSideProps = withSites();
