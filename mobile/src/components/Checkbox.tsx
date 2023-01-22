import { TouchableOpacity, View, Text, TouchableOpacityProps } from "react-native"
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated"
import { Feather } from '@expo/vector-icons'
import colors from "tailwindcss/colors"

interface CheckboxProps extends TouchableOpacityProps{
    checked?: boolean
    title: string
}

export const Checkbox: React.FC<CheckboxProps> = ({ title, checked = false, ...rest }) => {
    return (
        <TouchableOpacity 
            { ...rest }
            activeOpacity={0.7}
            className="flex-row mb-2 items-center"
        >
            { checked ? (
                <Animated.View 
                    className="h-8 w-8 bg-green-500 rounded-lg items-center justify-center"
                    entering={ ZoomIn }
                    exiting={ ZoomOut }
                >
                    <Feather name="check" size={20} color={ colors.white }/>
                </Animated.View>
            ): (
                <View className="h-8 w-8 bg-zinc-800 rounded-lg"/>
            ) }

            <Text className="text-white text-base ml-3 font-semibold">
                { title }
            </Text>
        </TouchableOpacity>
    )
} 