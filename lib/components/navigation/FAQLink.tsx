import Link from 'next/link';

type HelpCenterLinkProps = {
  title: string;
  href: string;
};

const HelpCenterLink: React.FC<HelpCenterLinkProps> = ({ title, href }) => {
  return (
    <Link
      href={href}
      className="my-5 flex h-fit justify-center rounded-lg border-[2px] border-ocf-black-500 bg-ocf-black-500 p-5 text-center hover:border-ocf-yellow md:text-left"
    >
      <div className="justify-center">
        <div className="text-base font-semibold leading-none text-ocf-gray">
          {title}
        </div>
      </div>
    </Link>
  );
};

export default HelpCenterLink;
