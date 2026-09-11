import app from "./app";
import { prisma } from "./lib/prisma";
import { env } from "./config";

const main = async () => {
  try {
    await prisma.$connect();
    console.log("Database is connected!");

    app.listen(env.data.PORT, () => {
      console.log(`Server is running at port: ${env.data.PORT}`);
    });
  } catch (err) {
    console.error("Something went wrong", err);
    try {
      await prisma.$disconnect();
    } finally {
      process.exit(1);
    }
  }
};

main();
