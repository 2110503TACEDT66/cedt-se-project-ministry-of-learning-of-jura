import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Bing Resy",
    description: "Restaurant Reservation Service",
  },
  host: "localhost:6969",
};

const outputFile = "../swagger/output.json";
const routes = ["../src/server.ts"]; // make it support both js and ts

swaggerAutogen(outputFile, routes, doc);
