import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import ClientProviders from '@/components/ClientProviders';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import Navbar from '@/components/Navbar';
import BootstrapClient from '@/components/BootstrapClient';

export const metadata = {
  metadataBase: new URL('https://www.animediscord.com'),
  title: {
    default: 'Anime Discord - Best Discord Server Directory & Community Hub',
    template: '%s | Anime Discord'
  },
  description: 'Discover the best Discord servers! Browse anime, gaming, SFW communities and more. Join thousands of active Discord servers. Promote your server for free and grow your community.',
  keywords: [
    'discord servers', 'best discord servers', 'discord server list', 'discord directory',
    'anime discord', 'gaming discord', 'discord communities', 'join discord servers',
    'promote discord server', 'discord server promotion', 'server directory',
    'find discord servers', 'discord server finder', 'server list', 'discord hub'
  ],
  authors: [{ name: 'Anime Discord Team' }],
  creator: 'Anime Discord',
  publisher: 'Anime Discord',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
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
    { rel: 'apple-touch-icon', url: '/icon-192x192.png' },
  ],
  openGraph: {
    title: 'Anime Discord - Best Discord Server Directory & Community Hub',
    description: 'Discover the best Discord servers! Browse anime, gaming, SFW communities and more. Join thousands of active Discord servers.',
    url: 'https://www.animediscord.com',
    siteName: 'Anime Discord',
    images: [
      {
        url: '/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'Anime Discord - Discord Server Directory',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anime Discord - Best Discord Server Directory & Community Hub',
    description: 'Discover the best Discord servers! Browse anime, gaming, SFW communities and more. Join thousands of active Discord servers.',
    images: ['/icon-512x512.png'],
    creator: '@animediscord',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    other: {
      'msvalidate.01': 'your-bing-verification-code',
    },
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
        <meta name="keywords" content="promote server, promote discord server, discord server promotion, advertise discord server, advertise server, bump discord server, bump server, list discord server, list server, discord server list, server list, discord server directory, server directory, discord directory, find discord server, search discord server, discover discord server, join discord server, discord server finder, server finder, discord server search, server search, discord server advertising, server advertising, discord promotion, server promotion, discord marketing, server marketing, discord growth, server growth, discord boost, server boost, discord visibility, server visibility, discord exposure, server exposure, discord traffic, server traffic, discord members, server members, discord community, server community, discord engagement, server engagement, Anime Discord, sfw Anime Discord, Best Anime Server, 18+ Anime Community, Anime Roleplay, Adult Anime Chat, Exclusive Anime Content, Discord sfw, Top Anime Server, Anime Chatroom, Anime Discord List, sfw Discord List, Discord Server Directory, Anime Community, Adult Discord, Discord for Adults, Discord for Anime, Discord Roleplay, Discord 18+, Discord Servers 2025, Trending Discord Servers, Popular Discord Servers, Featured Discord Servers, New Discord Servers, Active Discord Servers, Growing Discord Servers, Public Discord Servers, Open Discord Servers, Free Discord Servers, Best Discord Servers, Top Discord Servers, Discord Server Hub, Discord Server Center, Discord Server Portal, Discord Server Platform, Discord Server Network, Discord Server Database, Discord Server Registry, Discord Server Index, Discord Server Catalog, Discord Server Collection, Discord Server Gallery, Discord Server Showcase, Discord Server Listings, Discord Server Reviews, Discord Server Ratings, Discord Server Rankings, Discord Server Stats, Discord Server Analytics, Discord Server Metrics, Discord Server Data, Discord Server Info, Discord Server Details, Discord Server Description, Discord Server Features, Discord Server Benefits, Discord Server Advantages, Discord Server Perks, Discord Server Rewards, Discord Server Incentives, Discord Server Bonuses, Discord Server Offers, Discord Server Deals, Discord Server Discounts, Discord Server Promotions, Discord Server Campaigns, Discord Server Events, Discord Server Activities, Discord Server Games, Discord Server Contests, Discord Server Competitions, Discord Server Tournaments, Discord Server Challenges, Discord Server Tasks, Discord Server Missions, Discord Server Quests, Discord Server Adventures, Discord Server Experiences, Discord Server Entertainment, Discord Server Fun, Discord Server Enjoyment, Discord Server Pleasure, Discord Server Satisfaction, Discord Server Happiness, Discord Server Joy, Discord Server Excitement, Discord Server Thrill, Discord Server Adventure, Discord Server Experience, Discord Server Journey, Discord Server Discovery, Discord Server Exploration, Discord Server Investigation, Discord Server Research, Discord Server Study, Discord Server Analysis, Discord Server Examination, Discord Server Review, Discord Server Evaluation, Discord Server Assessment, Discord Server Inspection, Discord Server Observation, Discord Server Monitoring, Discord Server Tracking, Discord Server Following, Discord Server Watching, Discord Server Viewing, Discord Server Browsing, Discord Server Surfing, Discord Server Navigating, Discord Server Exploring, Discord Server Discovering, Discord Server Finding, Discord Server Locating, Discord Server Identifying, Discord Server Recognizing, Discord Server Spotting, Discord Server Detecting, Discord Server Uncovering, Discord Server Revealing, Discord Server Exposing, Discord Server Showing, Discord Server Displaying, Discord Server Presenting, Discord Server Featuring, Discord Server Highlighting, Discord Server Emphasizing, Discord Server Focusing, Discord Server Concentrating, Discord Server Centering, Discord Server Targeting, Discord Server Aiming, Discord Server Directing, Discord Server Guiding, Discord Server Leading, Discord Server Pointing, Discord Server Indicating, Discord Server Suggesting, Discord Server Recommending, Discord Server Proposing, Discord Server Offering, Discord Server Providing, Discord Server Supplying, Discord Server Delivering, Discord Server Serving, Discord Server Catering, Discord Server Accommodating, Discord Server Facilitating, Discord Server Enabling, Discord Server Supporting, Discord Server Assisting, Discord Server Helping, Discord Server Aiding, Discord Server Contributing, Discord Server Participating, Discord Server Engaging, Discord Server Involving, Discord Server Including, Discord Server Incorporating, Discord Server Integrating, Discord Server Combining, Discord Server Merging, Discord Server Joining, Discord Server Connecting, Discord Server Linking, Discord Server Associating, Discord Server Relating, Discord Server Corresponding, Discord Server Matching, Discord Server Pairing, Discord Server Coupling, Discord Server Binding, Discord Server Tying, Discord Server Attaching, Discord Server Fastening, Discord Server Securing, Discord Server Fixing, Discord Server Establishing, Discord Server Creating, Discord Server Building, Discord Server Developing, Discord Server Constructing, Discord Server Forming, Discord Server Making, Discord Server Producing, Discord Server Generating, Discord Server Originating, Discord Server Initiating, Discord Server Starting, Discord Server Beginning, Discord Server Launching, Discord Server Opening, Discord Server Introducing, Discord Server Presenting, Discord Server Unveiling, Discord Server Revealing, Discord Server Disclosing, Discord Server Announcing, Discord Server Declaring, Discord Server Proclaiming, Discord Server Publishing, Discord Server Broadcasting, Discord Server Transmitting, Discord Server Communicating, Discord Server Sharing, Discord Server Spreading, Discord Server Distributing, Discord Server Circulating, Discord Server Disseminating, Discord Server Propagating, Discord Server Promoting, Discord Server Marketing, Discord Server Advertising, Discord Server Publicizing, Discord Server Popularizing, Discord Server Endorsing, Discord Server Recommending, Discord Server Suggesting, Discord Server Proposing, Discord Server Advocating, Discord Server Supporting, Discord Server Backing, Discord Server Championing, Discord Server Defending, Discord Server Upholding, Discord Server Maintaining, Discord Server Sustaining, Discord Server Preserving, Discord Server Protecting, Discord Server Safeguarding, Discord Server Securing, Discord Server Ensuring, Discord Server Guaranteeing, Discord Server Assuring, Discord Server Confirming, Discord Server Verifying, Discord Server Validating, Discord Server Authenticating, Discord Server Certifying, Discord Server Approving, Discord Server Authorizing, Discord Server Permitting, Discord Server Allowing, Discord Server Enabling, Discord Server Facilitating, Discord Server Encouraging, Discord Server Motivating, Discord Server Inspiring, Discord Server Stimulating, Discord Server Energizing, Discord Server Activating, Discord Server Triggering, Discord Server Initiating, Discord Server Sparking, Discord Server Igniting, Discord Server Kindling, Discord Server Lighting, Discord Server Illuminating, Discord Server Brightening, Discord Server Enhancing, Discord Server Improving, Discord Server Upgrading, Discord Server Advancing, Discord Server Progressing, Discord Server Developing, Discord Server Evolving, Discord Server Growing, Discord Server Expanding, Discord Server Increasing, Discord Server Boosting, Discord Server Amplifying, Discord Server Magnifying, Discord Server Intensifying, Discord Server Strengthening, Discord Server Reinforcing, Discord Server Solidifying, Discord Server Consolidating, Discord Server Stabilizing, Discord Server Balancing, Discord Server Harmonizing, Discord Server Synchronizing, Discord Server Coordinating, Discord Server Organizing, Discord Server Arranging, Discord Server Structuring, Discord Server Ordering, Discord Server Sorting, Discord Server Categorizing, Discord Server Classifying, Discord Server Grouping, Discord Server Clustering, Discord Server Collecting, Discord Server Gathering, Discord Server Assembling, Discord Server Compiling, Discord Server Accumulating, Discord Server Aggregating, Discord Server Combining, Discord Server Merging, Discord Server Uniting, Discord Server Integrating, Discord Server Blending, Discord Server Mixing, Discord Server Fusing, Discord Server Joining, Discord Server Connecting, Discord Server Linking, Discord Server Bridging, Discord Server Spanning, Discord Server Crossing, Discord Server Traversing, Discord Server Navigating, Discord Server Exploring, Discord Server Discovering, Discord Server Uncovering, Discord Server Revealing, Discord Server Exposing, Discord Server Showing, Discord Server Demonstrating, Discord Server Exhibiting, Discord Server Displaying, Discord Server Presenting, Discord Server Featuring, Discord Server Showcasing, Discord Server Highlighting, Discord Server Emphasizing, Discord Server Stressing, Discord Server Underlining, Discord Server Accentuating, Discord Server Focusing, Discord Server Concentrating, Discord Server Centering, Discord Server Targeting, Discord Server Aiming, Discord Server Directing, Discord Server Orienting, Discord Server Positioning, Discord Server Placing, Discord Server Locating, Discord Server Situating, Discord Server Establishing, Discord Server Setting, Discord Server Installing, Discord Server Implementing, Discord Server Executing, Discord Server Performing, Discord Server Operating, Discord Server Running, Discord Server Functioning, Discord Server Working, Discord Server Acting, Discord Server Behaving, Discord Server Conducting, Discord Server Managing, Discord Server Administering, Discord Server Controlling, Discord Server Governing, Discord Server Regulating, Discord Server Supervising, Discord Server Overseeing, Discord Server Monitoring, Discord Server Observing, Discord Server Watching, Discord Server Tracking, Discord Server Following, Discord Server Pursuing, Discord Server Chasing, Discord Server Hunting, Discord Server Seeking, Discord Server Searching, Discord Server Looking, Discord Server Finding, Discord Server Locating, Discord Server Discovering, Discord Server Detecting, Discord Server Identifying, Discord Server Recognizing, Discord Server Acknowledging, Discord Server Accepting, Discord Server Embracing, Discord Server Welcoming, Discord Server Greeting, Discord Server Receiving, Discord Server Hosting, Discord Server Accommodating, Discord Server Entertaining, Discord Server Engaging, Discord Server Interacting, Discord Server Communicating, Discord Server Conversing, Discord Server Discussing, Discord Server Talking, Discord Server Speaking, Discord Server Expressing, Discord Server Articulating, Discord Server Voicing, Discord Server Stating, Discord Server Declaring, Discord Server Announcing, Discord Server Proclaiming, Discord Server Broadcasting, Discord Server Transmitting, Discord Server Sending, Discord Server Delivering, Discord Server Providing, Discord Server Offering, Discord Server Supplying, Discord Server Giving, Discord Server Granting, Discord Server Bestowing, Discord Server Awarding, Discord Server Presenting, Discord Server Gifting, Discord Server Donating, Discord Server Contributing, Discord Server Sharing, Discord Server Distributing, Discord Server Spreading, Discord Server Circulating, Discord Server Disseminating, Discord Server Propagating, Discord Server Extending, Discord Server Reaching, Discord Server Stretching, Discord Server Expanding, Discord Server Broadening, Discord Server Widening, Discord Server Enlarging, Discord Server Increasing, Discord Server Growing, Discord Server Developing, Discord Server Advancing, Discord Server Progressing, Discord Server Improving, Discord Server Enhancing, Discord Server Upgrading, Discord Server Modernizing, Discord Server Updating, Discord Server Refreshing, Discord Server Renewing, Discord Server Revitalizing, Discord Server Rejuvenating, Discord Server Restoring, Discord Server Rebuilding, Discord Server Reconstructing, Discord Server Redesigning, Discord Server Remodeling, Discord Server Renovating, Discord Server Refurbishing, Discord Server Overhauling, Discord Server Transforming, Discord Server Converting, Discord Server Changing, Discord Server Modifying, Discord Server Altering, Discord Server Adjusting, Discord Server Adapting, Discord Server Customizing, Discord Server Personalizing, Discord Server Tailoring, Discord Server Specializing, Discord Server Focusing, Discord Server Concentrating, Discord Server Dedicating, Discord Server Committing, Discord Server Devoting, Discord Server Investing, Discord Server Spending, Discord Server Utilizing, Discord Server Using, Discord Server Employing, Discord Server Applying, Discord Server Implementing, Discord Server Executing, Discord Server Performing, Discord Server Conducting, Discord Server Carrying, Discord Server Bearing, Discord Server Supporting, Discord Server Holding, Discord Server Maintaining, Discord Server Keeping, Discord Server Preserving, Discord Server Protecting, Discord Server Defending, Discord Server Guarding, Discord Server Shielding, Discord Server Covering, Discord Server Wrapping, Discord Server Enclosing, Discord Server Surrounding, Discord Server Encompassing, Discord Server Including, Discord Server Containing, Discord Server Holding, Discord Server Housing, Discord Server Accommodating, Discord Server Hosting, Discord Server Sheltering, Discord Server Harboring, Discord Server Providing, Discord Server Offering, Discord Server Supplying, Discord Server Delivering, Discord Server Serving, Discord Server Catering, Discord Server Fulfilling, Discord Server Satisfying, Discord Server Meeting, Discord Server Addressing, Discord Server Handling, Discord Server Dealing, Discord Server Managing, Discord Server Processing, Discord Server Treating, Discord Server Approaching, Discord Server Tackling, Discord Server Solving, Discord Server Resolving, Discord Server Settling, Discord Server Fixing, Discord Server Repairing, Discord Server Correcting, Discord Server Adjusting, Discord Server Tuning, Discord Server Calibrating, Discord Server Optimizing, Discord Server Maximizing, Discord Server Minimizing, Discord Server Balancing, Discord Server Stabilizing, Discord Server Normalizing, Discord Server Standardizing, Discord Server Regularizing, Discord Server Systematizing, Discord Server Organizing, Discord Server Structuring, Discord Server Arranging, Discord Server Ordering, Discord Server Sequencing, Discord Server Prioritizing, Discord Server Ranking, Discord Server Rating, Discord Server Scoring, Discord Server Evaluating, Discord Server Assessing, Discord Server Judging, Discord Server Reviewing, Discord Server Examining, Discord Server Inspecting, Discord Server Checking, Discord Server Testing, Discord Server Verifying, Discord Server Validating, Discord Server Confirming, Discord Server Ensuring, Discord Server Guaranteeing, Discord Server Securing, Discord Server Protecting, Discord Server Safeguarding, anime discord, anime server, anime community, anime chat, anime social, anime friends, anime dating, anime roleplay, anime forum, anime group, anime network, anime platform, anime hub, anime center, anime portal, anime directory, anime list, anime database, anime registry, anime index, anime catalog, anime collection, anime gallery, anime showcase, anime listings, anime reviews, anime ratings, anime rankings, anime stats, anime analytics, anime metrics, anime data, anime info, anime details, anime description, anime features, anime benefits, anime advantages, anime perks, anime rewards, anime incentives, anime bonuses, anime offers, anime deals, anime discounts, anime promotions, anime campaigns, anime events, anime activities, anime games, anime contests, anime competitions, anime tournaments, anime challenges, anime tasks, anime missions, anime quests, anime adventures, anime experiences, anime entertainment, anime fun, anime enjoyment, anime pleasure, anime satisfaction, anime happiness, anime joy, anime excitement, anime thrill, sfw discord, sfw server, sfw community, sfw chat, sfw social, sfw friends, sfw dating, sfw roleplay, sfw forum, sfw group, sfw network, sfw platform, sfw hub, sfw center, sfw portal, sfw directory, sfw list, sfw database, sfw registry, sfw index, sfw catalog, sfw collection, sfw gallery, sfw showcase, sfw listings, sfw reviews, sfw ratings, sfw rankings, sfw stats, sfw analytics, sfw metrics, sfw data, sfw info, sfw details, sfw description, sfw features, sfw benefits, sfw advantages, sfw perks, sfw rewards, sfw incentives, sfw bonuses, sfw offers, sfw deals, sfw discounts, sfw promotions, sfw campaigns, sfw events, sfw activities, sfw games, sfw contests, sfw competitions, sfw tournaments, sfw challenges, sfw tasks, sfw missions, sfw quests, sfw adventures, sfw experiences, sfw entertainment, sfw fun, sfw enjoyment, sfw pleasure, sfw satisfaction, sfw happiness, sfw joy, sfw excitement, sfw thrill, 18+ discord, 18+ server, 18+ community, 18+ chat, 18+ social, 18+ friends, 18+ dating, 18+ roleplay, 18+ forum, 18+ group, 18+ network, 18+ platform, 18+ hub, 18+ center, 18+ portal, 18+ directory, 18+ list, 18+ database, 18+ registry, 18+ index, 18+ catalog, 18+ collection, 18+ gallery, 18+ showcase, 18+ listings, 18+ reviews, 18+ ratings, 18+ rankings, 18+ stats, 18+ analytics, 18+ metrics, 18+ data, 18+ info, 18+ details, 18+ description, 18+ features, 18+ benefits, 18+ advantages, 18+ perks, 18+ rewards, 18+ incentives, 18+ bonuses, 18+ offers, 18+ deals, 18+ discounts, 18+ promotions, 18+ campaigns, 18+ events, 18+ activities, 18+ games, 18+ contests, 18+ competitions, 18+ tournaments, 18+ challenges, 18+ tasks, 18+ missions, 18+ quests, 18+ adventures, 18+ experiences, 18+ entertainment, 18+ fun, 18+ enjoyment, 18+ pleasure, 18+ satisfaction, 18+ happiness, 18+ joy, 18+ excitement, 18+ thrill, adult discord, adult server, adult community, adult chat, adult social, adult friends, adult dating, adult roleplay, adult forum, adult group, adult network, adult platform, adult hub, adult center, adult portal, adult directory, adult list, adult database, adult registry, adult index, adult catalog, adult collection, adult gallery, adult showcase, adult listings, adult reviews, adult ratings, adult rankings, adult stats, adult analytics, adult metrics, adult data, adult info, adult details, adult description, adult features, adult benefits, adult advantages, adult perks, adult rewards, adult incentives, adult bonuses, adult offers, adult deals, adult discounts, adult promotions, adult campaigns, adult events, adult activities, adult games, adult contests, adult competitions, adult tournaments, adult challenges, adult tasks, adult missions, adult quests, adult adventures, adult experiences, adult entertainment, adult fun, adult enjoyment, adult pleasure, adult satisfaction, adult happiness, adult joy, adult excitement, adult thrill" />
        <link rel="preconnect" href="https://discord.com" />
        <link rel="dns-prefetch" href="https://discord.com" />
        {/* Canonical and preconnect/dns-prefetch added for SEO and performance */}
        {/* Open Graph Meta Tags (For Discord, Facebook, etc.) */}
        <meta property="og:title" content="Best Anime Discord Server - Join Top SFW Anime Communities" />
        <meta property="og:description" content="Join the best Anime Discord servers with thousands of active members, anime roleplay, and SFW discussions!" />
        <meta property="og:image" content="https://www.animediscord.com/embed-image.avif" />
        <meta property="og:url" content="https://www.animediscord.com" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Anime Discord" />

        {/*Twitter Card Meta Tags (For Twitter Embed) */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Best Anime Discord Server - Join Top SFW Anime Communities" />
        <meta name="twitter:description" content="Explore top Anime Discord servers with exclusive 18+ anime content and a thriving anime community!" />
        <meta name="twitter:image" content="%PUBLIC_URL%/embed-image.avif" />
        <meta name="twitter:url" content="https://www.animediscord.com" />
        
        {/* Structured Data: WebSite and BreadcrumbList for enhanced SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `{
              "@context": "https://schema.org",
              "@type": "WebSite",
              "url": "https://www.animediscord.com",
              "name": "Anime Discord",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.animediscord.com/search/{search_term_string}",
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
                  "item": "https://www.animediscord.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Servers",
                  "item": "https://www.animediscord.com/servers"
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
      "url": "https://www.animediscord.com",
      "description": "Find the best Anime Discord server with active SFW anime communities, roleplay content.",
      "logo": "https://www.animediscord.com/icon-512x512.png",
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
      "url": "https://www.animediscord.com",
      "publisher": {
        "@type": "Organization",
        "name": "Anime Discord",
        "url": "https://www.animediscord.com"
      },
      "datePublished": "2024-01-01",
      "dateModified": "2025-07-01",
      "mainEntity": {
        "@type": "ItemList",
        "name": "Discord Server Directory",
        "description": "A curated list of the best Anime and anime Discord servers with user reviews and ratings",
        "numberOfItems": "1000+",
        "itemListElement": []
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.animediscord.com/search/{search_term_string}",
        "query-input": "required name=search_term_string"
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.animediscord.com"
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
      "url": "https://www.animediscord.com/icon-512x512.png",
      "width": 512,
      "height": 512,
      "encodingFormat": "image/png",
      "contentUrl": "https://www.animediscord.com/icon-512x512.png",
      "creator": {
        "@type": "Organization",
        "name": "Anime Discord"
      },
      "license": "https://www.animediscord.com/terms",
      "acquireLicensePage": "https://www.animediscord.com/terms",
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
      "url": "https://www.animediscord.com",
      "image": "https://www.animediscord.com/icon-512x512.png",
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
        "url": "https://www.animediscord.com",
        "priceValidUntil": "2025-12-31",
        "shippingDetails": {
          "@type": "OfferShippingDetails",
          "shippingRate": {
            "@type": "MonetaryAmount",
            "value": "0",
            "currency": "USD"
          },
          "shippingDestination": {
            "@type": "DefinedRegion",
            "addressCountry": "US"
          },
          "deliveryTime": {
            "@type": "ShippingDeliveryTime",
            "handlingTime": {
              "@type": "QuantitativeValue",
              "minValue": 0,
              "maxValue": 0,
              "unitCode": "DAY"
            },
            "transitTime": {
              "@type": "QuantitativeValue",
              "minValue": 0,
              "maxValue": 0,
              "unitCode": "DAY"
            }
          }
        }
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