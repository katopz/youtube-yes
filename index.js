window.isDebug = window.location.hash === '#debug'
const println = (...arguments) => {
  window.isDebug && console.log(...arguments)
}

var s = document.createElement('script')
s.src = chrome.runtime.getURL('script.js')
s.onload = function () {
  this.remove()
}
;(document.head || document.documentElement).appendChild(s)

var clickId
const confirm = () => {
  // Check for yes existing button
  const button = Array.from(document.querySelectorAll('#button')).find((e) => e.attributes['aria-label'] && e.attributes['aria-label'].nodeValue.toUpperCase() === 'YES')
  if (button) {
    // Lazy click later prevent rapid call
    clearTimeout(clickId)
    clickId = setTimeout(() => {
      button.click()
    }, 100)
  }
}

// Select the node that will be observed for mutations
const targetNode = document.body

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true }

// Callback function to execute when mutations are observed
const callback = function (mutationsList, _observer) {
  let isDirty = false
  for (let mutation of mutationsList) {
    if (mutation.type === 'childList' || mutation.type === 'attributes') {
      isDirty = true
    }
  }

  isDirty && confirm()
}

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback)

// Start observing the target node for configured mutations
observer.observe(targetNode, config)

// Is active
let moveId
let isActive = false
const notMove = () => {
  isActive = false
}

let isPIP = false

const active = () => {
  isActive = true

  clearTimeout(moveId)
  moveId = setTimeout(notMove, 1000)
}

document.body.addEventListener('mousemove', active)
document.body.addEventListener('mouseover', active)
document.body.addEventListener('mousedown', active)
document.body.addEventListener('keydown', active)
document.body.addEventListener('scroll', active)
document.body.addEventListener('touchstart', active)

document.addEventListener('visibilitychange', function () {
  println('visibilitychange...', document.visibilityState)
  if (document.visibilityState === 'visible') {
    confirm()
  } else {
    // do something when not visible
  }
})

const onPause = (e) => {
  println('pause...:', isActive, isPIP)
  // Hide anyway
  confirm()

  // Backdrop?
  const isBackDrop = document.querySelector('body > tp-yt-iron-overlay-backdrop')
  if (isBackDrop) {
    // Play anyway
    e.target && e.target.play()
    return
  }

  // Active?
  if (isActive) return

  // plan B
  println('play!!')
  e.target && e.target.play()

  // plan C
  const video = document.querySelector('video')
  if (video) {
    video.play()
  }
}

const onEnterPip = (e) => {
  println('enter pip...')
  isPIP = true
}

const onLeavePip = (e) => {
  println('leave pip...')
  isPIP = false
  confirm()
}

const watch = () => {
  println('watch...')

  // Alway play
  const video = document.querySelector('video')
  video.removeEventListener('pause', onPause)
  video.addEventListener('pause', onPause)

  // PIP
  video.addEventListener('enterpictureinpicture', onEnterPip, false)
  video.addEventListener('leavepictureinpicture', onLeavePip, false)

  // Watch for human pause
  moveId = setTimeout(notMove, 1000)
}

const initVideo = () => {
  println('initVideo...')

  // On homepage?
  if (window.location.pathname !== '/watch') {
    setTimeout(initVideo, 1000)
    return
  }

  // Video ready?
  const video = document.querySelector('video')
  if (!video) {
    setTimeout(initVideo, 1000)
    return
  }

  watch()
}

// Watch for dom change
let oldHref = document.location.href

window.onload = function () {
  const bodyList = document.querySelector('body')

  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (_mutation) {
      if (oldHref != document.location.href) {
        oldHref = document.location.href
        initVideo()
      }
    })
  })

  const config = {
    childList: true,
    subtree: true
  }

  observer.observe(bodyList, config)
  initVideo()
}
