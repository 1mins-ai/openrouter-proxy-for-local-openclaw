const express = require('express');
const app = express();
app.use(express.json());

const WORKER_URL = 'https://openrouter-workerxyz.xxxxx.workers.dev';

app.use(async (req, res) => {
  console.log('=== INCOMING REQUEST ===');
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));

  const response = await fetch(`${WORKER_URL}${req.path}`, {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': req.headers.authorization || '',
    },
    body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
  });

  console.log('=== WORKER RESPONSE STATUS ===', response.status);

  // ✅ 判斷係咪 streaming
  const isStream = req.body?.stream === true;

  if (isStream) {
    // ✅ Streaming：直接 pipe 返去 OpenClaw
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.status(response.status);

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value, { stream: true }));
    }
    res.end();

  } else {
    // ✅ Non-streaming：照舊返 JSON
    const data = await response.json();
    console.log('Body:', JSON.stringify(data, null, 2));
    res.status(response.status).json(data);
  }
});

app.listen(3060, () => console.log('Proxy running on port 3060'));