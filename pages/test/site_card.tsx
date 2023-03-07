import SiteCard from '~/components/SiteCard';

export default function Home() {
  return (
    <div className="h-full w-full flex flex-col gap-3 items-center px-5">
      <SiteCard />
      <SiteCard />
      <SiteCard />
      <SiteCard />
    </div>
  );
}
