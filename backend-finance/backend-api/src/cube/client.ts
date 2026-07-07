import cubejs from "@cubejs-client/core";
import "cross-fetch/polyfill";
import dotenv from "dotenv";

dotenv.config();

const cubeApi = cubejs(
  process.env.CUBE_API_TOKEN!,
  {
    apiUrl: process.env.CUBE_API_URL!
  }
);

export default cubeApi;