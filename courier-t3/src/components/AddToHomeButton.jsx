import { useState, useEffect } from 'react'

const AddToHomeButton = () => {
  const [prompt, setPrompt] = useState(null)

  let platform = {}
  let showNativePrompt = false

  function checkPlatform() {
    //taken from: https://github.com/as-ideas/add-to-homescreen-react/blob/master/src/AddToHomeScreen.js
    // browser info and capability
    let userAgent = window.navigator.userAgent
    console.log({ userAgent })
    // doLog('checking platform - found user agent: ' + userAgent)

    platform.isIDevice = /iphone|ipod|ipad/i.test(userAgent)
    platform.isSamsung = /Samsung/i.test(userAgent)
    platform.isFireFox = /Firefox/i.test(userAgent)
    platform.isOpera = /opr/i.test(userAgent)
    platform.isEdge = /edg/i.test(userAgent)

    // Opera & FireFox only Trigger on Android
    if (platform.isFireFox) {
      platform.isFireFox = /android/i.test(userAgent)
    }

    if (platform.isOpera) {
      platform.isOpera = /android/i.test(userAgent)
    }

    platform.isChromium = 'onbeforeinstallprompt' in window
    platform.isInWebAppiOS = window.navigator.standalone === true
    platform.isInWebAppChrome = window.matchMedia(
      '(display-mode: standalone)'
    ).matches
    platform.isMobileSafari =
      platform.isIDevice &&
      userAgent.indexOf('Safari') > -1 &&
      userAgent.indexOf('CriOS') < 0
    platform.isStandalone = platform.isInWebAppiOS || platform.isInWebAppChrome
    platform.isiPad = platform.isMobileSafari && userAgent.indexOf('iPad') > -1
    platform.isiPhone =
      platform.isMobileSafari && userAgent.indexOf('iPad') === -1
    platform.isCompatible =
      platform.isChromium ||
      platform.isMobileSafari ||
      platform.isSamsung ||
      platform.isFireFox ||
      platform.isOpera

    console.log({ platform })
  }

  useEffect(() => {
    checkPlatform()
    const handler = (event) => {
      console.log(event)
      setPrompt(event)
    }

    // window.addEventListener('beforeinstallprompt', handler)

    if ('onbeforeinstallprompt' in window) {
      // console.log('window listener')
      // doLog('add beforeinstallprompt listener')
      window.addEventListener('beforeinstallprompt', handler)
      showNativePrompt = true
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      // console.log('beforeinstallprompt removed')
    }
  })

  const handleAddToHomeScreenClick = () => {
    prompt.prompt()

    prompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('The app was added to the home screen')
      } else {
        console.log('The app was not added to the home screen')
      }
    })
  }

  return <button className="btn bg-red-600">Download WebApp</button>
}

export default AddToHomeButton
