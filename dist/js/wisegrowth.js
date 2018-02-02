$(document).ready(function(){

   // slider para la seccion de partners
   $('.owl-partners').owlCarousel({
      // animateOut: 'slideOutDown',
      // animateIn: 'flipInX',
		loop: true,
		autoplay: true,
		margin: 10,
		nav: true,
		dots: true,
		navText: ["<div class='prev'></div>", "<div class='next'></div>"],
		responsive: {
			0: {
				items: 1
			},
			600: {
				items: 1
			},
			1000: {
				items: 1
			}
		}
	});


   var wow = new WOW(
     {
       boxClass:     'wow',      // animated element css class (default is wow)
       animateClass: 'animated', // animation css class (default is animated)
       offset:       0,          // distance to the element when triggering the animation (default is 0)
       mobile:       true,       // trigger animations on mobile devices (default is true)
       live:         true,       // act on asynchronously loaded content (default is true)
       callback:     function(box) {
         // the callback is fired every time an animation is started
         // the argument that is passed in is the DOM node being animated
       },
       scrollContainer: null,    // optional scroll container selector, otherwise use window,
       resetAnimation: true,     // reset animation on end (default is true)
     }
   );
   wow.init();


   $('.banner--ancla').click(function(){
  	  if(location.pathname.replace(/^\//,'')==this.pathname.replace(/^\//,'')||location.hostname==this.hostname){
  	    var
  	    target=$(this.hash);
  	    target=target.length?target:$('[name='+this.hash.slice(1)+']');
  	    if(target.length){
  	      $('html,body').animate({
  	          scrollTop:target.offset().top-110
  	      },1000);
  	      return false;
  	    }
  	  }
  	});

   $(window).on('scroll', function(){
     var $window = $(this);

     $window.scrollTop() > 300
       ? $('.banner--ancla').css('opacity', '0')
       : $('.banner--ancla').css('opacity', '1');
   });


   $('.video, .video--presentacion').on('click', function(){
      $('#video').css('opacity', '1');
      $('.video--presentacion').css('opacity', '0');
   });

   $('#video').click(function() {
     this.paused ? this.play() : this.pause();
   });


   // icon hamburguesa
   $(".header--iconMobile--burger").click(function() {
	  $(this).toggleClass("on");
   });

   $('.parallax').parallax();


   // despliega el menu lateral
	$('.header--iconMobile--burger').on('click', function() {
      $(".menuLateral").toggleClass('u-show');

      if($('.menuLateral').hasClass('u-show')){
         setTimeout(function(){
           $(".menuLateral").css('background-color', 'rgba(35,51,64,1)');
           $(".menuLateral--item").css('opacity', '1');
         }, 500);
      } else {
         $(".menuLateral").css('background-color', 'rgba(35,51,64,0)');
         $(".menuLateral--item").css('opacity', '.3');
      }

	});



   var active;
   // agrega la clase active al item del menu y me guarda info de el
	$('.menuLateral--item').click(function(){
		active = $('li.menuLateral--item__active').attr('id');
		console.log(active);
		$(".menuLateral--item").removeClass('menuLateral--item__active');
		$(this).addClass('menuLateral--item__active');

      $('.menuLateral').removeClass('u-show');
     $(".menuLateral").css('background-color', 'rgba(35,51,64,0)');
     $(".menuLateral--item").css('opacity', '.3');
     $('.header--iconMobile--burger').removeClass('on');

	});


});
