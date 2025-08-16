import { useState, useEffect, useCallback } from 'react';

export type WidgetStatus = 'loading' | 'enabled' | 'disabled' | 'error';

interface UseWidgetStatusReturn {
  status: WidgetStatus;
  isChecking: boolean;
  checkWidgetStatus: () => Promise<void>;
  errorMessage: string;
}

export function useWidgetStatus(serverId: string | null): UseWidgetStatusReturn {
  const [status, setStatus] = useState<WidgetStatus>('loading');
  const [isChecking, setIsChecking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const checkWidgetStatus = useCallback(async () => {
    if (!serverId || serverId.trim() === '') {
      setStatus('loading');
      setErrorMessage('');
      return;
    }

    setIsChecking(true);
    
    try {
      const response = await fetch(`https://discord.com/api/guilds/${serverId}/widget.json?t=${Date.now()}`, {
        cache: 'no-store'
      });
      
      if (response.ok) {
        setStatus('enabled');
        setErrorMessage('');
      } else if (response.status === 403) {
        setStatus('disabled');
        setErrorMessage('Widget is disabled for this server');
      } else if (response.status === 404) {
        setStatus('error');
        setErrorMessage('Server not found or invalid server ID');
      } else {
        setStatus('error');
        setErrorMessage('Failed to check widget status');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Network error while checking widget');
    } finally {
      setIsChecking(false);
    }
  }, [serverId]);

  // Auto-check when serverId changes
  useEffect(() => {
    if (serverId && serverId.trim() !== '') {
      checkWidgetStatus();
    } else {
      setStatus('loading');
      setErrorMessage('');
    }
  }, [checkWidgetStatus, serverId]);

  return {
    status,
    isChecking,
    checkWidgetStatus,
    errorMessage
  };
}
