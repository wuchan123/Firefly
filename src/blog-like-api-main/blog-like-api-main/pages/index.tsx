import type { NextPage } from 'next';

const Home: NextPage = () => {
  const now = new Date().toUTCString();

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>blog-like-api</h1>
      <p>云函数正常运行 ✓</p>
      <p>MongoDB 已连接 ✓</p>
      <p>当前版本：1.0.0</p>
      <p>当前运行环境：vercel</p>
      <p>当前时间：{now}</p>
      <p>内部端口：3000</p>
      <p>部署在大陆：否</p>
      <p>当前地址：<a href="/">http://blog-like-api.vercel.app/</a></p>
      <p>实际地址：<a href="/">https://blog-like-api.vercel.app/</a></p>
      <p>api地址：<a href="/api/like">https://blog-like-api.vercel.app/api/like</a></p>
    </div>
  );
};

export default Home;
