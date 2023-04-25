import content from '../content/help/addSiteLocation.md';
import { withSites } from '~/lib/utils';
import ReactMarkdown from 'react-markdown';

const Help = () => {
  console.log(content);
  return (
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
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default Help;

export const getServerSideProps = withSites();
