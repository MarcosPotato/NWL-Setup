import dayjs from "dayjs"
import { FastifyInstance } from "fastify"
import { z } from 'zod'
import { prisma } from "./lib/prisma"

export const appRoutes = async(app: FastifyInstance) => {
    const createHabitsSchema = z.object({
        title: z.string(),
        weekDays: z.array(
            z.number().min(0).max(6)
        )
    })

    const getDayParams = z.object({
        date: z.coerce.date(),
    })

    app.get("/day", async(request, response) => {
        const { date } = getDayParams.parse(request.query)

        const parsedDate = dayjs(date)
        const weekDay = parsedDate.get("day")

        const possibleHabits = await prisma.habit.findMany({
            where: {
                create_at: {
                    lte: date
                },
                weekDays: {
                    some: {
                        week_day: weekDay 
                    }
                }
            }
        })

        const day = await prisma.day.findUnique({
            where: {
                date: parsedDate.toDate()
            },
            include: {
                dayHabits: true
            }
        })

        const completedHabits = day?.dayHabits.map(habit => habit.habit_id)

        response.status(200)

        return {
            possibleHabits,
            completedHabits
        }
    })

    app.post("/habits", async(request, response) => {
        const { title, weekDays } = createHabitsSchema.parse(request.body)

        const today = dayjs().startOf("day").toDate()

        await prisma.habit.create({
            data: {
                title,
                create_at: today,
                weekDays: {
                    create: weekDays.map(day => ({
                        week_day: day
                    }))
                }
            }
        })

        return response.status(201).send()
    })
}