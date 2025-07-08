import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { guildId } = req.query;
  if (!guildId) return res.status(400).json({ error: 'Missing guildId' });

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const client = await clientPromise;
  const db = client.db('discord');
  
  try {
    // Get total stats
    const totalStats = await db.collection('server_stats').findOne({ guildId: guildId.toString() });
    
    // Get recent daily stats
    const dailyStats = await db.collection('server_daily_stats')
      .find({ guildId: guildId.toString() })
      .sort({ date: -1 })
      .limit(7)
      .toArray();
    
    // Get server info
    const server = await db.collection('servers').findOne({ guildId: guildId.toString() });
    
    res.status(200).json({
      server: server ? { guildId: server.guildId, name: server.name } : null,
      totalStats: totalStats || {},
      recentDailyStats: dailyStats,
      dailyStatsCount: await db.collection('server_daily_stats').countDocuments({ guildId: guildId.toString() })
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ error: 'Debug failed' });
  }
}
