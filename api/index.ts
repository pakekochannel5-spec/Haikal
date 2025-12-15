import serverless from "serverless-http";
import { initializeApp } from "../server/index";

let handler: any | null = null;

async function getHandler() {
  if (!handler) {
    const app = await initializeApp();
    handler = serverless(app);
  }
  return handler;
}

export default async function (req: any, res: any) {
  const h = await getHandler();
  return h(req, res);
}
