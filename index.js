window.isDebug = false

const log = (...args) => log(...args)

const isBlock = () => {
  // Check for existing dialog
  const dialog = Array.from(document.querySelectorAll('paper-dialog'))[0]
  if (!dialog) return false
  if (getComputedStyle(dialog).display === 'none') return false

  log('BLOCKED!!!')
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
  log('YES!!!')
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
  log(isActive)
}

const active = () => {
  isActive = true
  log(isActive)

  clearTimeout(moveId)
  moveId = setTimeout(notMove, 1000)
}

document.body.addEventListener('mousemove', active)
document.body.addEventListener('mouseover', active)
document.body.addEventListener('mousedown', active)
document.body.addEventListener('keydown', active)
document.body.addEventListener('scroll', active)
document.body.addEventListener('touchstart', active)

const initVideo = () => {
  log('Init...')
  const video = document.querySelector('video')
  if (!video) setTimeout(initVideo, 1000)

  log('Watch for video pause')

  // Never pause!
  video.addEventListener('pause', () => {
    log('PAUSED!!!')

    // Active?
    log('isActive:', isActive)
    if (isActive) return

    video.play()
    log('PLAY!!!')
  })

  moveId = setTimeout(notMove, 1000)
  log('Ready!')
}

initVideo()
