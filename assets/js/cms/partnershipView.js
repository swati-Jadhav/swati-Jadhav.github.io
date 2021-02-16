var partnershipView = {    
    initialize : function() {
        var self = this;
        self.bindEvents();
        self.initCarousel();
    },

    bindEvents : function() {
        var self = this;
    },

    initCarousel : function(){

        // Partners Reviews carousel (uses the Owl Carousel library)
        $(".partner-reviews-carousel").owlCarousel({
            autoplay: true,
            dots: true,
            loop: true,
            responsive: {
            0: {
                items: 1
            },
            768: {
                items: 1
            },
            900: {
                items: 1
            }
            }
        });
    }

};

$(document).ready(function(){
  partnershipView.initialize();
});