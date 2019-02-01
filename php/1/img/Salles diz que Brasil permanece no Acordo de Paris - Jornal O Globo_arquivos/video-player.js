/* global WM, DFP_adUnit, DFP_adCustomData */
(function () {
  var videoPlayerContainers = document.querySelectorAll('.video-player-container')
  var videoPlayers = []

  function VideoPlayer (videoPlayerContainer) {
    var self = this
    var videoPlayer = document.createElement('div')

    self.container = videoPlayerContainer
    self.videoId = Number(self.container.getAttribute('data-oglobo-videoid'))
    self.getWidth = getWidth
    self.width = self.getWidth()
    self.getHeightFactor = getHeightFactor
    self.heightFactor = self.getHeightFactor()
    self.videoResize = videoResize
    self.vmPlayer = new WM.Player({
      videosIDs: self.videoId,
      width: self.width,
      height: self.width * self.heightFactor,
      onError: videoError,
      onPlay: desligaRefreshAutomatico,
      onPause: reativaRefreshAutomatico,
      adUnit: DFP_adUnit,
      adCustomData: DFP_adCustomData
    })

    videoPlayer.classList.add('video-player')
    self.container.appendChild(videoPlayer)
    self.vmPlayer.attachTo(self.container.querySelector('.video-player'))

    function videoResize () {
      self.vmPlayer.resize({width: 300})
      self.width = self.getWidth()
      self.vmPlayer.resize({width: self.width, height: self.width * self.heightFactor})
    }

    window.addEventListener('resize', function () {
      self.videoResize()
    }, false)

    function getWidth () {
      return Number(window.getComputedStyle(self.container).width.match(/\d+/)[0])
    }

    function getHeightFactor () {
      var dimensions = self.container.getAttribute('data-oglobo-aspect-ratio').split(':')

      return dimensions[1] / dimensions[0]
    }

    function videoError () {
      console.log(arguments)
    }
    
    function desligaRefreshAutomatico(){
  	  window.clearTimeout(timeOutDoReloadAutomatico);
    }
    
    function reativaRefreshAutomatico(){
  	  if(self.vmPlayer.getCurrentTime() >= self.vmPlayer.getDuration()){
  		reloadAutomatico(propriedadeTempoDoRefreshAutomatico);
  	  }
    }
    
  }

  function loadPlayer (videoPlayerContainer) {
    var playersToLoad = document.querySelectorAll('.video-player-container:not(.player--loaded)')

    if (playersToLoad.length > 0) {
      playersToLoad.forEach(function (player) {
        var position = player.getBoundingClientRect().top + window.pageYOffset

        if ((window.innerHeight * 1.5) + window.pageYOffset > position) {
          videoPlayers.push(new VideoPlayer(player))
          player.classList.add('player--loaded')
        }
      })
    }
  }

  if (videoPlayerContainers.length > 0) {
    var globoVideosScript = document.createElement('script')

    globoVideosScript.src = 'https://p.glbimg.com/api/stable/api.min.js'
    document.querySelector('head').appendChild(globoVideosScript)

    globoVideosScript.onload = function () {
      loadPlayer()

      window.addEventListener('scroll', function () {
        loadPlayer()
      })
    }
  }
  
  document.addEventListener('DOMContentLoaded', function (event) {
	  
	  var iframeDoFacebook = document.querySelector('div.embed-video-player-container');

	  if (iframeDoFacebook !== null) {
		  var oIframeEhDoFacebook = iframeDoFacebook.innerHTML.contains("facebook");
		  if (oIframeEhDoFacebook) {
			  reloadAutomatico(432000000);
		  }
	  }
  });
  
}())
