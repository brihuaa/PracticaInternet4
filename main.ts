import { ApolloServer } from "@apollo/server";
import { MongoClient } from "mongodb";
import { startStandaloneServer } from "@apollo/server/standalone";

import { VehicleModel, Vehicle } from "./types.ts";
import { schema } from "./schema.ts";
import { resolvers } from "./resolvers.ts";

const url = 'mongodb+srv://otheruser:123456aaabbbb@cluster0.loyvx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(url);

const dbName = 'BDP4';

await client.connect();
console.log('Connected successfully to server');
const db = client.db(dbName);


const VehiclesCollection = db.collection("Vehiculos");

const gqlSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers: resolvers,
});

// Servidor HTTP para manejar consultas GraphQL
serve(async (req) => {
  try {
    const { pathname } = new URL(req.url);

    if (pathname === "/graphql" && req.method === "POST") {
      const body = await req.json();

      // Ejecutar consulta GraphQL
      const { execute, parse, validate } = await import("https://deno.land/x/graphql_deno@v15.0.0/mod.ts");
      const parsedQuery = parse(body.query);
      const validationErrors = validate(gqlSchema, parsedQuery);

      if (validationErrors.length > 0) {
        return new Response(JSON.stringify({ errors: validationErrors }), { status: 400 });
      }

      const result = await execute({
        schema: gqlSchema,
        document: parsedQuery,
        variableValues: body.variables,
        contextValue: { VehiclesCollection },
      });

      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    return new Response("Not Found", { status: 404 });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: createHttpError(500, error.message) }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});

console.log("Server is running at http://localhost:8000/graphql");
