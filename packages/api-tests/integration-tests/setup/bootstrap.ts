/// <reference types="bun-types" />
import { beforeAll, afterAll } from "bun:test";
import app from "api";
import { Server } from "http";

let testServer: Server;

beforeAll(async () => {
  return new Promise<void>((resolve, reject) => {
    // Port 0 tells the OS to assign a random, free port dynamically
    testServer = app.listen(0, () => {
      const address = testServer.address();
      if (!address || typeof address !== "object") {
        reject(new Error("[Test Bootstrap] Server address is not available or invalid."));
        return;
      }
      const port = address.port;
      const baseUrl = `http://localhost:${port}`;
      
      // Store in globalThis so that tests can access it dynamically
      (globalThis as any).TEST_PORT = port;
      (globalThis as any).TEST_BASE_URL = baseUrl;
      
      console.log(`\n[Test Bootstrap] Started test server on port ${port} (${baseUrl})`);
      resolve();
    });
    
    testServer.on("error", (err) => {
      console.error("[Test Bootstrap] Server startup error:", err);
      reject(err);
    });
  });
});

afterAll(async () => {
  return new Promise<void>((resolve, reject) => {
    if (testServer) {
      testServer.close((err) => {
        if (err) {
          console.error("[Test Bootstrap] Server shutdown error:", err);
          reject(err);
        } else {
          console.log("[Test Bootstrap] Test server stopped successfully");
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
});
