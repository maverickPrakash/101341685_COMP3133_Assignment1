// npm install @apollo/server express graphql cors
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { typeDefs } from './graphql/typeDefs.js';
import { mongoose } from 'mongoose';
import { Employees } from './schema/employee.js';
import { User } from './schema/User.js';



const app = express();

const httpServer = http.createServer(app);
mongoose.connect('mongodb+srv://root:TOb8asod34UApwJT@cluster0.1ly2v5i.mongodb.net/comp3133_assigment1', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const server = new ApolloServer({
  typeDefs,
   resolvers: {
    Query: {
      hello: () => "Hello world!",
      getAllEmployee: async()=>{
        return await Employees.find({});
      },
      searchById: async (_,args)=>{
        return await Employees.findById(args.id)
      }
    },
    Mutation:{
        addEmployee: async (_,args) =>{
           
            const emp = new Employees(
                {
                first_name: args.first_name,
                last_name: args.last_name,
                email: args.email,
                gender: args.gender,
                salary: args.salary,
                }
            )
            try{
               await emp.save();
                return "Employee added sucessfully"
            }catch(err){
                return err.message
            }
        },
        signUp: async (_,args)=>{
            const usr = new User({
                ...args
            })
            try{
                await usr.save();
                 return "User added sucessfully"
             }catch(err){
                 return err.message
             }

        }
    }
  },
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();


app.use(
  '/',
  cors(),
  express.json(),

  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  }),
);


await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

console.log(` Server ready at http://localhost:4000/`);