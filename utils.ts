import { Collection, ObjectId } from "mongodb";
import { Vehicle } from "./types.ts";

// Validar si un vehículo existe
export const validarVehiculo = async (
  vehicleId: string,
  vehicleCollection: Collection<Vehicle>
) => {
  const vehicle = await vehicleCollection.findOne({ _id: new ObjectId(vehicleId) });
  return Boolean(vehicle);
};
