import addSiteLocation from '../../content/help/addSiteLocation.md';
import helpTopic2 from '../../content/help/addSiteLocation.md';
import helpTopic3 from '../../content/help/addSiteLocation.md';
import helpTopic4 from '../../content/help/addSiteLocation.md';
import { withSites } from '~/lib/utils';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { LinkProps } from 'next/link';

const pages: any = {
  'add-site-location': addSiteLocation,
  'help-topic-2': helpTopic2,
  'help-topic-3': helpTopic3,
  'help-topic-4': helpTopic4,
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
          className={`px-4 py-2 flex items-center rounded-md text-gray-600 hover:text-gray-700 transition-colors transform`}
        >
          <span className={`mx-4 font-medium flex-1 align-center ${textColor}`}>
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
    <div className="flex flex-row">
      <div className="flex flex-col">
        {Object.keys(pages).map((page) => {
          return (
            <MenuLink
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
      <div className="bg-ocf-black w-screen min-h-screen max-w-screen-lg px-4">
        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => (
              <h1
                className="font-semibold text-2xl text-ocf-yellow pb-2.5"
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                className="font-semibold text-xl text-ocf-yellow pt-5 pb-2.5"
                {...props}
              />
            ),
            p: ({ node, ...props }) => (
              <p className="text-xl text-white pb-1.5" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul
                className="list-disc text-xl text-white pb-1.5 pl-10"
                {...props}
              />
            ),
            ol: ({ node, ...props }) => (
              <ol
                className="list-decimal text-xl text-white pb-1.5 pl-6"
                {...props}
              />
            ),
          }}
        >
          {page ? pages[page as string] : ''}
        </ReactMarkdown>
      </div>
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
    return { props: { siteList: context.siteList } };
  },
});
