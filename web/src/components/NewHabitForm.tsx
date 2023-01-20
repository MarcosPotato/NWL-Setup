import { FormEvent, useState } from 'react'
import * as Checkbox from '@radix-ui/react-checkbox'
import { Check } from "phosphor-react"
import { api } from '../lib/axios'

const availableWeekDays = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado-feira'
]

export const NewHabitForm: React.FC = () => {

    const [title, setTitle] = useState("")
    const [selectedWeekDays, setSelectedWeekDays] = useState<number[]>([])

    const handleWeekDaySelection = (weekDay: number) => {
        setSelectedWeekDays(prev => {
            if(prev.includes(weekDay)){
                return prev.filter(selectedDay => selectedDay !== weekDay)
            }

            return [...prev, weekDay]
        })
    }

    const handleSubmit = async(event: FormEvent) => {
        event.preventDefault()

        if(!title || selectedWeekDays.length <= 0){
            return
        }

        try {
            await api.post("/habits", {
                title,
                weekDays: selectedWeekDays
            })

            setTitle("")
            setSelectedWeekDays([])

            alert("Hábito Criado")
        } catch (error: any) {
            console.log(error)
            alert(error.message)
        }
    }

    return (
        <form onSubmit={ handleSubmit } className="w-full flex flex-col mt-6">
            <label htmlFor="title" className="font-semibold leading-tight">
                Qual seu compromentimento
            </label>

            <input 
                type="text"
                id="title"
                placeholder="ex.: Exercícios, dormir bem, etc..."
                autoFocus
                value={ title }
                onChange={ event => setTitle(event.target.value) }
                className="p-4 rounded-lg mt-3 bg-zinc-800 text-white border-zinc-800 placeholder:text-zinc-400 border-2 focus:border-green-600 outline-none"
            />

            <label className="font-semibold leading-tight mt-4">
                Qua a recorrência
            </label>

            <div className="flex flex-col gap-2 mt-3">
                { availableWeekDays.map((weekDay, index) => (
                    <Checkbox.Root 
                        key={ weekDay }
                        className='flex items-center gap-3 group'
                        checked={ selectedWeekDays.includes(index) }
                        onCheckedChange={() => handleWeekDaySelection(index)}
                    >
                        <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state="checked"]:bg-green-500 group-data-[state="checked"]:border-green-500'>
                            <Checkbox.Indicator>
                                <Check size={20} className="text-white"/>
                            </Checkbox.Indicator>
                        </div>
                        <span className='font-semibold text-white leading-tight'>
                            { weekDay }
                        </span>
                    </Checkbox.Root>
                )) }
            </div>

            <button type="submit" className="mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-green-600 hover:bg-green-500">
                <Check size={ 20} />
                Confirmar
            </button>
        </form>
    )
}