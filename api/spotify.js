const https = require('https');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const postData = JSON.stringify(req.body);

  return new Promise((resolve) => {
    const options = {
      hostname: 'musicfab.io',
      port: 443,
      path: '/api/spotify',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };

    const request = https.request(options, (response) => {
      let data = '';
      response.on('data', chunk => { data += chunk.toString(); });
      response.on('end', () => {
        try {
          const json = JSON.parse(data);
          res.status(200).json(json);
        } catch (e) {
          res.status(500).json({ success: false, error: 'Gagal parse respons dari API' });
        }
        resolve();
      });
    });

    request.on('error', (err) => {
      res.status(500).json({ success: false, error: err.message });
      resolve();
    });

    request.write(postData);
    request.end();
  });
};
