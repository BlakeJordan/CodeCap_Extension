///////////////////////////////////////////////////////////////////////////////
//                                  Messages                                 //
///////////////////////////////////////////////////////////////////////////////



chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message == "CROPPED_IMAGE") {
          overlay(false)
          selection = null
          var t = request.croppedImage
          if (t){
          var link = document.createElement('a')
          link.download = filename('png')
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
    
    var save = (image, format) => {
        getTextFromBase64Image(image.split(',')[1]);
       // var link = document.createElement('a')
        //link.download = filename(format)
        //link.href = image
        //link.click()
  
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
  
    
      // Todo: screen shot stuff
      // Todo: convert image to base 64
  
      var testingBase64 = "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";
      //executeLambdaFunction(testingBase64)