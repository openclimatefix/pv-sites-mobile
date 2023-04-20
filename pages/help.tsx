import content from '../content/help/addSiteLocation.md';
import { withSites } from '~/lib/utils';
import ReactMarkdown from 'react-markdown';

const Help = () => {
  console.log(content);
  return (
    <div className="bg-ocf-black w-screen min-h-screen max-w-screen-lg px-4">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default Help;

export const getServerSideProps = withSites();
