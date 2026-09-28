import { connectAll } from "./config/db.js";
import { createApp } from "./app.js";
import { startAvailabilityCron } from "./jobs/availability.cron.js";
import { env } from "./config/env.js";

async function main() {
  const db = await connectAll();
  const app = createApp(db);

  startAvailabilityCron();

  app.listen(env.PORT, () => {
    console.log(`[server] RoktoSetu API running on port ${env.PORT} (${env.NODE_ENV})`);
  });
}

main().catch((err) => {
  console.error("[server] failed to start", err);
  process.exit(1);
});
