import { Collection, ObjectId } from "mongodb";
import { Vehicle, VehicleModel } from "./types.ts";
import { formModelToVehicle } from "./utils.ts";

export const resolvers = {
  Query: {
    vehicles: async (
      _: unknown,
      __: unknown,
      context: { VehiclesCollection: Collection<VehicleModel> },
    ): Promise<Vehicle[]> => {
      const vehiclesModel = await context.VehiclesCollection.find().toArray();
      return vehiclesModel.map((vehicleModel) =>
        formModelToVehicle(vehicleModel)
      );
    },
    vehicle: async (
      _: unknown,
      { id }: { id: string },
      context: { VehiclesCollection: Collection<VehicleModel> },
    ): Promise<Vehicle | null> => {
      const vehicleModel = await context.VehiclesCollection.findOne({
        _id: new ObjectId(id),
      });
      if (!vehicleModel) {
        return null;
      }
      return formModelToVehicle(vehicleModel);
    },
  },
  Mutation: {
    addVehicle: async (
      _: unknown,
      args: { name: string; manufacturer: string; year: number },
      context: { VehiclesCollection: Collection<VehicleModel> },
    ): Promise<Vehicle> => {
      const { name, manufacturer, year } = args;
      const { insertedId } = await context.VehiclesCollection.insertOne({
        name,
        manufacturer,
        year,
      });
      const vehicleModel = {
        _id: insertedId,
        name,
        manufacturer,
        year,
      };
      return formModelToVehicle(vehicleModel);
    },
    deleteVehicle: async (
      _: unknown,
      args: { id: string },
      context: { VehiclesCollection: Collection<VehicleModel> },
    ): Promise<Vehicle | null> => {
      const id = args.id;
      const vehicleModel = await context.VehiclesCollection.findOneAndDelete({
        _id: new ObjectId(id),
      });
      if (!vehicleModel) {
        return null;
      }
      return formModelToVehicle(vehicleModel);
    },
  },
};
