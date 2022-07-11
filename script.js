window.isDebug = true

const println = (...arguments) => {
  window.isDebug && console.log(...arguments)
}

// https://gist.github.com/adisib/1e6b429b9bb630fceb170f3fa77c57a3
const alwaysHD = () => {
  println('alwaysHD...')
  // On homepage?
  if (window.location.pathname !== '/watch') {
    setTimeout(alwaysHD, 1000)
    return
  }

  println('ytPlayer...')
  const ytPlayer = document.getElementById('movie_player') || document.getElementsByClassName('html5-video-player')[0]
  if (!ytPlayer) {
    setTimeout(alwaysHD, 1000)
    return
  }

  const current_quality = ytPlayer.getPlaybackQuality ? ytPlayer.getPlaybackQuality() : ''
  const expected_quality = ytPlayer.getAvailableQualityLevels()[0]

  println('current_quality:', current_quality)
  println('expected_quality:', expected_quality)

  // Already HD
  if (current_quality === expected_quality) {
    println('all set:', expected_quality)
    return
  }

  // Can be set?
  if (!ytPlayer.stopVideo) {
    console.error('no ytPlayer.stopVideo')
    return
  }

  // Set to HD
  println('setPlaybackQuality:', expected_quality)
  ytPlayer.stopVideo()
  ytPlayer.setPlaybackQualityRange && ytPlayer.setPlaybackQualityRange(expected_quality)
  ytPlayer.setPlaybackQuality(expected_quality)
  ytPlayer.playVideo()
}

// Watch for dom change

const oldHref = document.location.href

window.onload = function () {
  const bodyList = document.querySelector('body')

  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (_mutation) {
      if (oldHref != document.location.href) {
        oldHref = document.location.href
        alwaysHD()
      }
    })
  })

  const config = {
    childList: true,
    subtree: true
  }

  observer.observe(bodyList, config)
  alwaysHD()
}
