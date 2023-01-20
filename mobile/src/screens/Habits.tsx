import { View, Text, ScrollView } from "react-native"
import { useRoute } from '@react-navigation/native'
import { BackButton } from "../components/BackButton"
import dayjs from "dayjs"
import { ProgressBar } from "../components/ProgressBar"
import { Checkbox } from "../components/Checkbox"

interface HabitsParams{
    date: string
}

export const Habits: React.FC = () => {
    
    const routes = useRoute()
    const { date } = routes.params as HabitsParams

    const parsedDate = dayjs(date)
    const dayOfWeek = parsedDate.format('dddd')
    const dayAndMonth = parsedDate.format("DD/MM")

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <BackButton />
            <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
                { dayOfWeek }
            </Text>
            <Text className="text-white font-extrabold text-3xl">
                { dayAndMonth  }
            </Text>
            <ProgressBar progress={75}/>
            <ScrollView
                showsVerticalScrollIndicator={ false }
                contentContainerStyle={{ paddingBottom: 100 }}
                className="mt-2"
            >
                <View className="mt-4">
                    <Checkbox 
                        title="Beber 2L de água"
                        checked={ false }
                    />
                    <Checkbox 
                        title="Beber 3L de água"
                        checked
                    />
                    <Checkbox 
                        title="Caminhar"
                        checked
                    />
                </View>
            </ScrollView>
        </View>
    )
} 