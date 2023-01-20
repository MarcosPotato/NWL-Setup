import { useEffect, useState } from "react"
import { View, Text, ScrollView, Alert } from "react-native"
import { useNavigation } from '@react-navigation/native'

import { api } from "../lib/axios"

import { generateDatesFromYearBegin } from "../utils/generateDatesFromYearBegin"

import { HabitDay } from "../components/HabitDay"
import { Header } from "../components/Header"

import { DAY_SIZE } from "../components/HabitDay"
import { Loading } from "../components/Loading"
import dayjs from "dayjs"

interface Summary{
    id: string
    date: string
    amount: number
    completed: number
}

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"]
const datesFromYearStart = generateDatesFromYearBegin()

const minimunSumaryDatesSizes = 18 * 5
const amountOfDaysToFill = minimunSumaryDatesSizes - datesFromYearStart.length

export const Home: React.FC = () => {

    const { navigate } = useNavigation()

    const [summary, setSummary] = useState<Summary[]>([])
    const [loading, setLoading] = useState(true)

    const fetchData = async() => {
        setLoading(true)
        try {
            const response = await api.get("/summary")
            setSummary(response.data)

        } catch (error: any) {
            console.log(error)
            Alert.alert("Ops!", "Não foi possível carregar o sumário de hábitos.")
        } finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    },[])

    if(loading){
        return <Loading />
    }

    return (
        <View className="bg-background flex-1 px-8 pt-16">
            <Header/>
            <View className="flex-row mt-6 mb-2">
                { weekDays.map((day, index) => (
                    <Text 
                        key={`${day}-${index}`}
                        className="text-zinc-400 text-xl font-bold text-center mx-1"
                        style={{ width: DAY_SIZE }}
                    >
                        { day }
                    </Text>
                )) }
            </View>
            <ScrollView 
                showsVerticalScrollIndicator={ false }
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <View className="flex-row flex-wrap">
                    { datesFromYearStart.map(date => {
                        const dayWithHabits = summary.find(day => dayjs(date).isSame(day.date, "day"))

                        return (
                            <HabitDay 
                                key={date.toISOString()} 
                                date={ date }
                                amount={ dayWithHabits?.amount }
                                completed={ dayWithHabits?.completed }
                                onPress={() => navigate("habit", { date: date.toISOString() })}
                            />
                        )
                    }) }
                    { amountOfDaysToFill > 0 && (
                        Array.from({ length: amountOfDaysToFill }).map((_, index) => (
                            <View
                                key={ index } 
                                className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                                style={{ 
                                    width: DAY_SIZE,
                                    height: DAY_SIZE
                                }}
                            />
                        )) 
                    )}
                </View>
            </ScrollView>
        </View>
    )
}