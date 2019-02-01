/* global googletag, printarPublicidade, CustomEvent, MutationObserver, bannerDesktopFixoLigado, bannerLoadScreenLength, clearForAds */
window.googletag = window.googletag || {}
googletag.cmd = googletag.cmd || []
var advertisements = document.querySelectorAll('.advertising')
var firstAdvertisingObserver = new MutationObserver(advertisingIsFixable)
var advertisingFixable = new AdvertisingFixable(document.querySelector('.block--advertising'))

firstAdvertisingObserver.observe(document.querySelector('.block--advertising'), {
  childList: true,
  subtree: true,
  attributes: true,
  characterData: true
})

function loadAdvertising () {
  var advertisementsToLoad = document.querySelectorAll('.advertising:not(.advertising--loaded)')

  if (advertisementsToLoad.length > 0) {
    advertisementsToLoad.forEach(function (advertising) {
      var position = advertising.getBoundingClientRect().top + window.pageYOffset
      var isDisplayed = (window.getComputedStyle(advertising, null).display !== 'none')
      var hasPubID = (advertising.getAttribute('id') !== null && advertising.getAttribute('id').includes('pub-'))
      var format = advertising.getAttribute('data-oglobo-advertising-format')
      var index = advertising.getAttribute('data-oglobo-advertising-index')

      if (isDisplayed && hasPubID && ((window.innerHeight * (bannerLoadScreenLength || 2)) + window.pageYOffset > position)) {
        advertising.classList.add('advertising--loaded')
        printarPublicidade(format, index)
      }
    })
  }
}

function advertisingIsFixable (mutationRecords) {
  var advertisingContent = document.querySelector('.block--advertising .block__advertising-content')
  var advertisingHeight = window.getComputedStyle(advertisingContent, null).height

  advertisingHeight = Number(advertisingHeight.match(/\d+/)[0])

  if (advertisingHeight > 90) {
    window.advertisingMustBeFixed = false
    advertisingFixable.unFixAdvertising()
    firstAdvertisingObserver.disconnect()
  }
}

function AdvertisingFixable (advertising) {
  var self = this

  self.nextBlock = document.querySelector('.block--advertising + .block') || document.querySelector('.block--advertising ~ .large-16')
  self.nextBlockMarginTopMod = Number(window.getComputedStyle(advertising, null).height.match(/\d+/))

  window.advertisingMustBeFixed = true

  self.fixAdvertising = function () {
    advertising.classList.add('block--advertising--is-fixed')
    if (self.nextBlock !== null) {
      self.nextBlock.style.marginTop = (self.nextBlockMarginTopMod + 72) + 'px'
    }

    setTimeout(function () {
      self.unFixAdvertising()
      window.advertisingMustBeFixed = false
    }, 8000)
  }

  self.unFixAdvertising = function () {
    advertising.classList.remove('block--advertising--is-fixed')
    if (self.nextBlock !== null) {
      self.nextBlock.style.marginTop = ''
    }
  }

  document.addEventListener('siteHeaderFixed', function () {
    if (window.advertisingMustBeFixed) {
      self.fixAdvertising()
    }
  })

  document.addEventListener('siteHeaderUnfixed', function () {
    self.unFixAdvertising()
  })
}

function setAdvertisingIds (format) {
  var advertisementsByFormat = document.querySelectorAll(`.advertising[data-oglobo-advertising-format="${format}"]`)

  if (advertisementsByFormat.length > 0) {
    advertisementsByFormat.forEach(function (advertising, index) {
      var format = advertising.getAttribute('data-oglobo-advertising-format')
      var advertisingId = 'pub-' + format + '-' + (index + 1)

      advertising.setAttribute('id', advertisingId)
      advertising.setAttribute('data-oglobo-advertising-index', (index + 1))
    })
  }
}

if (advertisements.length > 0) {
  setAdvertisingIds('super')
  setAdvertisingIds('superbanner')
  setAdvertisingIds('fullbanner')
  setAdvertisingIds('retangulo')
  setAdvertisingIds('in-text')
  setAdvertisingIds('halfpage')
  setAdvertisingIds('box-materia')
  setAdvertisingIds('retangulo-mobi')
  setAdvertisingIds('box-esp-publ')

  if (typeof bannerDesktopFixoLigado !== 'undefined' && bannerDesktopFixoLigado === true) {
    advertisingFixable = new AdvertisingFixable(document.querySelector('.block--advertising'))
  }

  googletag.cmd.push(function isPubadsReady () {
    window.loaderTimer = window.loaderTimer || null

    clearInterval(window.loaderTimer)

    if (window.googletag.pubadsReady) {
      let event = new CustomEvent('pubadsReady')

      document.dispatchEvent(event)
      delete window.loaderTimer
    } else {
      window.loaderTimer = setInterval(() => {
        isPubadsReady()
      }, 1)
    }
  })

  document.addEventListener('pubadsReady', function () {
    if (clearForAds) {
      loadAdvertising()

      window.addEventListener('scroll', loadAdvertising)
    } else {
      setTimeout(function () {
        let event = new CustomEvent('clearForAds')

        document.dispatchEvent(event)
      }, 3000)

      document.addEventListener('clearForAds', function () {
        loadAdvertising()

        window.addEventListener('scroll', loadAdvertising)
      })
    }
  })
}
