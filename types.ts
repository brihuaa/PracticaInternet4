import { OptionalId } from "mongodb";

export type VehicleModel = OptionalId<{
  name: string;
  manufacturer: string;
  year: number;
}>;

export type Vehicle = {
  id: string;
  name: string;
  manufacturer: string;
  year: number;
};
