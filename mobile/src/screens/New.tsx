import { useState } from "react"
import { View, Text, ScrollView, TextInput, TouchableOpacity } from "react-native"

import { BackButton } from "../components/BackButton"
import { Checkbox } from "../components/Checkbox"

import { Feather } from '@expo/vector-icons'
import colors from "tailwindcss/colors"

const availableWeekDays = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado-feira'
]

export const New: React.FC = () => {

    const [weekDays, setWeekDays] = useState<number[]>([])

    const handleToggleWeeday = (weekDayIndex: number) => {
        setWeekDays(prev => {
            if(prev.includes(weekDayIndex)){
                return prev.filter(weekDay => weekDay !== weekDayIndex)
            }

            return [...prev, weekDayIndex]
        })
    }

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView 
                showsVerticalScrollIndicator={ false }
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <BackButton />
                <Text className="mt-6 text-white font-extrabold text-3xl">
                    Criar hábito
                </Text>
                <Text className="mt-6 text-white font-semibold text-base">
                    Qual o seu comprometimento
                </Text>
                <TextInput 
                    className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
                    placeholder="Ex: Exercícios, dormir bem, etc..."
                    placeholderTextColor={colors.zinc["400"]}
                />
                <Text className="font-semibold mt-4 mb-3 text-white text-base">
                    Qual é a recorrência?
                </Text>
                { availableWeekDays.map((day, index) => (
                    <Checkbox 
                        key={day}
                        checked={ weekDays.includes(index) }
                        title={ day }
                        onPress={() => handleToggleWeeday(index) }
                    />
                )) }
                <TouchableOpacity
                    activeOpacity={0.7}
                    className="flex-row w-full h-14 items-center justify-center bg-green-600 rounded-md mt-6"
                >
                    <Feather
                        name="check"
                        size={20}
                        color={ colors.white }
                    />
                    <Text className="font-semibold text-base text-white ml-2">
                        Confirmar
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
} 