/* global fetch, loadAdvertising, location */
import feedTemplate from './templates/feed.js'
import adTemplate from './templates/advertising.js'

class ArticleFeed {
  constructor (articleFeed) {
    this.feed = articleFeed
    this.content = this.feed.querySelector('.article-feed__content')
    this.moreButton = this.feed.querySelector('.article-feed__more-button')
    this.section = this.feed.getAttribute('data-oglobo-section')
    this.contentType = this.feed.getAttribute('data-oglobo-contentType')
    this.elementControl = document.querySelector('.article-footer') || this.feed
    this.started = false
    this.page = 1

    this.startFeed()

    window.addEventListener('scroll', () => {
      this.startFeed()
    })

    this.moreButton.addEventListener('click', () => {
      this.page = this.page + 1
      this.loadPage(this.page)
    })
  }

  startFeed () {
    let position = this.elementControl.getBoundingClientRect().top + window.pageYOffset
    let canBeStarted = ((window.innerHeight * 1) + window.pageYOffset > position)

    if (this.started === false && canBeStarted) {
      this.loadPage(1)
      this.started = true
    }
  }

  loadPage (pageNumber) {
    this.feed.classList.add('article-feed--loading')
    this.moreButton.setAttribute('disabled', 'disabled')
    fetch(`${location.protocol}//${location.host}/api/v1/vermais/${this.section}/conteudo.json?pagina=${pageNumber}&versao=v1${this.contentType}`, {
      method: 'GET'
    })
      .then(response => {
        response.json().then(data => {
          var content = data[0].conteudos

          content.forEach((feed, index) => {
            this.content.insertAdjacentHTML('beforeEnd', feedTemplate(feed, this.section))
            if (index === 2) {
              this.content.insertAdjacentHTML('beforeEnd', adTemplate(pageNumber))
            }
          })

          loadAdvertising()
          if (data[0].conteudos == undefined || data[0].conteudos.length == 0 ) {
        	  this.feed.remove();
          }
          if (data[0].paginacao.paginaAtual === data[0].paginacao.totalPaginas) {
            this.moreButton.remove()
          }
        })
        this.feed.classList.remove('article-feed--loading')
        this.moreButton.removeAttribute('disabled')
      })
      .catch(error => console.error('Error:', error))
  }
}

let articleFeedSections = document.querySelectorAll('.article-feed')

if (articleFeedSections.length > 0) {
  let articleFeeds = []

  articleFeedSections.forEach((el) => {
    articleFeeds.push(new ArticleFeed(el))
  })
}
