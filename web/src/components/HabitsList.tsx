import * as Checkbox from '@radix-ui/react-checkbox'
import dayjs from 'dayjs'
import { Check } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { api } from '../lib/axios'

interface HabitsInfo{
    completedHabits: string[]
    possibleHabits: {
        id: string
        title: string
        create_at: string
    }[]
}

interface HabitsListProps{
    date: Date
    onCompletedChange: (completed: number) => void
}

export const HabitsList: React.FC<HabitsListProps> = ({ date, onCompletedChange }) => {

    const [list, setList] = useState<HabitsInfo>({} as HabitsInfo)

    const isDateInPast = dayjs(date)
        .endOf("day")
        .isBefore(new Date())

    useEffect(() => {
        api.get("/day", {
            params: { 
                date: date.toISOString() 
            }
        })
        .then(response => setList(response.data))
        .catch(err => alert(err.message))  
    },[date])

    const handleToggleHabit = async(habitId: string) => {
        try {
            await api.patch(`/habits/${habitId}/toggle`)
            const isCompleted = list.completedHabits.includes(habitId)

            let completedHabits: string[] = []

            if(isCompleted){
                completedHabits = list.completedHabits.filter(id => id !== habitId)
            } else{
                completedHabits = [...list.completedHabits, habitId]
            }

            setList(prev => ({
                ...prev,
                completedHabits: completedHabits 
            }))

            onCompletedChange(completedHabits.length)
        } catch (error: any) {
            console.log(error)
            alert(error.message)
        }
    }

    return (
        <div className='mt-6 flex flex-col gap-3'>
            { list.possibleHabits?.map(habit => (
                <Checkbox.Root 
                    key={ habit.id }
                    className='flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed'
                    checked={ list.completedHabits.includes(habit.id) }
                    disabled={ isDateInPast }
                    onCheckedChange={() => handleToggleHabit(habit.id) }
                >
                    <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state="checked"]:bg-green-500 group-data-[state="checked"]:border-green-500 transition-colors group-focus:ring-2 group-focus:ring-violet-400 group-focus:ring-offset-2 group-focus:ring-offset-background'>
                        <Checkbox.Indicator>
                            <Check size={20} className="text-white"/>
                        </Checkbox.Indicator>
                    </div>
                    <span className='font-semibold text-xl text-white leading-tight group-data-[state="checked"]:line-through group-data-[state="checked"]:text-zinc-400'>
                        { habit.title }
                    </span>
                </Checkbox.Root>
            ))}
        </div>
    )
}