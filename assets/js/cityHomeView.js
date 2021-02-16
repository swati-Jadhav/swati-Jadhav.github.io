var cityHomeView = {    
    initialize : function() {
        var self = this;
        self.bindEvents();
        self.initCarousel();
    },

    bindEvents : function() {
        var self = this;
    },

    initCarousel : function(){

        // Testimonials carousel (uses the Owl Carousel library)
        $(".cust-reviews-carousel").owlCarousel({
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

        // Clients carousel (uses the Owl Carousel library)
        $(".clients-carousel").owlCarousel({
            autoplay: true,
            dots: true,
            loop: true,
            responsive: {
            0: {
                items: 2
            },
            768: {
                items: 4
            },
            900: {
                items: 6
            }
            }
        });
    }

};

$(document).ready(function(){
    cityHomeView.initialize();
});