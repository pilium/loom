
$( document ).ready( function () {

  $( '.js-banner-slider' ).slick( {
    dots: false,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    prevArrow: '.banner-slider__prev',
    nextArrow: '.banner-slider__next'
  } );
  $( '.js-opinions-slider' ).slick( {
    dots: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false
  } );
  $( '.nav-mobile' ).click( function () {
    $( this ).toggleClass( 'active' );
    $( '.main-nav__list' ).toggleClass( 'mobile-show' );
  } );
  $('.popup-link').magnificPopup({
    type: 'inline',

  })
} );
$( window ).scroll( function () {
  if ( $( this ).scrollTop() > 10 ) {
    $( '.header-top__content' ).addClass( "sticky" );
  } else {
    $( '.header-top__content' ).removeClass( "sticky" );
  }
} );
