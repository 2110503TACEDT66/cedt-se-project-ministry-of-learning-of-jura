import swaggerAutogen from "swagger-autogen";
import env from "./config/env";

const doc = {
  info: {
    title: "Bing Resy",
    description: "Restaurant Reservation Service",
  },
  host: env.HOST,
};

const outputFile = "../swagger/output.json";
const routes = ["../src/server.ts"]; // make it support both js and ts

swaggerAutogen(outputFile, routes, doc);
