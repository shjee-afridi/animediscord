import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { rateLimit } from '@/lib/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!rateLimit(req, res, { windowMs: 60_000, max: 30 })) return;
  
  const { guildId } = req.query;
  if (!guildId) return res.status(400).json({ error: 'Missing guildId' });

  const client = await clientPromise;
  const db = client.db('discord');
  const dailyStats = db.collection('server_daily_stats');

  if (req.method === 'POST') {
    const { type } = req.body;
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Create or update daily stats
    await dailyStats.updateOne(
      { 
        guildId: guildId.toString(),
        date: dateStr 
      },
      { 
        $inc: { [type]: 1 },
        $set: { lastUpdated: today }
      },
      { upsert: true }
    );
    
    return res.status(200).json({ success: true });
  }

  if (req.method === 'GET') {
    const { days = 30 } = req.query;
    const daysCount = parseInt(days as string);
    
    // Get daily stats for the last N days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysCount);
    const startDateStr = startDate.toISOString().split('T')[0];
    
    const stats = await dailyStats.find({
      guildId: guildId.toString(),
      date: { $gte: startDateStr }
    }).sort({ date: 1 }).toArray();
    
    // Fill in missing days with zeros
    const dailyData = [];
    for (let i = daysCount - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const existingData = stats.find(s => s.date === dateStr);
      dailyData.push({
        date: dateStr,
        visit: existingData?.visit || 0,
        copy: existingData?.copy || 0,
        join: existingData?.join || 0,
        bump: existingData?.bump || 0,
        rating: existingData?.rating || 0
      });
    }
    
    return res.status(200).json(dailyData);
  }

  res.setHeader('Allow', ['POST', 'GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
