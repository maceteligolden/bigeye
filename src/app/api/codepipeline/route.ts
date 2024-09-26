// // app/api/pipeline/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { CodePipelineClient, GetPipelineStateCommand } from "@aws-sdk/client-codepipeline";

// // Set up the AWS client with your region
// const client = new CodePipelineClient({ 
//     region: 'us-east-1',
// });

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const pipelineName = searchParams.get('pipelineName');

//   if (!pipelineName) {
//     return NextResponse.json({ error: 'Pipeline name is required' }, { status: 400 });
//   }

//   try {
//     // Fetch the pipeline state
//     const command = new GetPipelineStateCommand({ name: "productionReporePipeline" });
//     const data = await client.send(command);

//     // Extract the status of the latest pipeline execution
//     const stages = data.stageStates?.map(stage => ({
//       name: stage.stageName,
//       status: stage.actionStates?.[0].latestExecution?.status,
//     }));

//     return NextResponse.json({ stages });
//   } catch (error) {
//     console.error('Error fetching pipeline status:', error);
//     return NextResponse.json({ error: 'Failed to fetch pipeline status' }, { status: 500 });
//   }
  
// }
