import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { Inverter } from '~/lib/enode';
import { withSites } from '~/lib/utils';
import useSWR from 'swr';

type Props = {
  inverters?: Inverter[];
};

const AccountInfo: FC<Props> = ({ inverters }) => {
  return (
    <>
      <h2 className="text-white">Info</h2>
      {inverters?.map((inverter, i) => (
        <p key={i} className="text-white">
          Inverter ID: {inverter.id}, rate:{' '}
          {inverter.productionState.productionRate}
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

  const { data: inverters } = useSWR<Inverter[]>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/inverters`,
    {
      revalidateIfStale: true,
    }
  );

  return (
    <>
      <h1 className="text-white">Account</h1>
      {query.linkSuccess && (
        <p className="text-white">
          Linking status success: {query.linkSuccess}
        </p>
      )}
      {inverters?.length ? (
        <AccountInfo inverters={inverters} />
      ) : (
        <Link href="/api/enode/link">
          <a className="text-white">Link account</a>
        </Link>
      )}
    </>
  );
};

export const getServerSideProps = withSites();

export default Account;
