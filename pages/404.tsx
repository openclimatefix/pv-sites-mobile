import Link from 'next/link';
import SpaceIcon from '~/lib/components/icons/SpaceIcon';

const Page404 = () => {
  return (
    <div className="mt-10 flex flex-col items-center md:flex-row">
      <div className="mt-16 h-[175px] w-[225px] md:mt-32 md:h-[500px] md:w-[600px] md:flex-1">
        <SpaceIcon />
      </div>
      <div className="mt-8 md:mt-0 md:w-full md:flex-1">
        <h1 className="text-center text-7xl font-bold text-amber md:text-8xl">
          404
        </h1>
        <h1 className="mt-5 w-full text-center text-xl font-semibold text-amber md:text-2xl">
          Oops! Page not found.
        </h1>
        <div className="mt-8 flex h-1/2 w-full flex-col items-center">
          <Link href="/dashboard">
            <button className="h-14 w-full rounded-md bg-ocf-yellow px-14 text-center text-sm font-bold shadow dark:bg-ocf-yellow md:px-8">
              Return to Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page404;

Page404.hideNav = true;
