const https = require('https');
const http = require('http');

/**
 * Keep-Alive Service for Cloud Hosting (Render Free Tier, Railway, Fly.io)
 * Automatically pings the server's health check endpoint to prevent cold-start spin-down
 */
let keepAliveTimer = null;

const initKeepAlive = ({ port = 5000, intervalMinutes = 10 } = {}) => {
  // If explicitly disabled via env, skip
  if (process.env.DISABLE_KEEP_ALIVE === 'true') {
    console.log('ℹ️ [Keep-Alive] Self-ping service disabled via DISABLE_KEEP_ALIVE.');
    return;
  }

  const targetUrl =
    process.env.RENDER_EXTERNAL_URL ||
    process.env.SERVER_URL ||
    process.env.PUBLIC_URL ||
    `http://localhost:${port}`;

  const pingUrl = `${targetUrl.replace(/\/$/, '')}/api/health`;
  const intervalMs = Math.max(1, intervalMinutes) * 60 * 1000;

  console.log(`⏱️ [Keep-Alive] Self-ping initialized for ${pingUrl} (every ${intervalMinutes} mins).`);

  const ping = () => {
    try {
      const urlObj = new URL(pingUrl);
      const requester = urlObj.protocol === 'https:' ? https : http;

      const req = requester.get(
        pingUrl,
        {
          timeout: 10000,
          headers: {
            'User-Agent': 'GarbaKeepAlive/1.0',
          },
        },
        (res) => {
          if (res.statusCode === 200) {
            // Heartbeat successful
          } else {
            console.warn(`⚠️ [Keep-Alive] Self-ping received status code: ${res.statusCode}`);
          }
        }
      );

      req.on('error', (err) => {
        // Silently catch network errors so background worker never throws uncaught exceptions
      });

      req.on('timeout', () => {
        req.destroy();
      });
    } catch {
      // Ignore URL parsing errors on initial spinup
    }
  };

  // Schedule recurring ping
  if (keepAliveTimer) clearInterval(keepAliveTimer);
  keepAliveTimer = setInterval(ping, intervalMs);

  // Initial delayed ping after 30 seconds
  setTimeout(ping, 30000);
};

module.exports = { initKeepAlive };
