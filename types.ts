import { ObjectId } from "mongodb";

// Esquema para vehículos
export type Vehicle = {
  id?: ObjectId;
  name: string;
  manufacturer: string;
  year: number;
};

// Esquema para repuestos
export type VehiclePart = {
  id?: ObjectId;
  name: string;
  price: number;
  vehicleId: string;
};

