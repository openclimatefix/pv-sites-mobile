import addSiteLocation from '../../content/help/addSiteLocation.md';
import { withSites } from '~/lib/sites';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { LinkProps } from 'next/link';

export const pages: any = {
  'add-site-location': addSiteLocation,
};

type MenuLinkProps = {
  linkProps: LinkProps;
  label: string;
  currentPath: string;
};

const MenuLink: React.FC<MenuLinkProps> = ({
  linkProps,
  label,
  currentPath,
}) => {
  const textColor =
    linkProps.href === currentPath ? 'text-amber' : 'text-white';
  return (
    <Link {...linkProps}>
      <a>
        <div
          className={`flex transform items-center rounded-md px-4 py-2 text-gray-600 transition-colors hover:text-gray-700`}
        >
          <span className={`align-center mx-4 flex-1 font-medium ${textColor}`}>
            {label}
          </span>
        </div>
      </a>
    </Link>
  );
};

const Help = () => {
  const router = useRouter();
  const { page } = router.query;
  return (
    <div className="flex w-full">
      <div className="flex flex-1">
        <div className="flex-1"></div>
        <div className="flex flex-col">
          {Object.keys(pages).map((page) => {
            return (
              <MenuLink
                key={page}
                linkProps={{ href: `/help/${page}` }}
                label={page
                  .split('-')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
                currentPath={router.asPath}
              />
            );
          })}
        </div>
      </div>
      <div className="min-h-screen w-screen max-w-screen-lg bg-ocf-black px-4">
        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => (
              <h1
                className="pb-2.5 text-2xl font-semibold text-ocf-yellow"
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                className="pb-2.5 pt-5 text-xl font-semibold text-ocf-yellow"
                {...props}
              />
            ),
            p: ({ node, ...props }) => (
              <p className="pb-1.5 text-xl text-white" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul
                className="list-disc pb-1.5 pl-10 text-xl text-white"
                {...props}
              />
            ),
            ol: ({ node, ...props }) => (
              <ol
                className="list-decimal pb-1.5 pl-6 text-xl text-white"
                {...props}
              />
            ),
          }}
        >
          {page ? pages[page as string] : ''}
        </ReactMarkdown>
      </div>
      <div className="flex-1"></div>
    </div>
  );
};

export default Help;

export const getServerSideProps = withSites({
  async getServerSideProps(context) {
    if (!((context.query.page as string) in pages)) {
      return {
        notFound: true,
      };
    }
    return { props: { siteList: context.sites } };
  },
});
