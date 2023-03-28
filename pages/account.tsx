import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC } from 'react';
import useSWR from 'swr';
import { Inverter } from '~/lib/enode';
import { withSites } from '~/lib/utils';

type Props = {
  inverters: Inverter[] | null;
};

const AccountInfo: FC<Props> = ({ inverters }) => {
  if (!inverters) {
    return (
      <Link href="/api/enode/link">
        <a className="text-white">Link account</a>
      </Link>
    );
  }

  return (
    <>
      <h2 className="text-white">Info</h2>
      {inverters.map((inverter, i) => (
        <p key={i} className="text-white">
          Inverter ID: {inverter.id}, rate:{' '}
          {inverter.productionState.productionRate}
          {JSON.stringify(inverter)}
        </p>
      ))}
      <Link href="/api/enode/clear-users">
        <a className="text-white">CLEAR USERS ONLY DEV</a>
      </Link>
    </>
  );
};

const Account: NextPage<Props> = () => {
  const { query, replace } = useRouter();

  // To add later after this is a toast...
  //   useEffect(() => {
  //     if (query.linkSuccess) {
  //       replace('/account');
  //     }
  //   }, []);

  const { data: inverters, isLoading } = useSWR<Inverter[] | null>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL_GET}/inverters`,
    {
      revalidateIfStale: true,
    }
  );

  const { data: statistics } = useSWR<Inverter[] | null>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL_GET}/statistics`,
    {
      revalidateIfStale: true,
    }
  );

  console.table(statistics);

  return (
    <>
      <h1 className="text-white">Account</h1>
      {query.linkSuccess && (
        <p className="text-white">
          Linking status success: {query.linkSuccess}
        </p>
      )}
      {isLoading ? (
        <p className="text-white">Loading...</p>
      ) : (
        <AccountInfo inverters={inverters} />
      )}
    </>
  );
};

export const getServerSideProps = withSites();

export default Account;
