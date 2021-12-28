import { StyleSheet } from 'react-native'
import AppStrings from '../1_Constants/AppStrings'

export default StyleSheet.create({
    mainContainer: {
        flex: 1,        
        backgroundColor: AppStrings.colors.secondary,
        alignItems: "center"
    },
    button: {
        flex: 1,
        // paddingHorizontal: 500,
        // margin:250,c
        color: '#fff',
        backgroundColor: 'green',
        // alignItems: 'center',
        // justifyContent: 'center',
        height: 400,        
        // padding: 10,       
        // margin:10 
    },
    header: {
        backgroundColor: AppStrings.colors.primary
    }
})