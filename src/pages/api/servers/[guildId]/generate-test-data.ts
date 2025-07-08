import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { guildId } = req.query;
  if (!guildId) return res.status(400).json({ error: 'Missing guildId' });

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const client = await clientPromise;
  const db = client.db('discord');
  
  try {
    // Check if user owns this server
    const server = await db.collection('servers').findOne({ 
      guildId: guildId.toString(),
      userId: session.user?.id 
    });
    
    if (!server) {
      return res.status(403).json({ error: 'You can only generate test data for servers you own' });
    }

    const dailyStats = db.collection('server_daily_stats');
    
    // Generate test data for the last 14 days
    const testEntries = [];
    
    for (let i = 13; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Generate realistic random data with trends
      const baseVisits = Math.floor(Math.random() * 20) + 5;
      const baseCopies = Math.floor(Math.random() * 5) + 1;
      const baseJoins = Math.floor(Math.random() * 8) + 2;
      const baseBumps = Math.floor(Math.random() * 3) + 1;
      const baseRatings = Math.random() > 0.7 ? Math.floor(Math.random() * 2) + 1 : 0;
      
      // Add some spike variations (weekend boost, random events)
      const dayOfWeek = date.getDay();
      const weekendBoost = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.5 : 1;
      const randomSpike = Math.random() > 0.8 ? Math.random() * 2 + 1 : 1;
      
      const visits = Math.floor(baseVisits * weekendBoost * randomSpike);
      const copies = Math.floor(baseCopies * weekendBoost * randomSpike);
      const joins = Math.floor(baseJoins * weekendBoost * randomSpike);
      const bumps = Math.floor(baseBumps * randomSpike);
      const ratings = Math.floor(baseRatings * randomSpike);
      
      testEntries.push({
        guildId: guildId.toString(),
        date: dateStr,
        visit: visits,
        copy: copies,
        join: joins,
        bump: bumps,
        rating: ratings,
        lastUpdated: date
      });
    }
    
    // Insert test data
    for (const entry of testEntries) {
      await dailyStats.updateOne(
        { guildId: entry.guildId, date: entry.date },
        { $set: entry },
        { upsert: true }
      );
    }

    res.status(200).json({ 
      success: true, 
      message: `Generated test data for ${testEntries.length} days`,
      preview: testEntries.slice(-3) // Show last 3 days as preview
    });
  } catch (error) {
    console.error('Test data generation error:', error);
    res.status(500).json({ error: 'Failed to generate test data' });
  }
}
