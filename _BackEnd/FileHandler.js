import FileViewer from 'react-native-file-viewer'
import { formatData } from './FileFormat'

export async function getFile(func) {
    let myObj = await func()
    var output
    await formatData(myObj).then((value) => {
        console.log('url to open [frontend] >>> ' + value)
        openUrl(value).then(value => output = value).catch((err) => {
            output = false
            console.log(err.message)
        })
    }).catch((err) => {
        console.log(err.message)
    })
    return output
}

const openUrl = async (url) => {
    FileViewer.open(url, { showOpenWithDialog: true })
    .then(() => {
      return true
    })
    .catch(error => {
      return false
    })
}



