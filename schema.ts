export const schema = `#graphql
type Vehicle {
  id: ID!
  name: String!
  manufacturer: String!
  year: Int!
}

type Query {
  vehicles: [Vehicle!]!
  vehicle(id: ID!): Vehicle
}

type Mutation {
  addVehicle(name: String!, manufacturer: String!, year: Int!): Vehicle!
  deleteVehicle(id: ID!): Vehicle
}
`;
