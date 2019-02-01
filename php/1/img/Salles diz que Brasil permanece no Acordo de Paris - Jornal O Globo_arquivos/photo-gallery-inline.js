import Carousel from './es-carousel/es-carousel.js'
import swipe from './swipe.js'

let quantityPerPageChange = 2
let indexAds = 1

class PhotoGalleryInline extends Carousel {
    constructor(carousel) {
        super(carousel)  
                
        this.numberOfItemsLoaded = 0
        this.numberControls = this.carousel.querySelector('.control--counter')
        this.photogallery = this.carousel.querySelector('.article_photo-gallery-teaser--wrapper')        
                
        this.setCurrentPage()
        this.loadCarroselItem()

        this.carousel.addEventListener('pageChange', () => {
            this.setCurrentPage()
            this.loadCarroselItem()
        })

        this.enableControls()
        this.enableSwipe()
        this.enableCloseAd()
    }

    getCurrentPage() {
        return this.page
    }

    setCurrentPage() {        
        this.numberControls.innerHTML = `${this.page} de ${this.totalPages}`
    }

    enableSwipe() {
        if(swipe !== null && swipe !== undefined) {
            
            this.photogallery.addEventListener("swipe", (sw) => {                                                			
                if(sw.detail.direction == 'right' && !this.isFirstPage()) {
                    this.goBack()                    
                }
                else if(sw.detail.direction == 'left' && !this.isLastPage()) {
                    this.goNext()                    
                }
            }) 
        }
    }

    enableCloseAd() {
        this.carousel.querySelectorAll('.control--close').forEach((control) => {
            control.addEventListener('click', () => {
                this.closeAd()
            });
        })
    }

    goBack() {
        this.goToPreviousPage()
        if(this.isFirstPage()) 
            this.previousControl.classList.add("carousel-controls__previous--disabled")
        else 
            this.nextControl.classList.remove("carousel-controls__next--disabled")
    }

    goNext() {
        this.goToNextPage()        

        if(this.isLastPage())
            this.nextControl.classList.add("carousel-controls__next--disabled")
        else 
            this.previousControl.classList.remove("carousel-controls__previous--disabled")
    }

    closeAd() {
        this.goNext()        
    }

    loadCarroselItem() {
        let pos = this.numberOfItemsLoaded
        
        for (var index=pos; index<pos+quantityPerPageChange; index++) {
            if(index >= this.totalPages) return;

            let carouselItem = this.items[index]

            if(this.isImage(carouselItem))
                this.loadImage(index)
            else if(this.isAdvertising(carouselItem))
                this.loadAdvertising(index)

            this.numberOfItemsLoaded++
        }
    }

    loadImage(numberPage) {
        let pos = numberPage
        let image = this.items[pos].querySelector('.photo-gallery-teaser__image') 
        let src = image.getAttribute('data-src')

        if(src !== null && src !== undefined) {
            console.log('Slide '+ (pos+1) +': Foto carregada')
            image.setAttribute('src', src)
            image.classList.add('image--loaded')
        }
    }

    loadAdvertising(numberPage) {
        let pos = numberPage
        let ads = this.items[pos].querySelector('.advertising--fotogaleria') 
        let format = ads.getAttribute('data-oglobo-advertising-format')
        let index = indexAds

        if (format !== null && format !== undefined) {            
            console.log('Slide '+ (pos+1) + ': Publicidade ' + index + ' carregada')
            ads.setAttribute('data-oglobo-advertising-index', index)
            ads.setAttribute('id', 'pub-' + format + '-' + index)
            printarPublicidade(format, index)
            ads.classList.add('advertising--loaded')
        }

        indexAds++
    }    

    isImage(carouselItem) {
        return (carouselItem.querySelector('.photo-gallery-teaser__image') !== null 
             && carouselItem.querySelector('.photo-gallery-teaser__image') !== undefined)
    }

    isAdvertising(carouselItem) {
        return (carouselItem.querySelector('.advertising--fotogaleria') !== null 
             && carouselItem.querySelector('.advertising--fotogaleria') !== undefined)
    }
}

let photoGallery = document.querySelectorAll('.article__photo-gallery-teaser')

if (photoGallery.length > 0) {
    let photoGalleryTeasersCarousels = []

    photoGallery.forEach((el) => {        
        photoGalleryTeasersCarousels.push(new PhotoGalleryInline(el))
    })
}