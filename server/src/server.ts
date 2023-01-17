import fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import cors from '@fastify/cors'

const prisma = new PrismaClient()
const app = fastify()

app.register(cors)

app.get("/",() => {
    return "Hello NLW"
})

app.listen({
    port: 3333
}).then(() => {
    console.log("http server is running on port 3333")
})