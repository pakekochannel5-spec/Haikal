import { createServer } from "http";
import { initializeApp, log } from "./index";

(async () => {
  const app = await initializeApp();
  const httpServer = createServer(app);

  // In non-production use Vite dev server
  if (process.env.NODE_ENV !== "production") {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
