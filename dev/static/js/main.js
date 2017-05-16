
// Начинать писать отсюда!!!!
$(document).ready(function(){
    
    $('.js-banner-slider').slick({
        dots: false,
        speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1,
        prevArrow: '.banner-slider__prev',
        nextArrow: '.banner-slider__next'
    });
});
