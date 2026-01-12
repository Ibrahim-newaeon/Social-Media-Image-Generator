import type { Express } from "express";
import { createServer, type Server } from "http";
import { registerImageRoutes } from "./replit_integrations/image";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  registerImageRoutes(app);
  
  return httpServer;
}
