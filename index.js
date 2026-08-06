import express from 'express';
import fetch from 'node-fetch';
const app = express();
const port = process.env.PORT || 3000;

// 读取环境变量配置
const HOST = process.env.HOST;
const UUID = process.env.UUID;
const AUTH_KEY = process.env.AUTH_KEY;
const AUTH_SECRET = process.env.AUTH_SECRET;

// 跨域放行
app.all('*', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// 中转接口
app.get('/api/proxy', async (req, res) => {
  const { query } = req.query;
  const params = new URLSearchParams({
    uuid: UUID,
    auth_key: AUTH_KEY,
    auth_key: AUTH_KEY,
    auth_secret: AUTH_SECRET,
    query
  });
  const targetUrl = `${HOST}/stream?${params.toString()}`;

  try {
    const upstream = await fetch(targetUrl, {
      headers: {
        Accept: 'text/event-stream',
        'Cache-Control': 'no-cache',
        'User-Agent': 'Mozilla/5.0 Windows Chrome'
      }
    });
    if (!upstream.ok) {
      return res.end(`上游错误:${upstream.status}`);
    }
    // SSE流式透传
    res.setHeader('Content-Type', 'text/event-stream');
    upstream.body.pipe(res);
  } catch (err) {
    res.end('中转服务请求失败');
  }
});

// 托管前端页面
app.get('/', (req, res) => {
  res.sendFile('./index.html', { root: '.' });
});

app.listen(port, () => {
  console.log(`中转服务启动，端口${port}`);
});
