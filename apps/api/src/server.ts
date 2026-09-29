import { app } from "./app";
import { env } from "./config/env";
import { prisma } from "./config/prisma";

const server = app.listen(env.PORT, () => {
  console.log(`=======================================================`);
  console.log(`🧵 Indigo & Thread API Server running on port ${env.PORT}`);
  console.log(`🌐 Base URL: http://localhost:${env.PORT}`);
  console.log(`🏥 Health check: http://localhost:${env.PORT}/api/v1/health`);
  console.log(`⚙️  Environment: ${env.NODE_ENV}`);
  console.log(`=======================================================`);
});

const gracefulShutdown = async (signal: string) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    console.log("HTTP server closed.");
    await prisma.$disconnect();
    console.log("Database connection closed.");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Forcefully shutting down due to timeout...");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
