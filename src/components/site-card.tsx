'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';

interface SiteCardProps {
  site_name: string;
  site_url: string;
  pipeline_name?: string; // New prop for pipeline name
}

const SiteCard: React.FC<SiteCardProps> = ({ site_name, site_url }) => {
  const [status, setStatus] = useState('Checking...');

  // Function to check the health of the server
  const checkHealth = async () => {
    try {
      const response = await fetch(site_url);
      if (response.ok) {
        setStatus('Online');
      } else {
        setStatus('Offline');
      }
    } catch (error) {
      setStatus('Offline');
    }
  };

  // Function to check the pipeline status

  // useEffect to check health and deployment status
  useEffect(() => {
    checkHealth();
    //checkPipelineStatus();

    const healthInterval = setInterval(checkHealth, 60000); // 60 seconds
    //const deployInterval = setInterval(checkPipelineStatus, 60000); // 60 seconds

    return () => {
      clearInterval(healthInterval);
      // clearInterval(deployInterval);
    };
  }, []);

  return (
    <>
      <div className="flex flex-col gap-3 p-2 bg-white text-black border rounded-lg shadow-sm">
        <div>
          <strong>{site_name}</strong>
        </div>
        <div>
          <Link href={site_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {site_url}
          </Link>
        </div>
        <div className={`font-bold ${status === 'Online' ? 'text-green-600' : 'text-red-600'}`}>
          {status}
        </div>
      </div>
    </>
  );
};

export default SiteCard;
