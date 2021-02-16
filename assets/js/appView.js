var appView = {    
  initialize : function() {
    var self = this;

    $('.current-year').html(appConfig.currentYear);
    if ($(window).scrollTop() > 200) {
      $('.go-top2, .go-top3').fadeIn('slow');
      //$('body').addClass('page-scrolled');
    }else {
      $('.go-top2, .go-top3').fadeOut('slow');
      //$('body').removeClass('page-scrolled');
    }

    self.bindEvents();
    self.initAos();

    // Mobile Navigation
    self.addMobileMenu();

    if ($('#preloader').length) {
      $('#preloader').delay(100).fadeOut('slow', function() {
          $(this).remove();
      });
    }

  },

  bindEvents : function() {
    var self = this;

    $(window).resize(function () {
			if (this.resizeTO)
				clearTimeout(this.resizeTO);
			this.resizeTO = setTimeout(function () {
				$(this).trigger('resizeEnd');
			}, 500);
		});

		$(window).bind('resizeEnd', function () {
			
		});

    // Toggle Back to top button & Toggle scrolled class to #header, #topbar when page is scrolled
    $(window).scroll(function() {
      if ($(this).scrollTop() > 200) {
          $('.go-top2, .go-top3').fadeIn('slow');
          //$('body').addClass('page-scrolled');
      } else {
          $('.go-top2, .go-top3').fadeOut('slow');
          //$('body').removeClass('page-scrolled');
      }
    }); 
      
  },

  initAos : function() {
      var self = this;
      if(typeof AOS !=='undefined'){
        AOS.init({
          // mirror: true,
          // anchorPlacement: 'center-top'
        });
      }      
  },

  addMobileMenu :function(){
    var self = this;
    if ($('.nav-menu').length) {
      var $mobile_nav = $('.nav-menu').clone().prop({
        class: 'mobile-nav d-lg-none'
      });
      $('body').append($mobile_nav);
      $('body').prepend('<button type="button" class="mobile-nav-toggle d-lg-none"><i class="icofont-close"></i></button>');
      $('body').append('<div class="mobile-nav-overly"></div>');
      self.bindMobileEvents();
    } else if ($(".mobile-nav, .mobile-nav-toggle").length) {
      $(".mobile-nav, .mobile-nav-toggle, .header-mobile-nav-toggle").hide();
    }
  },

  bindMobileEvents : function() {
    var self = this;
    
    $(document).on('click', '.header-mobile-nav-toggle', function(e) {
      $('body').addClass('mobile-nav-active');
      $('.header-mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
      $('.mobile-nav-toggle, .mobile-nav-overly').show();
    });

    $(document).on('click', '.mobile-nav-toggle', function(e) {
      $('body').removeClass('mobile-nav-active');
      $('.header-mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
      $('.mobile-nav-overly').hide();
    });

    $(document).on('click', '.mobile-nav .drop-down > a', function(e) {
      e.preventDefault();
      $(this).next().slideToggle(300);
      $(this).parent().toggleClass('active');
    });

    $(document).click(function(e) {
      var container = $(".mobile-nav, .mobile-nav-toggle, .header-mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.header-mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
          $('.mobile-nav-overly').fadeOut();
        }
      }
    });
  }
};

$(document).ready(function(){
  appView.initialize();
});