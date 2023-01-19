import { generateDatesFromYearBegin } from "../utils/generateDatesFromYearBegin"
import { HabitDay } from "./HabitDay"

const weekDays = ["D", "S", "T", "Q", "Q" , "S", "S"]
const summaryDates = generateDatesFromYearBegin()

const minimunSumaryDatesSizes = 18 * 7 //18 weeks
const amountOfDaysToFill = minimunSumaryDatesSizes - summaryDates.length

export const SummaryTable: React.FC = () => {
    return (
        <div className="w-full flex">
            <div className="grid grid-rows-7 grid-flow-row gap-3">
                { weekDays.map((day, index) => (
                    <div 
                        key={ `${day}-${index}` }
                        className="text-zinc-400 text-xl h-10 w-10 flex items-center justify-center font-bold"
                    >
                        { day }
                    </div>
                )) }
            </div>

            <div className="grid grid-rows-7 grid-flow-col gap-3">
                { summaryDates.map(date => (
                    <HabitDay key={ date.getTime() } />
                )) }

                {amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, index) => (
                    <div key={ index } className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"/>
                ))}
            </div>
        </div>
    )
}