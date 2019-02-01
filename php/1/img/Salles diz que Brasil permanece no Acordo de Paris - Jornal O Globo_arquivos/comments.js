/* global fetch, location, comentarioHabilitado, urlsAutenticarComentario */
import Login from './login.js'
import Comment from './comment.js'
import CommentForm from './comment-form.js'

class Comments {
  constructor (element) {
    this.el = element
    this.contentId = this.el.getAttribute('data-oglobo-content-id')
    this.moreButton = this.el.querySelector('.comments__more-button')
    this.countNumber = this.el.querySelector('.comments__count-number')
    this.commentsContent = this.el.querySelector('.comments__content')
    this.header = this.el.querySelector('.comments-header')
    this.commentButton = this.el.querySelector('.comments-header__actions .comments__comment-button')
    this.comments = []
    this.started = false
    this.page = 1
    this.user = { isLogged: false, canPost: comentarioHabilitado }
    this.loginIsComplete = /concluirLogin=3981/i.test(window.location.href)

    this.startComments()

    if (this.loginIsComplete) {
      window.location.href = window.location.href + '#comments'
    }

    if (!Login.isLoggedGloboCom()) {
      this.commentButton.innerHTML = 'Login'
    }

    window.addEventListener('scroll', () => {
      this.startComments()
    })

    this.moreButton.addEventListener('click', () => {
      this.page = this.page + 1
      this.loadPage(this.page)
    })

    if (comentarioHabilitado) {
      this.commentButton.addEventListener('click', () => {
        if (this.user.isLogged) {
          this.form = new CommentForm(this)
          this.commentButton.remove()
        } else {
          this.commentButton.setAttribute('disabled', 'disabled')
          Login.authenticate(urlsAutenticarComentario)
            .then(response => {
              if (response.status === 401) {
                this.commentButton.insertAdjacentHTML('afterEnd', '<div class="comments__comment-message">Para comentar é necessário ser <a href="https://assineoglobo.globo.com/o-globo?utm_source=oglobo&utm_medium=botao&utm_campaign=oglobo_botao_comentario">assinante</a>.</div>')
                this.commentButton.remove()
              } else if (response.status === 200) {
                this.user.isLogged = true
                this.user.name = Login.getUserFullName()
                this.form = new CommentForm(this)
                this.commentButton.remove()
                this.commentsContent.innerHTML = ''
                this.page = 1
                this.comments = []
                this.loadPage(this.page)
              } else {
                this.commentButton.insertAdjacentHTML('afterEnd', '<div class="comments__comment-message comments__comment-message--error">Erro interno. Tente novamente mais tarde.</div>')
              }
              this.commentButton.removeAttribute('disabled')
            })
            .catch(error => {
              console.log('Error: ', error)
              this.commentButton.removeAttribute('disabled')
            })
        }
      })
    }
  }

  startComments () {
    let position = this.el.getBoundingClientRect().top + window.pageYOffset
    let canBeStarted = ((window.innerHeight * 1) + window.pageYOffset > position)

    if (this.started === false && canBeStarted) {
      this.loadPage(1)
      this.started = true

      if (comentarioHabilitado) {
        if (Login.isLoggedGloboCom() && Login.isLoggedCadun()) {
          this.user.isLogged = true
          this.user.name = Login.getUserFullName()

          if (this.loginIsComplete) {
            this.form = new CommentForm(this)
            this.commentButton.remove()
          }
        }
      }
    }
  }

  loadPage (pageNumber) {
    this.el.classList.add('comments--loading')
    fetch(`${location.protocol}//${location.host}/ajax/comentario/buscar/${this.contentId}/${pageNumber}.json`, {
      method: 'GET'
    }).then(response => {
      response.json().then(data => {
        this.countNumber.innerHTML = data.totalComentarios

        data.comentarios.forEach((comment) => {
          this.comments.push(new Comment(comment, this))
        })

        if (data.pagina === data.totalPaginas) {
          this.moreButton.remove()
        }
      })
      this.el.classList.remove('comments--loading')
    }).catch(error => console.error('Error:', error))
  }
}

let commentsWidgets = document.querySelectorAll('.comments')

if (commentsWidgets.length > 0) {
  let commentsObjects = []

  commentsWidgets.forEach((el) => {
    commentsObjects.push(new Comments(el))
  })
}
