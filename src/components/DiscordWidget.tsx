import React, { useState, useEffect, useCallback } from 'react';

interface DiscordWidgetProps {
  serverId: string;
  theme?: 'dark' | 'light';
  canRefresh?: boolean; // New prop to show refresh button for server owners/admins
  showDebug?: boolean; // New prop to show debug information for troubleshooting
}

export default function DiscordWidget({ serverId, theme = 'dark', canRefresh = false, showDebug = false }: DiscordWidgetProps) {
  const [widgetStatus, setWidgetStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const testWidget = useCallback(async (isRetry = false) => {
    try {
      const response = await fetch(`https://discord.com/api/guilds/${serverId}/widget.json`);
      if (!response.ok) {
        if (response.status === 403) {
          setErrorMessage('Widget is disabled or has insufficient permissions');
        } else if (response.status === 404) {
          setErrorMessage('Server not found or widget unavailable');
        } else {
          setErrorMessage(`Widget is not available (Error ${response.status})`);
        }
        setWidgetStatus('error');
        
        // Auto-retry for 403 errors (up to 3 times with delays)
        if (response.status === 403 && !isRetry && retryCount < 2) {
          setRetryCount(prev => prev + 1);
          setTimeout(() => {
            testWidget(true);
          }, (retryCount + 1) * 2000); // 2s, 4s delays
        }
      } else {
        setWidgetStatus('loaded');
        setRetryCount(0); // Reset retry count on success
      }
    } catch (error) {
      setErrorMessage('Failed to load widget');
      setWidgetStatus('error');
    }
  }, [serverId, retryCount]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setWidgetStatus('loading');
    setRetryCount(0); // Reset retry count on manual refresh
    await testWidget();
    setIsRefreshing(false);
  };

  useEffect(() => {
    testWidget();
  }, [testWidget]);

  if (widgetStatus === 'loading') {
    return (
      <div className="my-6">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-white">Discord Widget</h3>
          <p className="text-sm text-gray-400">Loading server preview...</p>
        </div>
        <div className="w-full bg-gray-800 rounded-xl border border-neutral-800 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-400 text-sm">Loading widget...</p>
            {retryCount > 0 && (
              <p className="text-xs text-yellow-400 mt-1">
                Retrying... (attempt {retryCount + 1}/3)
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (widgetStatus === 'error') {
    return (
      <div className="my-6">
        <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-white">Discord Widget</h3>
            <p className="text-sm text-gray-400">Server preview unavailable</p>
          </div>
          {canRefresh && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white text-sm rounded-lg transition-colors w-full sm:w-auto"
            >
              <svg 
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isRefreshing ? 'Checking...' : 'Refresh Widget'}
            </button>
          )}
        </div>
        <div className="w-full bg-gray-800 rounded-xl border border-neutral-700 p-4 sm:p-6">
          <div className="text-center max-w-md mx-auto">
            <div className="text-yellow-500 mb-3">
              <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-white font-medium mb-1 text-sm sm:text-base">Widget Not Available</p>
            <p className="text-gray-400 text-xs sm:text-sm mb-3">{errorMessage}</p>
            
            {showDebug && (
              <div className="bg-gray-900 border border-gray-600 rounded p-2 mb-3 text-left">
                <p className="font-semibold text-gray-300 mb-1 text-xs">Debug Information:</p>
                <p className="font-mono text-xs break-all">Server ID: {serverId}</p>
                <p className="font-mono text-xs break-all">Widget URL: https://discord.com/api/guilds/{serverId}/widget.json</p>
                <p className="font-mono text-xs">Retry Count: {retryCount}</p>
              </div>
            )}

            <div className="text-gray-500 text-xs space-y-2 text-left">
              <div>
                <p className="font-semibold text-gray-400 mb-1">To enable Discord Widget:</p>
                <div className="space-y-1">
                  <p>1. Go to your Discord server</p>
                  <p>2. Click <span className="font-mono bg-gray-700 px-1 rounded text-xs">Server Settings</span></p>
                  <p>3. Navigate to <span className="font-mono bg-gray-700 px-1 rounded text-xs">Widget</span></p>
                  <p>4. Toggle <span className="font-mono bg-gray-700 px-1 rounded text-xs">Enable Server Widget</span></p>
                  <p>5. Wait 2-3 minutes for Discord to update</p>
                </div>
              </div>
              <div className="border-t border-gray-600 pt-2">
                <p className="font-semibold text-gray-400 mb-1">Still not working?</p>
                <div className="space-y-1">
                  <p>• Ensure you have <span className="text-yellow-400">Administrator</span> permissions</p>
                  <p>• Try disabling and re-enabling the widget</p>
                  <p>• Discord widget can take up to 5 minutes to activate</p>
                  <p className="text-yellow-300 font-medium">• Even after enabling, changes can take 5-15 minutes to appear</p>
                </div>
              </div>
              
              {canRefresh && (
                <div className="border-t border-gray-600 pt-2">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-blue-400 hover:text-blue-300 text-xs underline mb-2 focus:outline-none"
                  >
                    {showAdvanced ? 'Hide' : 'Show'} Advanced Troubleshooting
                  </button>
                  
                  {showAdvanced && (
                    <div className="space-y-1 text-xs">
                      <p className="font-semibold text-gray-400">Advanced Steps:</p>
                      <p>• Check server member limit (widgets disabled on full servers)</p>
                      <p>• Verify server isn&apos;t in community mode with restrictions</p>
                      <p>• Try using server ID instead of vanity URL</p>
                      <p>• Wait 10-15 minutes after enabling (Discord cache)</p>
                      <p>• Test with a different Discord account</p>
                      <p className="mt-2 font-semibold text-gray-400">Timing Information:</p>
                      <p className="text-yellow-300">Discord widgets are notoriously slow to update. Even after enabling:</p>
                      <p>• Initial activation: 2-5 minutes</p>
                      <p>• Full propagation: 5-15 minutes</p>
                      <p>• Some servers may need multiple enable/disable cycles</p>
                      <p className="mt-2 font-semibold text-gray-400">Still having issues?</p>
                      <p>Discord widgets can be unreliable. Some servers may need to disable and re-enable the widget multiple times.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {canRefresh && (
              <div className="mt-3 p-2 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                <p className="text-blue-300 text-xs font-medium mb-1">
                  ⏱️ Please be patient after enabling the widget
                </p>
                <p className="text-blue-200 text-xs">
                  Discord widgets can take 5-15 minutes to show up even after being enabled. 
                  Click &ldquo;Refresh Widget&rdquo; above to check periodically.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-6">
      <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-white">Discord Widget</h3>
          <p className="text-sm text-gray-400">Live server preview</p>
        </div>
        {canRefresh && (
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:opacity-50 text-white text-sm rounded-lg transition-colors w-full sm:w-auto"
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
      />
    </div>
  );
}
