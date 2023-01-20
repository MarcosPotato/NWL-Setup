import { View, Text, ScrollView } from "react-native"
import { useNavigation } from '@react-navigation/native'

import { generateDatesFromYearBegin } from "../utils/generateDatesFromYearBegin"

import { HabitDay } from "../components/HabitDay"
import { Header } from "../components/Header"

import { DAY_SIZE } from "../components/HabitDay"

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"]
const datesFromYearStart = generateDatesFromYearBegin()

const minimunSumaryDatesSizes = 18 * 5
const amountOfDaysToFill = minimunSumaryDatesSizes - datesFromYearStart.length

export const Home: React.FC = () => {

    const { navigate } = useNavigation()

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
                    { datesFromYearStart.map(date => (
                        <HabitDay 
                            key={date.toISOString()} 
                            onPress={() => navigate("habit", { date: date.toISOString() })}
                        />
                    )) }
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