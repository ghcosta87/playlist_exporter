import { Alert, Linking } from 'react-native'

export function testWrite() {
    // require the module
    var RNFS = require('react-native-fs');

    // create a path you want to write to
    // :warning: on iOS, you cannot write into `RNFS.MainBundlePath`,
    // but `RNFS.DocumentDirectoryPath` exists on both platforms and is writable
    var path = RNFS.DocumentDirectoryPath + '/test.txt';
    path = '/sdcard/text.txt'
    // path = '/storage/emulated/0/Android/data/com.playlistexporter/files/test.txt'
    // /data/user/
    // write the file
    //documentpath = /data/user/0/com.playlistexporter/files
    //trocar por  /storage/emulated/0/Android/data/com.playlistexporter/files
    RNFS.writeFile(path, 'Lorem ipsum dolor sit amet', 'utf8')
        .then((success) => {
            console.log(path)
            console.log('FILE WRITTEN!');
        })
        .catch((err) => {
            console.log(err.message);
        });
}

function fJ(jsonObj) {
    return JSON.stringify(jsonObj)
}

function validateFileName(fileName) {
    if (fileName != '' || fileName != undefined || fileName != null) return false
    return true
}

export function importFile(fileAdress) {
    if (validateFileName(fileAdress)) {
        console.log('file received')
        console.log(fileAdress)
    } else console.log('nothing received')

}

export function operationComplete() {

}

var expPath = ''
var originalName = ''
var newName = ''

export async function formatData(myObj) {
    console.log('input json: ' + fJ(myObj))
    let parser = myObj[0]
    console.log(parser.name)
    console.log(parser.uri)
    console.log(parser.type)
    console.log(parser.size)
    var output
    await readFile(parser.uri, parser.name).then((value) => {
        console.log(value)
        if (value) output = expPath
        else output = 'error ...'
    })
    return output
}

async function readFile(target, fileName) {
    console.log('original target file >> ' + target)
    var returnValue
    expPath = target
    originalName = fileName
    var fsRead = require('react-native-fs')
    try {
        await fsRead.readFile(target, 'utf8')
            .then(async (result) => {
                await convertFile(result, fileName, fsRead.DocumentDirectoryPath).then(
                    value => returnValue = value)
            })
            .catch((err) => {
                returnValue = false
                console.log(err)
            })
        // return data
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return returnValue
}

const getRule = (line) => {
    line = line.replace('', ' ')
    let splitter = line.split('')
    // console.log('line:')
    // console.log(line)
    let ruleControl = false
    let splitterFilter = splitter.filter((value) => {
        if (value == '<') {
            ruleControl = false
        }
        if (value == ' ') return
        if (ruleControl) return value  //stringAssembler.append(value)
        if (value == '>') {
            ruleControl = true
        }
        // if(ruleAst==2)ruleControl=true        
    })
    let output = splitterFilter.join('')
    if (output.search(',')) return output.split(',')
    return output
}

async function convertFile(inputData, inputName, filePath) {
    var returnValue
    //documentpath = /data/user/0/com.playlistexporter/files
    //trocar por  /storage/emulated/0/Android/data/com.playlistexporter/files
    let newPath = filePath.replace('data/user/0/', 'storage/emulated/0/Android/data/')
    // newPath = '/sdcard'
    // let newPath=filePath.replace('data/user/0/com.playlistexporter','storage/1F5B-9B27/Android/data/org.leetzone.android.yatsewidgetfree')
    //  default values to lookup fo
    const _KODI_PLAYLIST_NAME = '<name>'
    const _KODI_PLAYLIST_VALUE = '<value>'

    //  default values not available in kodi playlist
    let _IS_SMART = false
    let _OFFLINE_ENABLE = false
    let _AUTO_SINC_ENABLE = false
    let _PLAYLIST_RULE = 'genre'

    //  set the name file to match Yatse standard
    let creationTime = new Date()
    let dateString = creationTime.toLocaleDateString().replace(' ', '_').replace('/', '').replace('/', '')
    let timeString = creationTime.toLocaleTimeString().replace(' ', '_').replace(':', '').replace(':', '')
    // let _FILE_NAME = filePath.replace(inputName,'') + dateString + '_' + timeString + '.yap'
    let _FILE_NAME = newPath + '/' + dateString + '_' + timeString + '.yap'
    newName = '/' + dateString + '_' + timeString + '.yap'
    // _FILE_NAME=expPath.replace(originalName,dateString + '_' + timeString + '.yap')


    //  sort the values from the input file
    let inputArray = inputData.split('\n')
    console.log(`inputArray: \n${inputArray}`)
    const ruleLine = (critearia) => {
        return inputArray.filter((value) => {
            let myString = value.toString()
            // console.log('inside filter >')
            // console.log(myString)
            if (myString.search(critearia) > 0) {
                // console.log('value found')
                return true
            }
            // console.log('value not found')
            return false
        })
    }

    let _PLAYLIST_NAME = getRule(ruleLine(_KODI_PLAYLIST_NAME).toString()).toString()
    let _PLAYLIST_CRITERIA = getRule(ruleLine(_KODI_PLAYLIST_VALUE).toString())

    console.log(`_PLAYLIST_CRITERIA: ${_PLAYLIST_CRITERIA}`)
    console.log(`_PLAYLIST_NAME: ${_PLAYLIST_NAME}`)

    //  set objects and array values for the output file
    //output file for yatse
    var mediaType = 13 //13 ou 8 ??
    switch (mediaType) {
        case 8:
            break
        case 13:
            break
    }

    var playlistObj = {
        "type": 0,
        "contentType": 1,
        "mediaType": mediaType,
        "externalId": "",
        "externalData": "",
        "title": _PLAYLIST_NAME,
        "thumbnail": "",
        "autoOffline": _OFFLINE_ENABLE,
        "autoSync": _AUTO_SINC_ENABLE,
        "smartFilter": '',
        "isFavorite": false
    }
    let smartFilter = {
        "name": _PLAYLIST_NAME,
        "type": 13,
        "match": "all",
        "rules": [{
            "field": _PLAYLIST_RULE,
            "operator": "equals",
            "values": _PLAYLIST_CRITERIA
        }],
        "sort": [{ "none": true }],
        "limit": 0
    }

    playlistObj.smartFilter = JSON.stringify(smartFilter)

    // function getAllMusics() {
    //     return {}
    // }
    // if (_IS_SMART) playlistObj.playlist_content = []
    /*
    quando for implementar a playlist por entradas manuais
    é preciso seguir as etapas:
    1: gravar o caminho para o arquivo
    2: extrair o caminho e o nome do arquivo
    3: pegar o id da música:
        *()=>sql search table -> song -> coluna id where filename= nome do arquivo
    4: pegar todos os dados possiveis da tabela
    5: gravar dados na array de objetos
    
    */
    var mainObj = new Object
    mainObj.host_uuid = "d80c8ea8-9221-4633-bcdb-b75db1b5cc17"
    mainObj.playlists = [playlistObj]// [JSON.stringify(playlistObj)]
    var outputArray = [mainObj]

    // let test = outputArray.join()

    //  write the output file
    const fsWrite = require('react-native-fs')
    await fsWrite.writeFile(_FILE_NAME, JSON.stringify(outputArray), 'utf8').then((success) => {
        console.log('FILE WRITTEN at: ' + _FILE_NAME)
        // openUrl(newPath)
        // url=expPath.replace(originalName,newName)        
        // expPath = newPath.replace(originalName, newName)
        expPath=_FILE_NAME
        console.log('url to open [backend] >>> ' + expPath)
        returnValue = true
    })
        .catch((err) => {
            console.log(err.message)
            returnValue = false
        })
    fsWrite.writeFile(_FILE_NAME.replace('yap', 'json'), JSON.stringify(outputArray), 'utf8').then((success) => { console.log('FILE WRITTEN') })
        .catch((err) => { console.log(err.message) })

    // const openUrl =async (url) => {
    // // Checking if the link is supported for links with custom URL scheme.
    // url=expPath.replace(originalName,dateString + '_' + timeString + '.yap')
    // console.log('url >>> '+url)
    // console.log('url >>> content://com.android.externalstorage.documents/document/primary%3A122721_113624.yap')
    // const supported = await Linking.canOpenURL(url);
    // await Linking.openURL(url);
    // if (supported) {
    //     // Opening the link with some app, if the URL scheme is "http" the web link should be opened
    //     // by some browser in the mobile
    //     await Linking.openURL(url);
    // } else {
    //     Alert.alert(`Don't know how to open this URL: ${url}`);
    // }
    // }
    console.log('end of covnertFile()')
    return returnValue
}


// RNFS.writeFile(path, 'Lorem ipsum dolor sit amet', 'utf8')
//   .then((success) => {
//     console.log('FILE WRITTEN!');
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });