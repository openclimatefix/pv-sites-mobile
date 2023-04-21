import { EditIcon } from '~/components/icons';
import { useState } from 'react';
import SiteCardLink from '~/components/SiteCard';
import { withSites } from '~/lib/utils';
import { SiteList } from '~/lib/types';
import useSWR from 'swr';
import LinkInverters from '~/components/form/LinkInverters';

/**
 * Helper function that returns a string[] of all the UUIDs collected from our data
 * @param data the raw list of all site objects (contains more than just uuid)
 * @returns siteUUIDs, a string array of all the valid site UUIDs
 */

const Inverters = () => {
  return <LinkInverters></LinkInverters>;
};

export default Inverters;
export const getServerSideProps = withSites();
