import { pages } from '../help/[page]';

const Help = () => {
  return null;
};

export default Help;
export const getServerSideProps = () => {
  return {
    redirect: {
      permanent: false,
      destination: `/help/${Object.keys(pages)[0]}`,
    },
  };
};
