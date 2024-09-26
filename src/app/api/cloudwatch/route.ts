// app/api/cloudwatch/log-streams/route.ts

import { NextResponse } from 'next/server';
import { CloudWatchLogsClient, DescribeLogStreamsCommand } from '@aws-sdk/client-cloudwatch-logs';

// Initialize CloudWatch Logs client
const cloudwatchLogsClient = new CloudWatchLogsClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const logGroupName = searchParams.get('logGroupName');

  // Validate the required parameter
  if (!logGroupName) {
    return NextResponse.json(
      { error: 'Missing logGroupName parameter' },
      { status: 400 }
    );
  }

  try {
    const params = {
      logGroupName,
      orderBy: 'LastEventTime', // Sort streams by the most recent event time
      descending: true, // Fetch the newest first
      limit: 50, // Limit the number of streams returned
    };

    const command = new DescribeLogStreamsCommand(params);
    const data = await cloudwatchLogsClient.send(command);

    // Return the log streams as the response
    return NextResponse.json(data.logStreams);
  } catch (error) {
    console.error('Error fetching log streams:', error);
    return NextResponse.json({ error: 'Failed to fetch log streams' }, { status: 500 });
  }
}
