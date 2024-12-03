import { ApolloServer } from "@apollo/server";
import { MongoClient } from "mongodb";
import { startStandaloneServer } from "@apollo/server/standalone";


import { VehicleModel, Vehicle } from "./types.ts";
import { schema } from "./schema.ts";
import { resolvers } from "./resolvers.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");

if (!MONGO_URL) {
  throw new Error("Please provide a MONGO_URL");
}

const mongoClient = new MongoClient(MONGO_URL);
await mongoClient.connect();

console.info("Connected to MongoDB");


const mongoDB = mongoClient.db("Vehiculos");
const VehiclesCollection = mongoDB.collection<VehicleModel>("Vehiculos");

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
     context: async () => ({ VehiclesCollection }),
  });
  
  console.info(`Server ready at ${url}`);