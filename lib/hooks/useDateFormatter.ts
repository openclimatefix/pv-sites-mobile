import useSiteData from './useSiteData';

const useDateFormatter = (siteUUID: string) => {
  const { latitude, longitude } = useSiteData(siteUUID);
};

export default useDateFormatter;
