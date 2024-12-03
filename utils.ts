import { Vehicle, VehicleModel } from "./types.ts";

export const formModelToVehicle = (vehicleModel: VehicleModel): Vehicle => {
  return {
    id: vehicleModel._id!.toString(),
    name: vehicleModel.name,
    manufacturer: vehicleModel.manufacturer,
    year: vehicleModel.year,
  };
};
