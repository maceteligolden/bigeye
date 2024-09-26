import Site from "@/interfaces/sites";

const sites: Site[] = [
    {
        name: "NewtonsLaw Test Server",
        url: 'https://test.api.newtonslaw.net/api/v1/healthcheck',
        pipeline_name: "productionReporePipeline"
    },
    {
        name: "Repore Test Server",
        url: 'https://staging.api.repore.promptcomputers.io/health_check',
        pipeline_name: "productionReporePipeline"
    },
    {
        name: "Repore Prod Server",
        url: 'https://prod.api.repore.promptcomputers.io/health_check',
        pipeline_name: "productionReporePipeline"
    },
    {
        name: "Whishe Server",
        url: 'https://geenee.onrender.com/health_check',
        pipeline_name: "productionReporePipeline"
    },
    {
        name: "Trootfindr Server",
        url: 'https://prod.api.trootfindr.com/health_check',
        pipeline_name: "productionReporePipeline"
    },
    {
        name: "Logistics Server",
        url: 'https://logistics-wv53.onrender.com/health_check',
        pipeline_name: "productionReporePipeline"
    },
    {
        name: "Oceanlifesafety Server",
        url: 'https://oceanlifeservice-5mje.onrender.com/health_check',
        pipeline_name: "productionReporePipeline"
    }
]

export {
    sites
}