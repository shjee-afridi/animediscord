// src/app/manage-servers/page.tsx
'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Spinner from '@/components/Spinner';
import { FaServer, FaExternalLinkAlt, FaInfoCircle, FaRobot } from 'react-icons/fa';
import { Metadata } from 'next';

// Note: Since this is a client component, we'll need to handle metadata differently
// We'll create a wrapper component to handle metadata properly

export default function ManageServersPage() {
  const { data: session, status } = useSession();
  const [guilds, setGuilds] = useState<any[]>([]);
  const [allListedServers, setAllListedServers] = useState<any[]>([]);
  const [serversLoading, setServersLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    fetch('/api/discord/guilds')
      .then(res => res.ok ? res.json() : [])
      .then(setGuilds);
  }, [session]);

  useEffect(() => {
    setServersLoading(true);
    fetch('/api/servers')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setAllListedServers(Array.isArray(data) ? data : data.servers || []);
        setServersLoading(false);
      });
  }, []);

  const userGuildIds = guilds.map((g: any) => g.id);
  const userServers = allListedServers.filter(server => userGuildIds.includes(server.guildId));

  if (session === undefined || status === 'loading') return <Spinner />;
  if (!session) return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-900 dark:to-black transition-colors pt-10 sm:pt-20">
      <div className="w-full max-w-md bg-gray-900/80 rounded-2xl shadow-xl p-4 sm:p-8 border border-gray-800 animate-fade-in text-center mx-auto mt-4 sm:mt-12 mb-8 sm:mb-0">
        <div className="mb-4">
          <FaServer className="text-6xl text-red-500 mx-auto mb-4" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-red-500">Access Restricted</h2>
        <p className="mb-6 text-zinc-400 text-sm sm:text-base">You must be logged in to access your dashboard and manage your Discord servers.</p>
        <a 
          href="/profile" 
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
        >
          <FaRobot className="text-lg" />
          Login with Discord
        </a>
      </div>
    </main>
  );

  return (
    <main className="flex flex-col items-center justify-center min-h-0 min-h-screen:sm p-2 sm:p-8 bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-900 dark:to-black transition-colors">
      <div className="w-full max-w-2xl bg-gray-900/80 rounded-2xl shadow-xl p-4 sm:p-8 border border-gray-800 animate-fade-in my-auto">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-3 text-white">
          <FaServer className="text-yellow-400" /> Your Submitted Servers
        </h1>
        {serversLoading ? (
          <Spinner />
        ) : userServers.length > 0 ? (
          <ul className="space-y-4">
            {userServers.map(server => (
              <li key={server.guildId} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-800 rounded-xl px-5 py-4 shadow hover:scale-[1.01] transition-transform border border-gray-700 gap-3 sm:gap-0">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <FaServer className="text-yellow-400 text-xl" />
                  <span className="font-semibold text-lg text-white break-words">{server.name}</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <a
                    href={`/server/${server.guildId}/details`}
                    className="flex items-center gap-1 px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full font-semibold transition text-sm shadow w-full sm:w-auto justify-center"
                  >
                    <FaInfoCircle /> Details
                  </a>
                  <a
                    href={`/server/${server.guildId}`}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition text-sm shadow w-full sm:w-auto justify-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaExternalLinkAlt /> View
                  </a>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center gap-4 py-8">
            <FaServer className="text-5xl text-gray-600" />
            <p className="text-gray-300 text-lg">You have not submitted any servers yet.</p>
            <a
              href="/add-server"
              className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold transition shadow flex items-center gap-2"
            >
              <FaServer /> Add a Server
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
