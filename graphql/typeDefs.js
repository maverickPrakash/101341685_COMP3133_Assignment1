export const typeDefs = `
type employee{
    _id:String!
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    salaey: Float!
}
type user{
    username: String!
    email: String!
    password: String!
}
  type Query {
    hello: String!
    getAllEmployee: [employee]
    searchById(id:String!): employee
  },
  type Mutation{
    addEmployee(first_name: String!, last_name: String!, email: String!, gender: String!, salary: Float!): String!
    signUp(username: String!,email: String!, password: String!): String!
  }
`;