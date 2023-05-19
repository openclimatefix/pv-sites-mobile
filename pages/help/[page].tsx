import Link from 'next/link';
import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';
import { hyphensToTitleCase } from '~/lib/utils';
import addSiteLocation from '../../content/help/add-site-location.md';
import enterSiteDetails from '../../content/help/enter-site-details.md';
import handleSplitSites from '../../content/help/handle-split-sites.md';

export const pages = {
  'adding-site-locations': addSiteLocation,
  'entering-site-details': enterSiteDetails,
  'handling-split-sites': handleSplitSites,
} as const;

type MenuLinkProps = {
  href: string;
  label: string;
  currentPath: string;
};

const MenuLink: React.FC<MenuLinkProps> = ({ href, label, currentPath }) => {
  const textColor = href === currentPath ? 'text-amber' : 'text-white';
  return (
    <Link href={href}>
      <div
        className={`flex transform items-center rounded-md px-4 py-2 text-gray-600 transition-colors hover:text-gray-700`}
      >
        <span className={`align-center mx-4 flex-1 font-medium ${textColor}`}>
          <ul className={`${href === currentPath ? 'list-disc' : ''}`}>
            <li>{label}</li>
          </ul>
        </span>
      </div>
    </Link>
  );
};

const Help = () => {
  const router = useRouter();
  const { page } = router.query;
  return (
    <div className="mb-[var(--bottom-nav-margin)] flex w-full">
      <div className="flex flex-1">
        <div className="hidden flex-1 md:block" />
        <div className="mt-6 hidden flex-col md:block">
          {Object.keys(pages).map((page) => {
            return (
              <MenuLink
                key={page}
                href={`/help/${page}`}
                label={hyphensToTitleCase(page)}
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
