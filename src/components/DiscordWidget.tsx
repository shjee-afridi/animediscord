import React, { useState, useEffect } from 'react';

interface DiscordWidgetProps {
  serverId: string;
  theme?: 'dark' | 'light';
}

export default function DiscordWidget({ serverId, theme = 'dark' }: DiscordWidgetProps) {
  const [widgetStatus, setWidgetStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    // Test if widget is accessible
    const testWidget = async () => {
      try {
        const response = await fetch(`https://discord.com/api/guilds/${serverId}/widget.json`);
        if (!response.ok) {
          if (response.status === 403) {
            setErrorMessage('Widget is disabled for this server');
          } else {
            setErrorMessage('Widget is not available');
          }
          setWidgetStatus('error');
        } else {
          setWidgetStatus('loaded');
        }
      } catch (error) {
        setErrorMessage('Failed to load widget');
        setWidgetStatus('error');
      }
    };

    testWidget();
  }, [serverId]);

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
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-white">Discord Widget</h3>
          <p className="text-sm text-gray-400">Server preview unavailable</p>
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
            <p className="text-gray-500 text-xs">
              The server owner needs to enable Discord Widget in:<br />
              <span className="font-mono bg-gray-700 px-2 py-1 rounded">Server Settings → Widget</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-6">
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-white">Discord Widget</h3>
        <p className="text-sm text-gray-400">Live server preview</p>
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
      />
    </div>
  );
}
