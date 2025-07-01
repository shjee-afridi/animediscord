import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import ClientProviders from '@/components/ClientProviders';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import Navbar from '@/components/Navbar';
import BootstrapClient from '@/components/BootstrapClient';

export const metadata = {
  metadataBase: new URL('https://www.animediscord.com'),
  title: 'Anime Discord',
  description: 'Discover and share Discord servers!',
  manifest: '/manifest.json',
  icons: [
    { rel: 'icon', url: '/favicon.ico' },
    { rel: 'icon', url: '/icon-192x192.png', sizes: '192x192' },
    { rel: 'icon', url: '/icon-512x512.png', sizes: '512x512' },
    { rel: 'icon', url: "/icon-48x48.png", sizes: "48x48" },
    { rel: 'icon', url: "/icon-72x72.png", sizes: "72x72" },
    { rel: 'icon', url: "/icon-96x96.png", sizes: "96x96" },
    { rel: 'icon', url: "/icon-128x128.png", sizes: "128x128" },
    { rel: 'icon', url: "/icon-256x256.png", sizes: "256x256" },
  ],
  openGraph: {
    title: 'Anime Discord',
    description: 'Discover and share Discord servers!',
    url: 'https://animediscord.com',
    siteName: 'Anime Discord',
    images: [
      {
        url: '/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'Anime Discord Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Anime Discord',
    description: 'Discover and share Discord servers!',
    images: ['/icon-512x512.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Inline critical CSS for above-the-fold rendering */}
        <style>{`
          :root {
            --foreground-rgb: 0, 0, 0;
            --background-start-rgb: 214, 219, 220;
            --background-end-rgb: 255, 255, 255;
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --foreground-rgb: 255, 255, 255;
              --background-start-rgb: 0, 0, 0;
              --background-end-rgb: 0, 0, 0;
            }
          }
          body {
            color: rgb(var(--foreground-rgb));
            background: linear-gradient(
              to bottom,
              transparent,
              rgb(var(--background-end-rgb))
            ) rgb(var(--background-start-rgb));
          }
        `}</style>
        <meta name="theme-color" content="#000000" />
        {/* SEO Optimized Meta Tags */}
        <meta name="description" content="Find the top Anime Discord servers with active SFW anime communities, roleplay, and exclusive content. Join the best 18+ anime chatrooms today!" />
        <meta name="keywords" content="Anime Discord, SFW Anime Discord, Best Anime Server, 18+ Anime Community, Anime Roleplay, Adult Anime Chat, Exclusive Anime Content, Discord SFW, Top Anime Server, Anime Chatroom, Anime Discord List, SFW Discord List, Discord Server Directory, Anime Community, Adult Discord, Discord for Adults, Discord for Anime, Discord Roleplay, Discord 18+, Discord Servers 2025, Trending Discord Servers, Popular Discord Servers, Anime Social, Anime Friends, Anime Dating, Anime Chat, Anime Forums, Anime Groups, Discord Invite, Discord Join, Discord Safe, Discord Verified, Discord Active, Discord Events, Discord Giveaways, Discord Bots, Discord Moderation, Discord Rules, Discord FAQ, Discord Support, Discord Help, Discord Community, Discord Network, Discord Platform, Discord Social, Discord Online, Discord Members, Discord Channels, Discord Categories, Discord Movie, Discord Gaming, Discord Music, Discord Study, Discord Meme, Discord Art, Discord Tech, Discord Programming, Discord Kpop, Discord Sports, Discord Book, Discord Language, Discord LGBTQ, Discord Furry, Discord Minecraft, Discord Valorant, Discord Genshin Impact, Discord Roblox, Discord Among Us, Discord Fortnite, Discord League of Legends, Discord Overwatch, Discord Call of Duty, Discord Aesthetic, Discord Chill, Discord Community, Discord Active, Discord New, Discord Big, Discord Small, Discord International, Discord English, Discord Hindi, Discord Spanish, Discord French, Discord German, Discord Russian, Discord Japanese, Discord Korean, Discord Chinese, sdwd, random, join any Discord server, find Discord server, search Discord server, best Discord server, top Discord server, discord server for everything, discord server for anything, discord server for everyone, discord server for you, discord server for all, discord server for fun, discord server for chat, discord server for games, discord server for anime, discord server for movies, discord server for music, discord server for study, discord server for memes, discord server for art, discord server for tech, discord server for programming, discord server for kpop, discord server for sports, discord server for books, discord server for language, discord server for lgbtq, discord server for furry, discord server for minecraft, discord server for valorant, discord server for genshin impact, discord server for roblox, discord server for among us, discord server for fortnite, discord server for league of legends, discord server for overwatch, discord server for call of duty, discord server for aesthetic, discord server for chill, discord server for community, discord server for active, discord server for new, discord server for big, discord server for small, discord server for international, discord server for english, discord server for hindi, discord server for spanish, discord server for french, discord server for german, discord server for russian, discord server for japanese, discord server for korean, discord server for chinese, discord server for sdwd, discord server for random" />
        <link rel="canonical" href="https://animediscord.com" />
        <link rel="preconnect" href="https://discord.com" />
        <link rel="dns-prefetch" href="https://discord.com" />
        {/* Canonical and preconnect/dns-prefetch added for SEO and performance */}
        {/* Open Graph Meta Tags (For Discord, Facebook, etc.) */}
        <meta property="og:title" content="Best Anime Discord Server - Join Top SFW Anime Communities" />
        <meta property="og:description" content="Join the best Anime Discord servers with thousands of active members, anime roleplay, and SFW discussions!" />
        <meta property="og:image" content="https://animediscord.com/embed-image.avif" />
        <meta property="og:url" content="https://animediscord.com" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Anime Discord" />

        {/*Twitter Card Meta Tags (For Twitter Embed) */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Best Anime Discord Server - Join Top SFW Anime Communities" />
        <meta name="twitter:description" content="Explore top Anime Discord servers with exclusive 18+ anime content and a thriving anime community!" />
        <meta name="twitter:image" content="%PUBLIC_URL%/embed-image.avif" />
        <meta name="twitter:url" content="https://animediscord.com" />
        
        {/* Structured Data: WebSite and BreadcrumbList for enhanced SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `{
              "@context": "https://schema.org",
              "@type": "WebSite",
              "url": "https://animediscord.com",
              "name": "Anime Discord",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://animediscord.com/search/{search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `{
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://animediscord.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Servers",
                  "item": "https://animediscord.com/servers"
                }
              ]
            }`,
          }}
        />
        <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: `{
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Anime Discord",
      "url": "https://animediscord.com",
      "description": "Find the best Anime Discord server with active SFW anime communities, roleplay content.",
      "logo": "https://animediscord.com/icon-512x512.png",
      "sameAs": [
        "https://discord.com/invite/35CXp4rFC2"
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.5",
        "reviewCount": "500",
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Discord Community Member"
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5",
            "worstRating": "1"
          },
          "reviewBody": "Excellent directory for finding Discord servers with active communities!"
        }
      ]
    }`,
  }}
/>        <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: `{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the best Anime Discord server?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best Anime Discord server are those with active SFW anime communities, engaging discussions, and exclusive adult content."
          }
        },
        {
          "@type": "Question",
          "name": "How do I join a Anime Discord server?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can join a Anime Discord server by clicking an invite link on our site and following the verification steps."
          }
        }
      ]
    }`,
  }}
/>
        <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: `{
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Anime Discord - Best SFW Anime Discord Servers",
      "description": "Discover the top Anime Discord servers with active SFW anime communities, roleplay, and exclusive content.",
      "url": "https://animediscord.com",
      "mainEntity": {
        "@type": "ItemList",
        "name": "Discord Server Directory",
        "description": "A curated list of the best Anime and anime Discord servers with user reviews and ratings",
        "numberOfItems": "1000+",
        "itemListElement": []
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://animediscord.com/search/{search_term_string}",
        "query-input": "required name=search_term_string"
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://animediscord.com"
          }
        ]
      }
    }`,
  }}
/>
        <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: `{
      "@context": "https://schema.org",
      "@type": "ImageObject",
      "name": "Anime Discord Logo",
      "description": "Official logo and branding for Anime Discord server directory",
      "url": "https://animediscord.com/icon-512x512.png",
      "width": 512,
      "height": 512,
      "encodingFormat": "image/png",
      "contentUrl": "https://animediscord.com/icon-512x512.png",
      "creator": {
        "@type": "Organization",
        "name": "Anime Discord"
      },
      "license": "https://animediscord.com/terms",
      "acquireLicensePage": "https://animediscord.com/terms",
      "creditText": "Anime Discord - Discord Server Directory",
      "copyrightNotice": "© 2025 Anime Discord. All rights reserved."
    }`,
  }}
/>
        <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: `{
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Anime Discord Server Directory",
      "description": "Discover and review Discord servers in our comprehensive directory featuring SFW anime communities",
      "url": "https://animediscord.com",
      "brand": {
        "@type": "Brand",
        "name": "Anime Discord"
      },
      "category": "Software > Communication > Directory Service",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "url": "https://animediscord.com"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.5",
        "reviewCount": "500",
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Discord User"
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5",
            "worstRating": "1"
          },
          "reviewBody": "Excellent directory for finding active Discord servers with great communities!"
        }
      ]
    }`,
  }}
/>
      </head>
      <body className="pt-14"> {/* Add padding to prevent content under navbar */}
        <BootstrapClient />
        <Navbar />
        <ClientProviders>
          <PWAInstallPrompt />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}