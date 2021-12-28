import React, { Component, useCallback } from "react"
import { Alert, Linking, Text, View, Button, ToastAndroid, PermissionsAndroid } from "react-native"
import DocumentPicker from 'react-native-document-picker'

import ContainerStyle from './0_Styles/ContainerStyle'
import TextStyle from './0_Styles/TextStyle'
import AppStrings from './1_Constants/AppStrings'

import { importFile, operationComplete, formatData, testWrite } from './_BackEnd/logic'

function boolTest(value) {
  if (value) console.log("permission granted")
  else console.log(" permission denied")
}

const supportedURL = 'content://com.android.externalstorage.documents/document/primary%3A122721_113624.yap'//'/sdcard/122721_113624.yap'//"https://google.com";

const unsupportedURL = "slack://open?team=123456";

const OpenURLButton = async () => {
  // Checking if the link is supported for links with custom URL scheme.
  const supported = await Linking.canOpenURL(supportedURL);

  if (supported) {
    // Opening the link with some app, if the URL scheme is "http" the web link should be opened
    // by some browser in the mobile
    await Linking.openURL(supportedURL);
  } else {
    Alert.alert(`Don't know how to open this URL: ${supportedURL}`);
  }
}

const openUrl = async (url) => {
  // Checking if the link is supported for links with custom URL scheme.
  const supported = await Linking.canOpenURL(url);

  if (supported) {
    // Opening the link with some app, if the URL scheme is "http" the web link should be opened
    // by some browser in the mobile
    await Linking.openURL(url);
  } else {
    Alert.alert(`Don't know how to open this URL: ${url}`);
  }
}

const requestManageDocumentsPermission = async () => {
  // try {
  //   const granted = await PermissionsAndroid.request(
  //     PermissionsAndroid.PERMISSIONS.MANAGE_DOCUMENTS,
  //     {
  //       title: "Cool Photo App Camera Permission",
  //       message:
  //         "Cool Photo App needs access to your camera " +
  //         "so you can take awesome pictures.",
  //       buttonNeutral: "Ask Me Later",
  //       buttonNegative: "Cancel",
  //       buttonPositive: "OK"
  //     })
  //     let test=(granted === PermissionsAndroid.RESULTS.GRANTED)
  //   boolTest(test)
  // } catch (err) {
  //   console.warn(err);
  // }
}

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



const buttonPressed = () => {
  console.log('button pressed')
  importFile()
  ToastAndroid.show("Button pressed!", ToastAndroid.SHORT)
}

const errorHandler = (func, msg) => {
  var output
  try {
    output = func()
  } catch (err) {
    console.log(err)
    console.log('from: ' + msg)
    // errorFunc()
    return null
  }
  return output
}

const getFile = async (func) => {
  let myObj = await func()
  // let string
  // let newUrl =
   await formatData(myObj).then((value) => {
      console.log('url to open [frontend] >>> '+value)
      openUrl(value)
    }).catch((err) => {
      console.log(err)
    })
  // console.log('url to open [frontend] >>> '+newUrl)
  // if(newUrl!='')
}

export default class Application extends Component {

  async openDocumentFile() {
    try {
      return await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles]
      })
    } catch (err) {
      if (DocumentPicker.isCancel(err)) { }
      else throw err
    }
    // var output = pick().then((result) => console.log('output: ' + JSON.stringify(output)))
    // return output  
  }

  render() {
    return (
      <View style={ContainerStyle.mainContainer}>
        <Text style={TextStyle.title}>{AppStrings._appTitle}</Text>
        <Button
          style={ContainerStyle.button}
          title={'button test'}
          onPress={buttonPressed}
        />
        <Button
          style={ContainerStyle.button}
          title={'open document picker'}
          onPress={() => { getFile(this.openDocumentFile) }}
        />
        <Button
          style={ContainerStyle.button}
          title={'PERMISSIONS.READ_EXTERNAL_STORAGE'}
          onPress={requestStoragePermission}
        />
        <Button
          style={ContainerStyle.button}
          title={'PERMISSIONS.MANAGE_DOCUMENTS'}
          onPress={requestManageDocumentsPermission}
        />
        <Button
          style={ContainerStyle.button}
          title={'TEST WRITE PERMISSION'}
          onPress={testWrite}
        />
        <Button
          style={ContainerStyle.button}
          title={'TEST OPEN FILE'}
          onPress={OpenURLButton}
        />
      </View>
    )
  }
}