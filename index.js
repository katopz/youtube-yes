window.isDebug = false

const isBlock = () => {
  // Check for existing dialog
  const dialog = Array.from(document.querySelectorAll('paper-dialog'))[0]
  if (!dialog) return false
  if (getComputedStyle(dialog).display === 'none') return false

  console.log('BLOCKED!!!')
  return true
}

const confirmIfNeed = () => {
  if (!isBlock()) return

  // Check for yes existing button
  const button = Array.from(document.querySelectorAll('paper-button')).find(
    e => e.attributes['aria-label'] && e.attributes['aria-label'].nodeValue.toUpperCase() === 'YES'
  )
  if (!button) return false

  // Prevent rapidly call by observer
  Array.from(document.querySelectorAll('paper-dialog'))[0].style.display = 'none'

  // YES!
  button.click()
  console.log('YES!!!')
}

// Select the node that will be observed for mutations
const targetNode = document.body

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true }

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
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
  window.isDebug && console.log(isActive)
}

const active = () => {
  isActive = true
  window.isDebug && console.log(isActive)

  clearTimeout(moveId)
  moveId = setTimeout(notMove, 1000)
}

document.body.addEventListener('mousemove', active)
document.body.addEventListener('mouseover', active)
document.body.addEventListener('mousedown', active)

const initVideo = () => {
  window.isDebug && console.log('Init...')
  const video = document.querySelector('video')
  if (!video) setTimeout(initVideo, 1000)

  window.isDebug && console.log('Watch for video pause')

  // Never pause!
  video.addEventListener('pause', () => {
    window.isDebug && console.log('PAUSED!!!')

    if (isActive) return

    video.play()
    window.isDebug && console.log('PLAY!!!')
  })

  moveId = setTimeout(notMove, 1000)
  window.isDebug && console.log('Ready!')
}

initVideo()
