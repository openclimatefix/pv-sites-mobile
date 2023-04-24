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
            <div
              className="font-semibold text-2xl text-ocf-yellow"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <div className="font-semibold text-xl text-ocf-yellow" {...props} />
          ),
          p: ({ node, ...props }) => (
            <div className="text-xl text-white" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc text-xl text-white" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ul className="list-decimal text-xl text-white" {...props} />
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
