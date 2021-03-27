var galleryIsotope;
var galleryView = {    
    initialize : function() {
        var self = this;
        self.initIsotope();
        //self.initVenobox();
        self.bindEvents();
    },

    bindEvents : function() {
        var self = this;
        $('#gallery-flters li').on('click', function() {
            $("#gallery-flters li").removeClass('filter-active');
            $(this).addClass('filter-active');
      
            galleryIsotope.isotope({
              filter: $(this).data('filter')
            });
        });
    },

    initIsotope : function(){
        var self = this;
        galleryIsotope = $('.gallery-container').isotope({
            itemSelector: '.gallery-item',
            layoutMode: 'fitRows'
        });
    },

    initVenobox:function(){
        var self = this;
        // Initiate venobox (lightbox feature used in portofilo)
        $('.venobox').venobox();
    }
    

};

$(document).ready(function(){
    galleryView.initialize();
});