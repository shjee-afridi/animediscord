// src/components/Navbar.tsx
'use client';
import { useState } from 'react';
import { usePWAInstall, useNotificationPrompt } from './PWAInstallPrompt';
import Link from 'next/link';
import Image from 'next/image';
import { FaBars, FaHome, FaUser, FaThLarge, FaDiscord, FaBell, FaBellSlash, FaGlobe, FaTimes } from 'react-icons/fa';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showNotifDisableDialog, setShowNotifDisableDialog] = useState(false);
  const [showUninstallDialog, setShowUninstallDialog] = useState(false);
  const [showSafariInstallDialog, setShowSafariInstallDialog] = useState(false);
  const { showPrompt, handleInstall, deferredPrompt, isInstalled, installUnavailableReason } = usePWAInstall();
  const { notifStatus, notifMessage, handleEnableNotifications } = useNotificationPrompt();

  // Get user's browser info
  const getBrowserInfo = () => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return 'other';
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) return 'chrome';
    if (userAgent.includes('Firefox')) return 'firefox';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'safari';
    if (userAgent.includes('Edg')) return 'edge';
    return 'other';
  };

  const getBrowserSteps = () => {
    const browser = getBrowserInfo();
    switch (browser) {
      case 'chrome':
        return [
          'Click the lock icon 🔒 in the address bar',
          'Select "Site settings" or "Permissions"',
          'Find "Notifications" and select "Block"',
          'Refresh the page for changes to take effect'
        ];
      case 'firefox':
        return [
          'Click the shield icon 🛡️ in the address bar',
          'Click on "Permissions" tab',
          'Find "Receive Notifications" and select "Block"',
          'Refresh the page for changes to take effect'
        ];
      case 'safari':
        return [
          'Go to Safari menu > Preferences',
          'Click on "Websites" tab',
          'Select "Notifications" from the sidebar',
          'Find this website and change to "Deny"'
        ];
      case 'edge':
        return [
          'Click the lock icon 🔒 in the address bar',
          'Select "Permissions for this site"',
          'Find "Notifications" and select "Block"',
          'Refresh the page for changes to take effect'
        ];
      default:
        return [
          'Look for a lock or settings icon in your address bar',
          'Find site permissions or settings',
          'Locate notifications permissions',
          'Change from "Allow" to "Block" or "Deny"'
        ];
    }
  };

  const getBrowserName = () => {
    const browser = getBrowserInfo();
    switch (browser) {
      case 'chrome': return 'Chrome';
      case 'firefox': return 'Firefox';
      case 'safari': return 'Safari';
      case 'edge': return 'Edge';
      default: return 'your browser';
    }
  };

  // Updated handler for disabling notifications
  const handleDisableNotifications = () => {
    setShowNotifDisableDialog(true);
  };

  // Handler for uninstall button
  const handleUninstall = () => {
    setShowUninstallDialog(true);
  };

  // Handler for Safari install button
  const handleSafariInstall = () => {
    setShowSafariInstallDialog(true);
  };

  // Check if we're on Safari without deferredPrompt support
  const isSafariWithoutPrompt = () => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
    const browser = getBrowserInfo();
    return browser === 'safari' && !deferredPrompt && !isInstalled;
  };

  // Get Safari install steps
  const getSafariInstallSteps = () => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return ['Please access this from a Safari browser to see installation instructions'];
    }
    
    const userAgent = navigator.userAgent;
    const isMobile = /iPhone|iPad|iPod/i.test(userAgent);
    
    if (isMobile) {
      return [
        'Tap the Share button (📤) at the bottom of Safari',
        'Scroll down and tap "Add to Home Screen"',
        'Edit the name if desired, then tap "Add"',
        'The app will appear on your home screen'
      ];
    } else {
      // macOS Safari
      const safariVersion = navigator.userAgent.match(/Version\/(\d+)/)?.[1];
      const version = safariVersion ? parseInt(safariVersion) : 14;
      
      if (version >= 17) {
        return [
          'Click the Share button (📤) in Safari\'s toolbar',
          'Select "Add to Dock" from the menu',
          'The app will be added to your Dock and Applications folder',
          'You can now launch it like any other app'
        ];
      } else if (version >= 16) {
        return [
          'Go to File menu in Safari',
          'Select "Add to Dock"',
          'The app will be added to your Dock and Applications folder',
          'You can now launch it like any other app'
        ];
      } else {
        return [
          'Click the Share button (📤) in Safari\'s toolbar',
          'Select "Add to Home Screen" (works on macOS too)',
          'The app will be installed on your system',
          'Find it in your Applications folder'
        ];
      }
    }
  };

  // Get uninstall steps based on platform
  const getUninstallSteps = () => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return ['Please access this from a browser to see uninstall instructions'];
    }
    
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    
    // Mobile platforms
    if (/Android/i.test(userAgent)) {
      return [
        'Find the AnimeDiscord app icon on your home screen',
        'Long press the app icon',
        'Select "Uninstall" or drag to the uninstall area',
        'Confirm the uninstall when prompted'
      ];
    }
    
    if (/iPhone|iPad|iPod/i.test(userAgent)) {
      return [
        'Find the AnimeDiscord app icon on your home screen',
        'Long press the app icon until it jiggles',
        'Tap the "X" that appears on the app icon',
        'Confirm "Delete" when prompted'
      ];
    }
    
    // Desktop platforms
    if (/Win/i.test(platform)) {
      const browser = getBrowserInfo();
      if (browser === 'chrome' || browser === 'edge') {
        return [
          'Open Chrome/Edge and go to chrome://apps/ or edge://apps/',
          'Find the AnimeDiscord app',
          'Right-click on the app icon',
          'Select "Remove from Chrome/Edge" or "Uninstall"'
        ];
      }
      return [
        'Go to Windows Settings > Apps',
        'Search for "AnimeDiscord"',
        'Click on the app and select "Uninstall"',
        'Confirm the uninstall'
      ];
    }
    
    if (/Mac/i.test(platform)) {
      return [
        'Open Finder and go to Applications folder',
        'Find the AnimeDiscord app',
        'Drag it to the Trash',
        'Empty the Trash to complete removal'
      ];
    }
    
    // Generic instructions
    return [
      'Look for the AnimeDiscord app icon',
      'Right-click or long press the icon',
      'Select "Uninstall" or "Remove"',
      'Confirm when prompted'
    ];
  };
  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 py-2 border-b border-white/10 bg-neutral-900 text-white"
      style={{ boxShadow: 'none' }}
    >
      {/* Left: Logo and name */}
      <Link href="/" className="flex items-center gap-2 flex-1 group" onClick={() => setOpen(false)}>
        <Image src="/icon-48x48.png" alt="Logo" width={32} height={32} className="h-8 w-8 rounded group-hover:opacity-80 transition" />
        <span className="font-bold text-lg tracking-wide ml-2 group-hover:text-blue-300 transition">AnimeDiscord</span>
      </Link>
      {/* Right: Desktop nav (Home, Profile, Dashboard, Support, Install App, Notifications) */}
      <div className="hidden md:flex gap-6 items-center">
        <Link href="/" className="flex items-center gap-1 hover:text-blue-200 transition"><FaHome /> Home</Link>
        <Link href="/profile" className="flex items-center gap-1 hover:text-blue-200 transition"><FaUser /> Profile</Link>
        <Link href="/dashboard" className="flex items-center gap-1 hover:text-blue-200 transition"><FaThLarge /> Dashboard</Link>
        <a href="https://discord.gg/35CXp4rFC2" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-200 transition"><FaDiscord /> Support</a>
        {/* <a href="https://www.hentaidiscord.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-200 transition text-blue-300"><FaGlobe /> HentaiDiscord</a> */}
        <button
          onClick={isInstalled ? handleUninstall : (isSafariWithoutPrompt() ? handleSafariInstall : handleInstall)}
          className={`flex items-center gap-1 px-3 py-1 ${isInstalled ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded transition${(!deferredPrompt && !isInstalled && !isSafariWithoutPrompt()) ? ' opacity-50 cursor-not-allowed' : ''}`}
          disabled={!deferredPrompt && !isInstalled && !isSafariWithoutPrompt()}
          title={(!deferredPrompt && !isInstalled && !isSafariWithoutPrompt()) && installUnavailableReason ? installUnavailableReason : undefined}
        >
          <span>{isInstalled ? 'Uninstall App' : 'Install App'}</span>
        </button>
        {notifStatus !== 'granted' ? (
          <button
            onClick={handleEnableNotifications}
            className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            <FaBell /> Enable Notifications
          </button>
        ) : (
          <button
            onClick={handleDisableNotifications}
            className="flex items-center gap-1 px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            <FaBellSlash /> Disable Notifications
          </button>
        )}
        {notifMessage && (
          <span className="ml-2 text-sm text-white bg-green-700 px-2 py-1 rounded">{notifMessage}</span>
        )}
      </div>
      {/* Hamburger icon for mobile */}
      <div className="flex items-center ml-auto">
        <button
          className="md:hidden p-2 focus:outline-none"
          onClick={() => setOpen(!open)}
          aria-label="Open menu"
        >
          <FaBars size={24} />
        </button>
      </div>
      {/* Mobile sidebar (slide in from right) */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-colors duration-300 ${open ? 'bg-black/40 pointer-events-auto' : 'bg-transparent pointer-events-none'}`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      >
        <div
          className={`absolute top-0 right-0 w-64 h-full bg-red-600 text-white shadow-lg flex flex-col p-6 gap-4 transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <Link href="/" className="flex items-center gap-2 py-2 hover:text-white/80" onClick={() => setOpen(false)}><FaHome /> Home</Link>
          <Link href="/profile" className="flex items-center gap-2 py-2 hover:text-white/80" onClick={() => setOpen(false)}><FaUser /> Profile</Link>
          <Link href="/dashboard" className="flex items-center gap-2 py-2 hover:text-white/80" onClick={() => setOpen(false)}><FaThLarge /> Dashboard</Link>
          <a href="https://discord.gg/35CXp4rFC2" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-2 hover:text-white/80"><FaDiscord /> Support</a>
          <button
            onClick={() => { (isInstalled ? handleUninstall : (isSafariWithoutPrompt() ? handleSafariInstall : handleInstall))(); setOpen(false); }}
            className={`flex items-center gap-2 py-2 px-3 ${isInstalled ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded transition mt-2${(!deferredPrompt && !isInstalled && !isSafariWithoutPrompt()) ? ' opacity-50 cursor-not-allowed' : ''}`}
            disabled={!deferredPrompt && !isInstalled && !isSafariWithoutPrompt()}
          >
            <span>{isInstalled ? 'Uninstall App' : 'Install App'}</span>
          </button>
          {notifStatus !== 'granted' ? (
            <button
              onClick={() => { handleEnableNotifications(); setOpen(false); }}
              className="flex items-center gap-2 py-2 px-3 bg-green-600 text-white rounded hover:bg-green-700 transition mt-2"
            >
              <FaBell /> Enable Notifications
            </button>
          ) : (
            <button
              onClick={() => { handleDisableNotifications(); setOpen(false); }}
              className="flex items-center gap-2 py-2 px-3 bg-gray-600 text-white rounded hover:bg-gray-700 transition mt-2"
            >
              <FaBellSlash /> Disable Notifications
            </button>
          )}
          {notifMessage && (
            <span className="text-sm text-white bg-green-700 px-2 py-1 rounded mt-2">{notifMessage}</span>
          )}
        </div>
      </div>

      {/* Notification Disable Dialog */}
      {showNotifDisableDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-xl p-6 max-w-md w-full animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FaBellSlash className="text-gray-400" />
                Disable Notifications
              </h2>
              <button
                onClick={() => setShowNotifDisableDialog(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <p className="text-gray-300 mb-4 text-sm">
              To disable notifications for AnimeDiscord in <span className="font-semibold text-blue-300">{getBrowserName()}</span>, 
              please follow these steps:
            </p>
            
            <ol className="text-gray-300 text-sm space-y-2 mb-6">
              {getBrowserSteps().map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowNotifDisableDialog(false)}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Uninstall App Dialog */}
      {showUninstallDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-xl p-6 max-w-md w-full animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-red-400">🗑️</span>
                Uninstall App
              </h2>
              <button
                onClick={() => setShowUninstallDialog(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <p className="text-gray-300 mb-4 text-sm">
              To uninstall the AnimeDiscord app from your device, please follow these steps:
            </p>
            
            <ol className="text-gray-300 text-sm space-y-2 mb-6">
              {getUninstallSteps().map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            
            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3 mb-4">
              <p className="text-yellow-300 text-xs">
                <strong>Note:</strong> You can always reinstall the app later by visiting this website and clicking &ldquo;Install App&rdquo;
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowUninstallDialog(false)}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Safari Install Dialog */}
      {showSafariInstallDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-xl p-6 max-w-md w-full animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-blue-400">🧭</span>
                Install App - Safari
              </h2>
              <button
                onClick={() => setShowSafariInstallDialog(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <p className="text-gray-300 mb-4 text-sm">
              To install the AnimeDiscord app in Safari, please follow these steps:
            </p>
            
            <ol className="text-gray-300 text-sm space-y-2 mb-6">
              {getSafariInstallSteps().map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            
            <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-3 mb-4">
              <p className="text-blue-300 text-xs">
                <strong>Safari Tip:</strong> Once installed, the app will work like a native application with its own window and dock icon!
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowSafariInstallDialog(false)}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
