// https://gist.github.com/adisib/1e6b429b9bb630fceb170f3fa77c57a3
const alwaysHD = () => {
  console.log('🐥 alwaysHD...')
  // On homepage?
  if (window.location.pathname !== '/watch') {
    setTimeout(alwaysHD, 1000)
    return
  }

  console.log('🐥 ytPlayer...')
  var ytPlayer = document.getElementById('movie_player') || document.getElementsByClassName('html5-video-player')[0]
  if (!ytPlayer) {
    setTimeout(alwaysHD, 1000)
    return
  }

  console.log('🐥 ytPlayer.getPlaybackQuality...')
  if (!ytPlayer.getPlaybackQuality) {
    console.error('no ytPlayer.getPlaybackQuality')
    // setTimeout(alwaysHD, 10000)
    return
  }

  const current_quality = ytPlayer.getPlaybackQuality()
  const quality = ytPlayer.getAvailableQualityLevels()[0]

  console.log('🐥 current_quality:', current_quality)
  console.log('🐥 quality:', quality)

  // Already HD
  if (current_quality === quality) return

  // Can be set?
  if (!ytPlayer.stopVideo) {
    console.error('no ytPlayer.stopVideo')
    return
  }

  // Set to HD
  console.log('🐥 setPlaybackQuality:', quality)
  ytPlayer.stopVideo()
  ytPlayer.setPlaybackQualityRange && ytPlayer.setPlaybackQualityRange(quality)
  ytPlayer.setPlaybackQuality(quality)
  ytPlayer.playVideo()
}

// Watch for dom change

var oldHref = document.location.href

window.onload = function () {
  var bodyList = document.querySelector('body')

  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (_mutation) {
      if (oldHref != document.location.href) {
        oldHref = document.location.href
        alwaysHD()
      }
    })
  })

  var config = {
    childList: true,
    subtree: true
  }

  observer.observe(bodyList, config)
  alwaysHD()
}
