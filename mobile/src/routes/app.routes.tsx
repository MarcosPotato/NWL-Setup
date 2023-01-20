import { createNativeStackNavigator } from '@react-navigation/native-stack'

const { Navigator, Screen } = createNativeStackNavigator()

import { Home } from '../screens/Home'
import { New } from '../screens/New'
import { Habits } from '../screens/Habits'


export const AppRoutes: React.FC = () => {
    return(
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen 
                name='home'
                component={ Home }
            />
            <Screen 
                name='new'
                component={ New }
            />
            <Screen 
                name='habit'
                component={ Habits }
            />
        </Navigator>
    )
}