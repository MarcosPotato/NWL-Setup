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

    const completeToggleHabitParams = z.object({
        id: z.string().uuid(),
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

        const completedHabits = day?.dayHabits.map(habit => habit.habit_id) || []

        response.status(200)

        return {
            possibleHabits,
            completedHabits
        }
    })

    app.get("/summary", async() => {
        const summary = await prisma.$queryRaw`
            SELECT 
                d.id, 
                d.date,
                (
                    SELECT 
                        cast(count(*) as float)
                    FROM day_habits dh
                    WHERE dh.day_id = d.id
                ) as completed,
                (
                    SELECT
                        cast(count(*) as float)
                    FROM habit_week_days hwd
                    JOIN habits h
                    ON h.id = hwd.habit_id
                    WHERE 
                        hwd.week_day = cast(strftime('%w', d.date/1000, 'unixepoch') as int)
                        AND h.create_at <= d.date
                ) as amount
            FROM days d
        `

        return summary
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

    app.patch("/habits/:id/toggle", async(request) => {
        const { id } = completeToggleHabitParams.parse(request.params)

        const today = dayjs().startOf("day").toDate()

        let day = await prisma.day.findUnique({
            where: {
                date: today
            }
        })

        if(!day){
            day = await prisma.day.create({
                data: {
                    date: today
                }
            })
        }

        const dayHabit = await prisma.dayHabit.findUnique({
            where: {
                day_id_habit_id: {
                    day_id: day.id,
                    habit_id: id
                }
            }
        })

        if(dayHabit){
            await prisma.dayHabit.delete({
                where: {
                    id: dayHabit.id
                }
            })
        } else{
            await prisma.dayHabit.create({
                data: {
                    day_id: day.id,
                    habit_id: id
                }
            })
        }
    })
}