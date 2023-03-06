import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import { withPageAuthRequired } from '~/lib/auth';
import { getInverters, Inverter, testClientID } from '~/lib/enode';

type Props = {
  inverters: Inverter[];
};

const AccountInfo: FC<Props> = ({ inverters }) => {
  return (
    <>
      <h2 className="text-white">Info</h2>
      {inverters.map((inverter, i) => (
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

const Account: NextPage<Props> = ({ inverters }) => {
  const { query, replace } = useRouter();

  // To add later after this is a toast...
  //   useEffect(() => {
  //     if (query.linkSuccess) {
  //       replace('/account');
  //     }
  //   }, []);

  return (
    <>
      <h1 className="text-white">Account</h1>
      {query.linkSuccess && (
        <p className="text-white">
          Linking status success: {query.linkSuccess}
        </p>
      )}
      {inverters.length > 0 ? (
        <AccountInfo inverters={inverters} />
      ) : (
        <Link href="/api/enode/link">
          <a className="text-white">Link account</a>
        </Link>
      )}
    </>
  );
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps() {
    const inverters = await getInverters(testClientID);

    return {
      props: {
        inverters,
      },
    };
  },
});

export default Account;
