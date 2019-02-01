var windowScrollTop = window.pageYOffset
var mainNav = document.querySelector('.main-nav')

function setIconId (svgElement, iconId) {
  var svgUseElement = svgElement.querySelector('use')
  var useHref = svgUseElement.getAttributeNS('http://www.w3.org/1999/xlink', 'href')

  useHref = useHref.replace(/#[a-zA-Z0-9-_]*/, '#' + iconId)
  svgUseElement.setAttributeNS('http://www.w3.org/1999/xlink', 'href', useHref)
}

var siteHeader = document.querySelector('.site-header')

if (siteHeader !== null) {
  var siteHeaderPos = siteHeader.getBoundingClientRect().top + window.pageYOffset

  if (window.pageYOffset > siteHeaderPos) {
    siteHeader.classList.add('site-header--is-fixed')
  }

  window.addEventListener('scroll', function () {
    if (window.pageYOffset > siteHeaderPos) {
      let fixEvent = new CustomEvent('siteHeaderFixed')

      siteHeader.classList.add('site-header--is-fixed')
      document.dispatchEvent(fixEvent)
    } else {
      let unfixEvent = new CustomEvent('siteHeaderUnfixed')

      siteHeader.classList.remove('site-header--is-fixed')
      document.dispatchEvent(unfixEvent)
    }
  })

  window.addEventListener('scroll', function () {
    var NewWindowScrollTop = window.pageYOffset

    if (mainNav !== null && mainNav.classList.contains('main-nav--is-hidden')) {
      if (NewWindowScrollTop > 56) {
        document.querySelector('.site-header').classList.add('site-header--is-hidden')
        if (NewWindowScrollTop < windowScrollTop) {
          document.querySelector('.site-header').classList.remove('site-header--is-hidden')
        } else {
          document.querySelector('.site-header').classList.add('site-header--is-hidden')
        }
      } else {
        document.querySelector('.site-header').classList.remove('site-header--is-hidden')
      }
    }

    windowScrollTop = window.pageYOffset
  })
}

var navAccessButton = document.querySelector('.nav-access-button')

if (navAccessButton !== null) {
  navAccessButton.addEventListener('click', function (event) {
    event.preventDefault()
    var navAccessButton = document.querySelector('.nav-access-button')
    var searchWidget = document.querySelector('.search-widget')

    if (mainNav.classList.contains('main-nav--is-hidden')) {
      mainNav.classList.remove('main-nav--is-hidden')
      searchWidget.classList.add('search-widget--is-visible')
      setIconId(navAccessButton, 'icons--close')
    } else {
      mainNav.classList.add('main-nav--is-hidden')
      searchWidget.classList.remove('search-widget--is-visible')
      setIconId(navAccessButton, 'icons--menu')
    }
  })

  window.addEventListener('click', function (event) {
    var searchWidget = document.querySelector('.search-widget')

    if (
      !mainNav.contains(event.target) &&
      !navAccessButton.contains(event.target) &&
      !searchWidget.contains(event.target)
    ) {
      mainNav.classList.add('main-nav--is-hidden')
      searchWidget.classList.remove('search-widget--is-visible')
      setIconId(navAccessButton, 'icons--menu')
    }
  })
}
