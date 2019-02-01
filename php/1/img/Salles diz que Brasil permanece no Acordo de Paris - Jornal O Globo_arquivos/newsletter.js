/* global FormData, fetch */
import newsletterSuccess from './templates/newsletter-success.js'

class Newsletter {
  constructor (form) {
    this.form = form
    this.emailLabel = this.form.querySelector('.article__newsletter-email-label')
    this.email = this.form.querySelector('.article__newsletter-email')
    this.captcha = this.form.querySelector('.article__newsletter-captcha')
    this.captchaInput = this.form.querySelector('.article__newsletter-captcha-input')
    this.captchaLabel = this.form.querySelector('.article__newsletter-captcha-label')
    this.captchaImage = this.form.querySelector('.article__newsletter-captcha-image')
    this.changeCaptcha = this.form.querySelector('.article__newsletter-change-captcha')
    this.submit = this.form.querySelector('.article__newsletter-submit')
    this.dataCaptchaSrc = this.captchaImage.getAttribute('data-captcha-src')
    this.message = document.createElement('div')

    this.message.classList.add('article__newsletter-message')
    this.submit.insertAdjacentElement('afterEnd', this.message)

    this.changeCaptcha.addEventListener('click', (event) => {
      event.preventDefault()
      this.updateCaptcha()
      this.captchaInput.focus()
    })

    this.form.addEventListener('submit', (event) => {
      event.preventDefault()

      if (this.captchaInput.value === '') {
        this.updateCaptcha()
        this.showCaptcha()
      } else {
        this.postData()
      }
    })
  }

  showCaptcha () {
    this.emailLabel.style.display = 'none'
    this.email.style.display = 'none'
    this.captcha.style.display = 'flex'
    this.captchaLabel.style.display = 'block'
    this.captchaInput.setAttribute('required', 'required')
    this.captchaInput.focus()
  }

  showEmail () {
    this.emailLabel.style.display = 'block'
    this.email.style.display = 'block'
    this.captcha.style.display = 'none'
    this.captchaLabel.style.display = 'none'
    this.email.focus()
  }

  updateCaptcha () {
    this.captchaImage.setAttribute('src', this.dataCaptchaSrc + (new Date()).getTime())
  }

  postData () {
    let formData = new FormData(this.form)
    let url = this.form.getAttribute('action') + '.do'

    formData.append('acao', 'inscrever')
    formData.append('origem', 'Web')
    this.form.classList.add('article__newsletter-form--sending')
    fetch(url, {
      method: 'POST',
      body: formData
    })
      .then(response => {
        response.json().then(data => {
          if (data.codigo === 0) {
            this.form.innerHTML = newsletterSuccess
          } else if (data.codigo >= 13) {
            this.updateCaptcha()
            this.showCaptcha()
            this.message.innerHTML = data.mensagem
          } else if (data.codigo === 1) {
            this.showEmail()
            this.message.innerHTML = data.mensagem
          } else {
            this.message.innerHTML = 'Ocorreu um erro.<br /> Tente novamente mais tarde.'
          }
        })
        this.form.classList.remove('article__newsletter-form--sending')
      })
      .catch(error => console.error('Error:', error))
  }
}

let newsletterForms = document.querySelectorAll('.article__newsletter-form')

if (newsletterForms.length > 0) {
  let newsletters = []

  newsletterForms.forEach((el) => {
    newsletters.push(new Newsletter(el))
  })
}
