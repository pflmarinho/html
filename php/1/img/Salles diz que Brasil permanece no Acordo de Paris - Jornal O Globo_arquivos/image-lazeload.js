var imagesToLazeLoad = document.querySelectorAll('.article__picture-image, .teaser__picture-image, .photo-gallery-teaser__image, .people-teaser__picture img')

function loadImages () {
  var imagesToLoad = document.querySelectorAll('.article__picture-image:not(.image--loaded), .teaser__picture-image:not(.image--loaded), .photo-gallery-teaser__image:not(.image--loaded), .people-teaser__picture img:not(.image--loaded)')

  if (imagesToLoad.length > 0) {
    imagesToLoad.forEach(function (image) {
      var position = image.getBoundingClientRect().top + window.pageYOffset
      var src = image.getAttribute('data-src')
      var srcset = image.getAttribute('data-srcset')

      if ((window.innerHeight * 1) + window.pageYOffset > position) {
        image.setAttribute('src', src)

        if (srcset !== null) {
          image.setAttribute('srcset', srcset)
        }

        image.classList.add('image--loaded')
      }
    })
  }
}

if (imagesToLazeLoad.length > 0) {
  loadImages()

  window.addEventListener('scroll', function () {
    loadImages()
  })
}
