var contactView = {    
    initialize : function() {
        var self = this;
        $('.nav-menu li').removeClass('active');
        $('#contactMenu').addClass('active');
        self.bindEvents();
    },

    bindEvents : function() {
        var self = this;

        $(document).off('submit', '#contactForm').on('submit', '#contactForm', function(e) {
            e.preventDefault();
			if (!$(this).find('.required-field').not('.txt-valid').length) {
                let params = {
                    service_id: appConfig.emailjsConfig.serviceId,
                    template_id: appConfig.emailjsConfig.templateId,
                    user_id: appConfig.emailjsConfig.userId,
                    template_params: {
                      from_name: $('#txtCName').val(),
                      to_name: appConfig.emailjsConfig.userName ,
                      reply_to: $('#txtCEmail').val(),
                      mobile_no: $('#txtCMobile').val(),
                      message: 'I want to use your service to move from '+$('#txtCFrom').val()+' to '+$('#txtCTo').val(),
                      moving_from:$('#txtCFrom').val(),
                      moving_to:$('#txtCTo').val(),
                      answer:$('#txtCAnswer').val(),
                    }
                  };

                let headers = {
                    'Content-type': 'application/json'
                };
              
                let options = {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(params),
                    responseType: 'text'
                };
              
                fetch(appConfig.emailjsConfig.apiUrl, options)
                  .then((httpResponse) => {
                      if (httpResponse.ok) {
                          console.log('Your mail is sent!');
                          window.location.href = 'thank-you.html';
                      } else {
                          return httpResponse.text()
                            .then(text => Promise.reject(text));
                      }
                  })
                  .catch((error) => {
                      console.log('Oops... ' + error);
                  });
                  
                
            } else {
				validationView.setInvalidEl({
					'el': $(this).find('.required-field:visible').not('.txt-valid')
				});
			}
        });
    },

};

$(document).ready(function(){
    contactView.initialize();
});