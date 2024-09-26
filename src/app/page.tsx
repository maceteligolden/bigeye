import SiteCard from "@/components/site-card";
import { sites } from "@/constants/sites";
import Site from "@/interfaces/sites";

export default function Home() {
  return (
    <>
      <section className={'flex flex-col lg:grid lg:grid-cols-3 gap-4 p-5 bg-slate-300y'}>
        {
          sites.map((site: Site, index: number)=> {
            return <SiteCard key={index} site_name={site.name} site_url={site.url}/>
          })
        }
        
      </section>
    </>
  );
}
