import { MongoClient } from 'mongodb'
import { validarVehiculo } from "./utils.ts";
import { Vehicle, Part } from "./types.ts";


const url = 'mongodb+srv://otheruser:123456aaabbbb@cluster0.loyvx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(url);

const dbName = 'BDP4';

await client.connect();
console.log('Connected successfully to server');
const db = client.db(dbName);


const vehiclesCollection = db.collection<Vehicle>("vehicles");
const partsCollection = db.collection<Part>("parts");

const handler = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const method = req.method;
  const path = url.pathname;

  if (method === "POST" && path === "/vehicle") {
    const data = await req.json();
    const { name, manufacturer, year } = data;

    if (!name || !manufacturer || !year) {
      return new Response(JSON.stringify({ error: "Datos inválidos" }), { status: 400 });
    }

    const insertResult = await vehiclesCollection.insertOne({ name, manufacturer, year });
    return new Response(JSON.stringify({ message: "Vehículo agregado", id: insertResult.toString() }), { status: 201 });
  }

  if (method === "POST" && path === "/part") {
    const data = await req.json();
    const { name, price, vehicleId } = data;

    if (!name || !price || !vehicleId) {
      return new Response(JSON.stringify({ error: "Datos inválidos" }), { status: 400 });
    }

    const vehiculoValido = await validarVehiculo(vehicleId, vehiclesCollection);
    if (!vehiculoValido) {
      return new Response(JSON.stringify({ error: "El vehículo no existe" }), { status: 400 });
    }

    const insertResult = await partsCollection.insertOne({ name, price, vehicleId });
    return new Response(JSON.stringify({ message: "Repuesto agregado", id: insertResult.toString() }), { status: 201 });
  }

  if (method === "GET" && path === "/vehicles") {
    const vehicles = await vehiclesCollection.find().toArray();
    return new Response(JSON.stringify(vehicles), { status: 200 });
  }

  if (method === "GET" && path.startsWith("/vehicle/")) {
    const id = path.split("/")[2];
    const vehicle = await vehiclesCollection.findOne({ _id: new ObjectId(id) });
    if (!vehicle) return new Response(JSON.stringify({ error: "Vehículo no encontrado" }), { status: 404 });

    return new Response(JSON.stringify(vehicle), { status: 200 });
  }

  if (method === "GET" && path === "/parts") {
    const parts = await partsCollection.find().toArray();
    return new Response(JSON.stringify(parts), { status: 200 });
  }

  return new Response("Not found", { status: 404 });
};

Deno.serve({ port: 3000 }, handler);
