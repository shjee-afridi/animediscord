import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface DiscordWidgetProps {
  serverId: string;
  theme?: 'dark' | 'light';
  serverOwnerId?: string; // Add server owner ID to check admin permissions
}

export default function DiscordWidget({ serverId, theme = 'dark', serverOwnerId }: DiscordWidgetProps) {
  const { data: session } = useSession();
  const [widgetStatus, setWidgetStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check if current user is the server admin
  const isServerAdmin = session?.user?.id === serverOwnerId;

  const testWidget = useCallback(async (showRefreshingState = false) => {
    if (showRefreshingState) {
      setIsRefreshing(true);
    } else {
      setWidgetStatus('loading');
    }
    
    try {
      // Add cache-busting parameter to prevent cached responses
      const response = await fetch(`https://discord.com/api/guilds/${serverId}/widget.json?t=${Date.now()}`, {
        cache: 'no-store' // Ensure fresh request
      });
      
      if (!response.ok) {
        if (response.status === 403) {
          setErrorMessage('Widget is disabled for this server. Server admin needs to enable it in Discord server settings under Server Settings → Widget.');
        } else {
          setErrorMessage('Widget is not available');
        }
        setWidgetStatus('error');
      } else {
        setWidgetStatus('loaded');
        setErrorMessage('');
      }
    } catch (error) {
      setErrorMessage('Failed to load widget');
      setWidgetStatus('error');
    } finally {
      setIsRefreshing(false);
    }
  }, [serverId]);

  // Initial check when component loads (no auto-retry)
  useEffect(() => {
    testWidget();
  }, [testWidget]);

  const handleManualRefresh = () => {
    testWidget(true); // Show refreshing state
  };

  if (widgetStatus === 'loading') {
    return (
      <div className="my-6">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-white">Discord Widget</h3>
          <p className="text-sm text-gray-400">Loading server preview...</p>
        </div>
        <div className="w-full h-80 bg-gray-800 rounded-xl border border-neutral-800 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-400">Loading widget...</p>
          </div>
        </div>
      </div>
    );
  }

  if (widgetStatus === 'error') {
    return (
      <div className="my-6">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Discord Widget</h3>
            <p className="text-sm text-gray-400">Server preview unavailable</p>
          </div>
          {isServerAdmin && (
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
              title="Only server admins can refresh the widget"
            >
              <svg 
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isRefreshing ? 'Checking...' : 'Refresh'}
            </button>
          )}
        </div>
        <div className="w-full h-80 bg-gray-800 rounded-xl border border-neutral-700 flex items-center justify-center">
          <div className="text-center px-6">
            <div className="text-yellow-500 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-white font-medium mb-1">Widget Not Available</p>
            <p className="text-gray-400 text-sm mb-3">{errorMessage}</p>
            <div className="text-gray-500 text-xs">
              <p className="mb-2">
                The server owner needs to enable Discord Widget in:<br />
                <span className="font-mono bg-gray-700 px-2 py-1 rounded">Server Settings → Widget</span>
              </p>
              {!isServerAdmin && (
                <p className="text-gray-600 mt-2">
                  Only server admins can manually refresh the widget status
                </p>
              )}
              {isServerAdmin && (
                <p className="text-blue-400 mt-2">
                  After enabling the widget in Discord, click &quot;Refresh&quot; above
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-6">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Discord Widget</h3>
          <p className="text-sm text-gray-400">Live server preview</p>
        </div>
        {isServerAdmin && (
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
            title="Only server admins can refresh the widget"
          >
            <svg 
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        )}
      </div>
      <iframe
        src={`https://discord.com/widget?id=${serverId}&theme=${theme}`}
        width="100%"
        height="320"
        allowTransparency={true}
        frameBorder="0"
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        title="Discord Widget"
        className="rounded-xl border border-neutral-800 shadow"
        key={`widget-${serverId}-${Date.now()}`} // Force reload on refresh
      />
    </div>
  );
}
