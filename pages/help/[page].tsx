import addSiteLocation from '../../content/help/addSiteLocation.md';
import helpTopic2 from '../../content/help/addSiteLocation.md';
import helpTopic3 from '../../content/help/addSiteLocation.md';
import { withSites } from '~/lib/sites';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { LinkProps } from 'next/link';

export const pages = {
  'add-site-location': addSiteLocation,
  'help-topic-2': helpTopic2,
  'help-topic-3': helpTopic3,
} as const;

type MenuLinkProps = {
  linkProps: LinkProps;
  label: string;
  currentPath: string;
};

const urlToDisplay = (page: string) => {
  return page
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const MenuLink: React.FC<MenuLinkProps> = ({
  linkProps,
  label,
  currentPath,
}) => {
  const textColor =
    linkProps.href === currentPath ? 'text-amber' : 'text-white';
  return (
    <Link {...linkProps} passHref>
      <a>
        <div
          className={`flex transform items-center rounded-md px-4 py-2 text-gray-600 transition-colors hover:text-gray-700`}
        >
          <span className={`align-center mx-4 flex-1 font-medium ${textColor}`}>
            <ul
              className={`${linkProps.href === currentPath ? 'list-disc' : ''}`}
            >
              <li>{label}</li>
            </ul>
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
        <div className="hidden flex-1 md:block" />
        <div className="mt-6 flex hidden flex-col md:block">
          {Object.keys(pages).map((page) => {
            return (
              <MenuLink
                key={page}
                linkProps={{ href: `/help/${page}` }}
                label={urlToDisplay(page)}
                currentPath={router.asPath}
              />
            );
          })}
        </div>
      </div>
      <div className="min-h-screen w-screen max-w-screen-sm bg-ocf-black px-4">
        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => (
              <h1
                className="mt-7 pb-2.5 text-xl font-semibold text-ocf-yellow"
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                className="text-l pb-2.5 pt-5 font-semibold text-ocf-yellow"
                {...props}
              />
            ),
            p: ({ node, ...props }) => (
              <p className="text-l pb-1.5 text-white" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul
                className="text-l list-disc pb-1.5 pl-7 text-white"
                {...props}
              />
            ),
            ol: ({ node, ...props }) => (
              <ol
                className="text-l list-decimal pb-1.5 pl-4 text-white"
                {...props}
              />
            ),
          }}
        >
          {page ? pages[page as keyof typeof pages] : ''}
        </ReactMarkdown>
      </div>
      <div className="hidden flex-1 md:block" />
    </div>
  );
};

export default Help;

export const getServerSideProps = (context: {
  query: { page: string };
  sites: any;
}) => {
  if (!((context.query.page as string) in pages)) {
    return {
      notFound: true,
    };
  }
  return { props: { siteList: context.sites } };
};
