import "dotenv/config";

export const config = {
  cosmosEndpoint: process.env.COSMOS_ENDPOINT ?? "",
  cosmosKey: process.env.COSMOS_KEY ?? "",
  cosmosDatabase: process.env.COSMOS_DATABASE ?? "appdb",
  jwtSecret: process.env.JWT_SECRET ?? "",
  port: Number(process.env.PORT ?? 3001),
};
