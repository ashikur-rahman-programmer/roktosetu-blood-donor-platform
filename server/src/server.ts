import { connectAll } from "./config/db";
import { createApp } from "./app";
import { startAvailabilityCron } from "./jobs/availability.cron";
import { env } from "./config/env";

async function main() {
  const db = await connectAll();
  const app = createApp(db);

  startAvailabilityCron();

  app.listen(env.PORT, () => {
    console.log(
      `[server] RoktoSetu API running on port ${env.PORT} (${env.NODE_ENV})`,
    );
  });
}

main().catch((err) => {
  console.error("[server] failed to start", err);
  process.exit(1);
});
