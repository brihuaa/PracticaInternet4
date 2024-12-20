import { ApolloServer } from "@apollo/server";
import { MongoClient } from "mongodb";
import { startStandaloneServer } from "@apollo/server/standalone";
import { VehicleModel, Vehicle } from "./types.ts";
import { schema } from "./schema.ts";
import { resolvers } from "./resolvers.ts";

const url = 'mongodb+srv://otheruser:123456aaabbbb@cluster0.loyvx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(url);
//hola
const dbName = 'BDP4';


await client.connect();
console.log('Connected successfully to server');
const db = client.db(dbName);



const VehiclesCollection =db.collection("Vehiculos");

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
  });

  console.info(`Server ready at ${url}`);