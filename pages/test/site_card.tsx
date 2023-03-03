import SiteCard from '~/components/SiteCard';

export default function Home() {
  return (
    <div className="h-full w-full flex flex-col gap-3">
      <SiteCard />
      <SiteCard />
      <SiteCard />
      <SiteCard />
    </div>
  );
}
