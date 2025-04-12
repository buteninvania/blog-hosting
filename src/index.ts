import "module-alias/register";

import { app } from "./app";
import { connectToDB } from "./db/mongo-db";
import { SETTINGS } from "./settings";

const startApp = async () => {
  await connectToDB();
  app.listen(SETTINGS.PORT, () => {
    console.log(`...server started in port ${SETTINGS.PORT}`);
  });
};

startApp();
