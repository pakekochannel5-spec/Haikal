import { createServer, get as httpGet } from "http";
const http: typeof import('http') = { get: httpGet } as any;
import { initializeApp } from "../server/index";

(async () => {
  const app = await initializeApp();
  const server = createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  // @ts-ignore
  const addr = server.address();
  const port = typeof addr === "object" && addr ? addr.port : 0;
  try {
    await new Promise<void>((resolve, reject) => {
      http.get({ hostname: '127.0.0.1', port, path: '/api/health', agent: false }, (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (c) => chunks.push(Buffer.from(c)));
        res.on('end', () => {
          try {
            const body = Buffer.concat(chunks).toString('utf8');
            console.log('/api/health status', res.statusCode, JSON.parse(body));
            resolve();
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);
    });
  } catch (err) {
    console.error("error testing /api/health:", err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
})();
