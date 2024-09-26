import SiteCard from "@/components/site-card";
import { sites } from "@/constants/sites";
import Site from "@/interfaces/sites";

export default function Home() {
  return (
    <>
      <div className={"p-6"}>
        <div className={"flex flex-row justify-between items-center"}>
          <h1 className={"text-lg"}>List of Sites</h1>
          
          <div>
            Add Site
          </div>
        </div>
        <section className={'bg-grey rounded flex flex-col gap-4 p-5 bg-slate-300y'}>
          {
            sites.map((site: Site, index: number)=> {
              return <SiteCard key={index} site_name={site.name} site_url={site.url}/>
            })
          }
          
        </section>
      </div>
    </>
  );
}
