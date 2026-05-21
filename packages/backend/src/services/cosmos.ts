import { CosmosClient, Database, Container } from "@azure/cosmos";

import { config } from "../config.js";

const cosmosClient = new CosmosClient({
  endpoint: config.cosmosEndpoint,
  key: config.cosmosKey,
});

export const getDatabase = (): Database => cosmosClient.database(config.cosmosDatabase);

export const getContainer = (containerName: string): Container => getDatabase().container(containerName);
