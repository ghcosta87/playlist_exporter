var expPath = ''
var originalName = ''
var newName = ''

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

export async function formatData(myObj) {
    let parser = myObj[0]
    var output
    console.log('original uri: ' + parser.uri)
    await readFile(parser.uri, parser.name).then((value) => {
        console.log('value from read file: ' + value)
        if (value) output = expPath
        else {
            output = 'formatData error...'
            console.log(err.message)
            throw new Error('error reading the file')
        }
    }).catch((err) => {
        console.log(err.message)
        throw new Error('error reading the file')
    })
    return output
}

async function readFile(target, fileName) {
    var returnValue
    expPath = target
    originalName = fileName
    var fsRead = require('react-native-fs')
    try {
        await fsRead.readFile(target, 'utf8')
            .then(async (result) => {
                await convertFile(result).then(
                    value => returnValue = value)
            })
            .catch((err) => {
                returnValue = false
                console.log(err)
            })
    } catch (err) {
    }
    return returnValue
}

const getRule = (line) => {
    line = line.replace('', ' ')
    let splitter = line.split('')
    let ruleControl = false
    let splitterFilter = splitter.filter((value) => {
        if (value == '<') {
            ruleControl = false
        }
        if (value == ' ') return
        if (ruleControl) return value 
        if (value == '>') {
            ruleControl = true
        }      
    })
    let output = splitterFilter.join('')
    if (output.search(',')) return output.split(',')
    return output
}

async function convertFile(inputData) {
    var returnValue
    let newPath = '/sdcard' //filePath.replace('data/user/0/', 'storage/emulated/0/Android/data/')
    
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
    let _FILE_NAME = newPath + '/' + dateString + '_' + timeString + '.yap'
    newName = dateString + '_' + timeString + '.yap'

    let inputArray = inputData.split('\n')
    console.log(`inputArray: \n${inputArray}`)
    const ruleLine = (critearia) => {
        return inputArray.filter((value) => {
            let myString = value.toString()
            if (myString.search(critearia) > 0) {
                return true
            }
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
    mainObj.playlists = [playlistObj]
    var outputArray = [mainObj]

    const fsWrite = require('react-native-fs')
    await fsWrite.writeFile(_FILE_NAME, JSON.stringify(outputArray), 'utf8').then((success) => {
        expPath=_FILE_NAME
        returnValue = true
    })
        .catch((err) => {
            console.log(err.message)
            returnValue = false
        })
    fsWrite.writeFile(_FILE_NAME.replace('yap', 'json'), JSON.stringify(outputArray), 'utf8').then((success) => { console.log('FILE WRITTEN') })
        .catch((err) => {})
    return returnValue
}