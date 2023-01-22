import clsx from 'clsx'
import dayjs from 'dayjs'
import * as Poppover from '@radix-ui/react-popover'

import { ProgressBar } from './ProgressBar'
import { HabitsList } from './HabitsList'
import { useCallback, useEffect, useState } from 'react'

interface HabitDayProps {
    amount?: number
    defaultCompleted?: number
    date: Date
}

export const HabitDay: React.FC<HabitDayProps> = ({ amount = 0, defaultCompleted = 0, date }) => {

    const [completed, setCompleted] = useState(defaultCompleted)

    const completedPercentage = amount > 0 ? Math.round((completed / amount) * 100) : 0

    const dateAndMonth = dayjs(date).format("DD/MM")
    const dayOfWeek = dayjs(date).format("dddd")

    const handleCompletedChange = useCallback((completed: number) => {
        setCompleted(completed)
    },[])

    useEffect(() => {
        setCompleted(defaultCompleted)
    },[defaultCompleted])

    return (
        <Poppover.Root>
            <Poppover.Trigger 
                className={ clsx(
                    "w-10 h-10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-background",
                    {
                        'bg-zinc-900 border-2 border-zinc-800': completedPercentage === 0,
                        'bg-violet-900 border-violet-700': completedPercentage > 0 && completedPercentage < 20,
                        'bg-violet-800 border-violet-600': completedPercentage >= 20 && completedPercentage < 40,
                        'bg-violet-700 border-violet-500': completedPercentage >= 40 && completedPercentage < 60,
                        'bg-violet-600 border-violet-500': completedPercentage >= 60 && completedPercentage < 80,
                        'bg-violet-500 border-violet-400': completedPercentage >= 80
                    }
                ) }
            />

            <Poppover.Portal>
                <Poppover.Content className='min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col'>
                    <span className='font-semibold text-zinc-400'>
                        { dayOfWeek }
                    </span>
                    <span className='mt-1 font-extrabold leading-tight text-3xl'>
                        { dateAndMonth }
                    </span>

                    <ProgressBar progress={completedPercentage} />

                    <HabitsList 
                        date={ date } 
                        onCompletedChange={ handleCompletedChange }
                    />

                    <Poppover.Arrow 
                        height={8} 
                        width={12} 
                        className='fill-zinc-900' 
                    />
                </Poppover.Content>
            </Poppover.Portal>
        </Poppover.Root>
    )
}