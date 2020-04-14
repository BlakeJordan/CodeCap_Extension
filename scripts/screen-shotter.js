chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
      if (request.message == "CROPPED_IMAGE") {
        overlay(false)
        selection = null
        var t = request.croppedImage
        if (t){
          var link = document.createElement('a')
          //link.download = filename('png')
          link.href = t
          link.click()
          getTextFromBase64Image(t.split(',')[1]);
        }
      }
  }
);
  
console.log('Hi from screen-shotter.js')
var jcrop, selection
var overlay = ((active) => (state) => {
  active = typeof state === 'boolean' ? state : state === null ? active : !active
  $('.jcrop-holder')[active ? 'show' : 'hide']()
  chrome.runtime.sendMessage({message: 'active', active})
})(false)

var image = (done) => {
  var image = new Image()
  image.id = 'fake-image'
  image.src = chrome.runtime.getURL('media/pixel.png')
  image.onload = () => { 
        $('body').append(image)
        done()
      }
}
  
var init = (done) => {
  $('#fake-image').Jcrop({
    bgColor: 'none',
    onSelect: (e) => {
      selection = e
      capture()
    },
    onChange: (e) => {
      selection = e
    },
    onRelease: (e) => {
      setTimeout(() => {
        selection = null
      }, 100)
    }
  }, function ready () {
    jcrop = this;
    $('.jcrop-hline, .jcrop-vline').css({
      backgroundImage: `url(${chrome.runtime.getURL('/media/Jcrop.gif')})`
    })
    if (selection) {
      jcrop.setSelect([
        selection.left, selection.top, selection.left + selection.width, selection.top + selection.height
      ])
    }

    done && done()
  })
}
  
var capture  = (force) => {
  if (selection){
    jcrop.release()
    
    setTimeout(() => {
      chrome.runtime.sendMessage({
        message: 'capture', area: selection, dpr: devicePixelRatio
      }, function (sendResponse) {
        overlay(false)
        selection = null
        //save(sendResponse, 'png')
      })
    }, 50)
  }     
}
        
var filename = (format) => {
  var pad = (n) => (n = n + '', n.length >= 2 ? n : `0${n}`)
  var ext = (format) => format === 'jpeg' ? 'jpg' : format === 'png' ? 'png' : 'png'
  var timestamp = (now) =>
    [pad(now.getFullYear()), pad(now.getMonth() + 1), pad(now.getDate())].join('-')
    + ' - ' +
    [pad(now.getHours()), pad(now.getMinutes()), pad(now.getSeconds())].join('-')
  return `Screenshot Capture - ${timestamp(new Date())}.${ext(format)}`
}

  
window.addEventListener('resize', ((timeout) => () => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    jcrop.destroy()
    init(() => overlay(null))
  }, 100)
})())      
  
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'init') {
    sendResponse({}) // prevent re-injecting

    if (!jcrop) {
      image(() => init(() => {
        overlay()
        capture()
      }))
    }
    else {
      overlay()
      capture(true)
    }
  }
  return true
})  
  