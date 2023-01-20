import clsx from "clsx"
import dayjs from "dayjs"
import { TouchableOpacity, Dimensions, TouchableOpacityProps } from "react-native"
import { generateProgressPercentPage } from "../utils/generateProgressPercentPage"

const WEEK_DAYS = 7
const SCREEN_HORIZONTAL_PADDING = (32 * 2) / 5

export const DAY_MARGIN_BTW = 8
export const DAY_SIZE = (Dimensions.get("screen").width / WEEK_DAYS) - (SCREEN_HORIZONTAL_PADDING + 5)

interface HabitDayProps extends TouchableOpacityProps{
    amount?: number
    completed?: number
    date: Date
}

export const HabitDay: React.FC<HabitDayProps> = ({ amount = 0, completed = 0, date, ...rest }) => {
    
    const progress = generateProgressPercentPage(amount, completed)
    const today = dayjs().startOf("day").toDate()
    const isCurrentDay = dayjs(date).isSame(today, "day")

    return (
        <TouchableOpacity
            { ...rest }
            activeOpacity={0.7}
            className={ clsx(
                "w-10 h-10 rounded-lg border-2 m-1",
                {
                    'bg-zinc-900 border-zinc-800': progress === 0,
                    'bg-violet-900 border-violet-700': progress > 0 && progress < 20,
                    'bg-violet-800 border-violet-600': progress >= 20 && progress < 40,
                    'bg-violet-700 border-violet-500': progress >= 40 && progress < 60,
                    'bg-violet-600 border-violet-500': progress >= 60 && progress < 80,
                    'bg-violet-500 border-violet-400': progress >= 80,
                    "border-white border-4": isCurrentDay
                }
            ) }
            style={{
                width: DAY_SIZE,
                height: DAY_SIZE
            }}
        />
    )
}