var s = document.createElement('script')
s.src = chrome.runtime.getURL('script.js')
s.onload = function () {
  this.remove()
}
;(document.head || document.documentElement).appendChild(s)

const isBlock = () => {
  // Check for existing dialog
  const dialog = Array.from(document.querySelectorAll('paper-dialog'))[0]
  if (!dialog) return false
  if (getComputedStyle(dialog).display === 'none') return false

  return true
}

const confirmIfNeed = () => {
  if (!isBlock()) return

  // Check for yes existing button
  const button = Array.from(document.querySelectorAll('paper-button')).find((e) => e.attributes['aria-label'] && e.attributes['aria-label'].nodeValue.toUpperCase() === 'YES')
  if (!button) return false

  // Prevent rapidly call by observer
  Array.from(document.querySelectorAll('paper-dialog'))[0].style.display = 'none'

  // YES!
  button.click()
}

// Select the node that will be observed for mutations
const targetNode = document.body

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true }

// Callback function to execute when mutations are observed
const callback = function (mutationsList, observer) {
  for (let mutation of mutationsList) {
    if (mutation.type === 'childList' || mutation.type === 'attributes') {
      confirmIfNeed()
    }
  }
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

const onPause = () => {
  // Active?
  if (isActive) return

  video.play()
}

const watch = () => {
  window.isDebug && console.log('watch...')

  // Alway play
  const video = document.querySelector('video')
  video.removeEventListener('pause', onPause)
  video.addEventListener('pause', onPause)

  // Watch for human pause
  moveId = setTimeout(notMove, 1000)
}

const initVideo = () => {
  window.isDebug && console.log('initVideo...')
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

initVideo()
