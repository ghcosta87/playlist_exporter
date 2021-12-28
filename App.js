//  standard react imports
import React, { Component } from "react"
import { Linking, Alert, Text, View, Button, Image, ToastAndroid, PermissionsAndroid, TouchableHighlight, StyleSheet } from "react-native"

//  installed react modules
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import DocumentPicker from 'react-native-document-picker'

//  personal front end imports
import ContainerStyle from './0_Styles/ContainerStyle'
import ImageStyle from './0_Styles/ImageStyle'
import TextStyle from './0_Styles/TextStyle'
import AppStrings from './1_Constants/AppStrings'
import ImgHeader from "./2_Files/ImgHeader"
import AdView from './_FrontEnd/AdView'

//  personal back end imports
import { getFile } from './_BackEnd/FileHandler'

const requestStoragePermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: "Cool Photo App Camera Permission",
        message:
          "Cool Photo App needs access to your camera " +
          "so you can take awesome pictures.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      })
    let test = (granted === PermissionsAndroid.RESULTS.GRANTED)
    boolTest(test)
  } catch (err) {
    console.warn(err);
  }
}

const Stack = createNativeStackNavigator();

function HomeScreen({ route, navigation }) {
  const { itemId, myFunc } = route.params;
  return (
    <View style={ContainerStyle.mainContainer}>
      <View style={{ flex: 1, margin: 20 }}>
        <Button
          style={ContainerStyle.button}
          title={'open document picker'}
          onPress={async () => {
            let test
            await getFile(myFunc)
              .then((value) => {
                test = true
                console.log('open with success')
              })
              .catch((err) => {
                test = false
                console.log('error on getFile in App.js: ' + err.message)
              })

            if (!test)
              ToastAndroid.show(AppStrings.errors.fileNotFound, ToastAndroid.SHORT);
          }}
        />
        <View style={{
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Text> </Text>
        </View>
        <Button
          style={ContainerStyle.button}
          title={'PERMISSIONS.READ_EXTERNAL_STORAGE'}
          onPress={requestStoragePermission}
        />
        <View style={{
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Text> </Text>
        </View>
        <Button
          style={ContainerStyle.button}
          title={'next screen'}
          onPress={() => { navigation.navigate('settings') }}
        />
      </View>
    </View>
  );
}

function SettingsScreen({ navigation }) {
  return (
    <View style={ContainerStyle.mainContainer}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={TextStyle.title}>details page</Text>
        <Button
          style={ContainerStyle.button}
          title={'back to last screen'}
          //  onPress={()=>{navigation.navigate('Home')}}
          onPress={() => { navigation.goBack() }}
        />
      </View>
    </View>
  );
}

function SettingsButton({ navigation }) {
  return (
    <TouchableHighlight
      activeOpacity={0.6}
      underlayColor="#DDDDDD" // need to paint the image no the view
      onPress={() => {
        navigation.navigate('settings')
      }}>
      <View style={{ flex: 1 }}>
        <Image
          style={ImageStyle.tinyLogo}
          source={require('./2_Files/sliders.png')}
        // source={require(settingLogo)}
        />
      </View>
    </TouchableHighlight>
  )
}

export default class Application extends Component {
  settingLogo = ImgHeader.logos.settings // not implemented ainda

  async openDocumentFile() {
    try {
      return await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles]
      })
    } catch (err) {
      if (DocumentPicker.isCancel(err)) { }
      else throw err
    }
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="home" component={HomeScreen}
            initialParams={{
              itemId: 100,
              myFunc: this.openDocumentFile,
            }}
            options={({ navigation }) => ({
              title: 'Playlist Exporter',
              headerStyle: ContainerStyle.header,
              headerRight: () => SettingsButton({ navigation }),
            })}
          />
          <Stack.Screen name="settings" component={SettingsScreen}
            options={{
              headerStyle: ContainerStyle.header,
              title: 'App Settings'
            }} />
        </Stack.Navigator>
        <AdView />
      </NavigationContainer>
    )
  }
}