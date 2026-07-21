import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_DB = process.env.MONGODB_DB || 'blog';

let cachedDb: Db | null = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  cachedDb = client.db(MONGODB_DB);
  return cachedDb;
}

interface LikeDoc {
  slug: string;
  count: number;
  ips: string[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const slug = (req.query.slug as string) || '';

  // 无 slug 时返回状态页
  if (!slug) {
    let dbStatus = '未配置';
    if (MONGODB_URI) {
      try {
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        await client.db(MONGODB_DB).command({ ping: 1 });
        await client.close();
        dbStatus = 'MongoDB已连接';
      } catch {
        dbStatus = 'MongoDB连接失败';
      }
    } else {
      dbStatus = 'MongoDB未配置';
    }

    return res.status(200).json({
      status: 'running',
      service: 'blog-like-api',
      version: '1.0.0',
      message: '云函数正常运行',
      database: dbStatus,
      endpoints: {
        getLike: 'GET /api/like?slug=xxx',
        postLike: 'POST /api/like?slug=xxx'
      }
    });
  }

  const clientIp = req.headers['x-forwarded-for'] as string ||
                   req.headers['x-real-ip'] as string ||
                   req.socket.remoteAddress ||
                   '';

  try {
    const db = await connectToDatabase();
    const collection = db.collection<LikeDoc>('likes');

    if (req.method === 'GET') {
      const doc = await collection.findOne({ slug });
      return res.status(200).json({ count: doc?.count || 0, slug });
    }

    if (req.method === 'POST') {
      const existing = await collection.findOne({ slug });
      if (existing?.ips?.includes(clientIp)) {
        return res.status(200).json({ count: existing.count, slug, message: '已点赞' });
      }

      const result = await collection.findOneAndUpdate(
        { slug },
        {
          $inc: { count: 1 },
          $push: { ips: clientIp }
        },
        { upsert: true, returnDocument: 'after' }
      );

      return res.status(200).json({ count: result?.count || 1, slug });
    }

    return res.status(405).json({ error: '不支持的请求方法' });
  } catch (e) {
    console.error('MongoDB error:', e);
    return res.status(500).json({ error: '数据库错误', details: String(e) });
  }
}
