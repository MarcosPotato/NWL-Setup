import { View, Text, ScrollView, Alert } from "react-native"
import { useRoute } from '@react-navigation/native'
import { BackButton } from "../components/BackButton"
import dayjs from "dayjs"
import { ProgressBar } from "../components/ProgressBar"
import { Checkbox } from "../components/Checkbox"
import { api } from "../lib/axios"
import { useEffect, useState } from "react"
import { Loading } from "../components/Loading"
import { generateProgressPercentPage } from "../utils/generateProgressPercentPage"
import { HabitsEmpty } from "../components/HabitsEmpty"
import clsx from "clsx"

interface HabitsParams{
    date: string
}

interface Habits{
    completedHabits: string[]
    possibleHabits: {
        id: string
        title: string
        create_at: string
    }[]
}

export const Habits: React.FC = () => {
    
    const routes = useRoute()
    const { date } = routes.params as HabitsParams

    const [loading, setLoading] = useState(true)

    const [habits, setHabits] = useState<Habits>({} as Habits)

    const parsedDate = dayjs(date)
    const dayOfWeek = parsedDate.format('dddd')
    const dayAndMonth = parsedDate.format("DD/MM")
    const isDateOnPast = parsedDate.endOf("day").isBefore(new Date())

    const habitsProgress = habits.possibleHabits?.length 
        ? generateProgressPercentPage(habits.possibleHabits.length, habits.completedHabits.length)
        : 0

    const fetchHabits = async () => {
        setLoading(true)
        try {
            const response = await api.get("/day", {
                params: { date: dayjs(date).add(3, 'hour').toISOString() }
            })

            setHabits(response.data)

        } catch (error) {
            console.log(error)
            Alert.alert("Ops!", "Não foi possivel carregar os hábitos.")
        } finally{
            setLoading(false)
        }
    }

    const handleToggleHabit = async(id: string) => {
        try {
            const isCompleted = habits.completedHabits.includes(id)
            
            let completedHabits: string[] = []
            
            if(isCompleted){
                completedHabits = habits.completedHabits.filter(habitId => habitId !== id)
            } else{
                completedHabits = [...habits.completedHabits, id]
            }
            
            setHabits(prev => ({
                ...prev,
                completedHabits: completedHabits
            }))
            
            await api.patch(`/habits/${id}/toggle`)
        } catch (error) {
            console.log(error)
            Alert.alert("Ops!", "Não foi alterar o status do hábito")
        }
    }

    useEffect(() => {
        fetchHabits()
    },[])

    if(loading){
        return <Loading />
    }

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <BackButton />
            <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
                { dayOfWeek }
            </Text>
            <Text className="text-white font-extrabold text-3xl">
                { dayAndMonth  }
            </Text>
            <ProgressBar progress={habitsProgress}/>
            <ScrollView
                showsVerticalScrollIndicator={ false }
                contentContainerStyle={{ paddingBottom: 100 }}
                className="mt-2"
            >
                <View 
                    className={clsx( "mt-4", { 
                        "opacity-50": isDateOnPast 
                    })}
                >
                    { habits.possibleHabits?.length > 0 ? 
                        habits.possibleHabits.map(habit => (
                            <Checkbox 
                                key={ habit.id }
                                title={habit.title}
                                checked={ habits.completedHabits.includes(habit.id) }
                                onPress={() => handleToggleHabit(habit.id) }
                                disabled={ isDateOnPast }
                            />
                        ))
                    : (
                        <HabitsEmpty/>
                    )}
                </View>
                { isDateOnPast && (
                    <Text className="text-white mt-10 text-center">
                        Você não pode editar hábitos com uma data passada.
                    </Text>
                ) }
            </ScrollView>
        </View>
    )
} 