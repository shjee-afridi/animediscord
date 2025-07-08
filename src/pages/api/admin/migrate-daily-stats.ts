import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { isAdmin } from '@/lib/isAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !isAdmin(session.user)) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const client = await clientPromise;
  const db = client.db('discord');
  
  const servers = db.collection('servers');
  const serverStats = db.collection('server_stats');
  const dailyStats = db.collection('server_daily_stats');

  try {
    // Get all servers with existing stats
    const serversWithStats = await servers.find({}).toArray();
    const statsData = await serverStats.find({}).toArray();
    
    const migratedServers = [];

    for (const server of serversWithStats) {
      const stats = statsData.find(s => s.guildId === server.guildId);
      if (!stats) continue;

      // Generate sample daily data for the last 30 days
      const dailyEntries = [];
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Distribute total stats across the 30 days with some randomness
        const totalVisits = stats.visit || 0;
        const totalCopies = stats.copy || 0;
        const totalJoins = stats.join || 0;
        const totalBumps = stats.bump || 0;
        
        // Generate random daily distribution (more recent days get more activity)
        const dayWeight = Math.max(0.1, 1 - (i / 30)); // Recent days get higher weight
        const randomFactor = Math.random() * 0.5 + 0.75; // 0.75 to 1.25 multiplier
        
        const dailyVisits = Math.floor((totalVisits / 30) * dayWeight * randomFactor);
        const dailyCopies = Math.floor((totalCopies / 30) * dayWeight * randomFactor);
        const dailyJoins = Math.floor((totalJoins / 30) * dayWeight * randomFactor);
        const dailyBumps = Math.floor((totalBumps / 30) * dayWeight * randomFactor);
        
        if (dailyVisits > 0 || dailyCopies > 0 || dailyJoins > 0 || dailyBumps > 0) {
          dailyEntries.push({
            guildId: server.guildId,
            date: dateStr,
            visit: dailyVisits,
            copy: dailyCopies,
            join: dailyJoins,
            bump: dailyBumps,
            rating: Math.random() > 0.8 ? Math.floor(Math.random() * 3) : 0, // Occasional ratings
            lastUpdated: date
          });
        }
      }
      
      if (dailyEntries.length > 0) {
        // Insert daily entries (using upsert to avoid duplicates)
        for (const entry of dailyEntries) {
          await dailyStats.updateOne(
            { guildId: entry.guildId, date: entry.date },
            { $set: entry },
            { upsert: true }
          );
        }
        migratedServers.push(server.guildId);
      }
    }

    res.status(200).json({ 
      success: true, 
      message: `Migrated daily stats for ${migratedServers.length} servers`,
      migratedServers: migratedServers.slice(0, 10) // Show first 10 as sample
    });
  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({ error: 'Migration failed' });
  }
}
