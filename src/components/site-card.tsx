'use client';

import React, { useState, useEffect } from 'react';
import { LoaderIcon, OfflineIcon, OnlineIcon } from './icons';

interface SiteCardProps {
  site_name: string;
  site_url: string;
  pipeline_name?: string; // New prop for pipeline name
}

const SiteCard: React.FC<SiteCardProps> = ({ site_name, site_url }) => {
 

  return (
    <>
      <div className="w-full flex flex-col gap-3 p-4 bg-greylight text-white rounded-lg shadow-sm">
        <div>
          <strong>{site_name}</strong>
        </div>
        <HealthChecker site_url={site_url}/>
      </div>
    </>
  );
};

const HealthChecker = ({site_url}: {site_url: string}) => {
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
      <div className={`font-bold flex flex-row items-center gap-2 ${status === 'Online' ? 'text-green-600' : (status === 'Offline' ? 'text-red-600' : 'text-grey-600')}`}>
          { status === "Offline" &&
            <OfflineIcon/>
          }
          {
            status === "Online" && 
            <OnlineIcon/>
          }
          {
            status === "Checking..." && 
            <LoaderIcon/>
          }
          {status}
      </div>
    </>
  )
}

export default SiteCard;
