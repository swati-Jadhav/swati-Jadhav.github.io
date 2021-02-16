var commonViewBaseUrl = 'assets/';
if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
        if (typeof this !== 'function') {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function() {},
            fBound = function() {
                return fToBind.apply(this instanceof fNOP ? this : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

$.fn.digits = function(){ 
    return this.each(function(){ 
        $(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") ); 
    })
}

if (!Array.prototype.filter) {
    Array.prototype.filter = function(fun /*, thisArg*/ ) {
        'use strict';

        if (this === void 0 || this === null) {
            throw new TypeError();
        }

        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== 'function') {
            throw new TypeError();
        }

        var res = [];
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) {
            if (i in t) {
                var val = t[i];

                // NOTE: Technically this should Object.defineProperty at
                //    the next index, as push can be affected by
                //    properties on Object.prototype and Array.prototype.
                //    But that method's new, and collisions should be
                //    rare, so use the more-compatible alternative.
                if (fun.call(thisArg, val, i, t)) {
                    res.push(val);
                }
            }
        }

        return res;
    };
}

if ( typeof Object.create !== 'function' ) {
	Object.create = function( obj ) {
		function F() {}
		F.prototype = obj;
		return new F();
	};
}

$.fn.getQueryParameter = function(queryStr, name) {
	if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(queryStr))
		return decodeURIComponent(name[1]);
}

$.session = {
    _id: null,
    _cookieCache: undefined,
    _init: function() {
        if (!window.name) {
            window.name = Math.random();
        }
        this._id = window.name;
        this._initCache();
        // See if we've changed protcols
        var matches = (new RegExp(this._generatePrefix() + "=([^;]+);")).exec(document.cookie);
        if (matches && document.location.protocol !== matches[1]) {
            this._clearSession();
            for (var key in this._cookieCache) {
                try {
                    window.sessionStorage.setItem(key, this._cookieCache[key]);
                } catch (e) {};
            }
        }
        //document.cookie = this._generatePrefix() + "=" + document.location.protocol + ';path=/;expires=' + (new Date((new Date).getTime() + 1)).toUTCString();
    },
    _generatePrefix: function() {
        return '__session:' + this._id + ':';
    },
    _initCache: function() {
        /* var cookies = document.cookie.split(';');
        this._cookieCache = {};
        for (var i in cookies) {
          var kv = cookies[i].split('=');
          if ((new RegExp(this._generatePrefix() + '.+')).test(kv[0]) && kv[1]) {
            this._cookieCache[kv[0].split(':', 3)[2]] = kv[1];
          }
        } */
    },
    _setFallback: function(key, value, onceOnly) {
        /* var cookie = this._generatePrefix() + key + "=" + value + "; path=/";
        if (onceOnly) {
          cookie += "; expires=" + (new Date(Date.now() + 1)).toUTCString();
        }
        document.cookie = cookie;
        this._cookieCache[key] = value;
        return this; */
    },
    _getFallback: function(key) {
        /* if (!this._cookieCache) {
          this._initCache();
        }
        return this._cookieCache[key]; */
    },
    _clearFallback: function() {
        /* for (var i in this._cookieCache) {
          document.cookie = this._generatePrefix() + i + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
        this._cookieCache = {}; */
    },
    _deleteFallback: function(key) {
        /* document.cookie = this._generatePrefix() + key + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        delete this._cookieCache[key]; */
    },
    get: function(key) {
        return window.sessionStorage.getItem(key) || this._getFallback(key);
    },
    set: function(key, value, onceOnly) {
        try {
            window.sessionStorage.setItem(key, value);
        } catch (e) {}
        this._setFallback(key, value, onceOnly || false);
        return this;
    },
    'delete': function(key) {
        return this.remove(key);
    },
    remove: function(key) {
        try {
            window.sessionStorage.removeItem(key);
        } catch (e) {};
        this._deleteFallback(key);
        return this;
    },
    _clearSession: function() {
        try {
            window.sessionStorage.clear();
        } catch (e) {
            for (var i in window.sessionStorage) {
                window.sessionStorage.removeItem(i);
            }
        }
    },
    clear: function() {
        this._clearSession();
        this._clearFallback();
        return this;
    }
};

var commonView = {
	msg : {
		networkModal : '<div id="networkOverlay" class="modalOverlay">'+
											//'<div class="paynimobranding"><span class="powered_paynimo"> TechProcess<sup>&#x00AE;</sup> Payment Services LTD.</span></div>'+
										'</div>'+
										'<div id="networkModal" class="modalPopup">' +
											'<div id="network-error" class="detail-box animated zoomIn">' +
												'<div class="network-img"></div>' +
												'<div class="network-msg">No Connection<p>Please check your internet connection</p><button id="btnNetRefresh" class="btn btn-primary" type="button">Refresh</button></div>' +
											'</div>' +
										'</div>',
		notificationModal : '<div id="msgOverlay" class="modalOverlay">'+
													//'<div class="paynimobranding"><span class="powered_paynimo"> TechProcess<sup>&#x00AE;</sup> Payment Services LTD.</span></div>'+
												'</div>'+
												'<div id="msgModal" class="modalPopup">' +
													'<div id="msgBox" class="detail-box animated zoomIn">' +
														'<div id="msgDiv"></div>' +
														'<div class="msgBtn">' +
															'<button class="btn btnNo pull-left">No</button>' +
															'<button class="btn btnYes pull-right">Yes</button>' +
															'<button class="btn btnOk ">Ok</button>' +
														'</div>' +
													'</div>' +
												'</div>',
		confirm:'Are you sure you want to [%action%] this [%txt%]?',
		wrongError:'Oops! Something went wrong.',
		unknownError:'An unknown error occurred.',
		systemError:'The system has experienced a failure. Please try after sometime.',
		loadingMsg: 'Please wait... [%txt%].',
		loadTimeData: '[%txt%] taking longer than usual. Please wait... it may take 1 to 5 minutes.',
		actionSuccess: '[%txt%] has been [%action%] successfully!',		
		error: '<div class="statusicon"><img src="' + commonViewBaseUrl + 'img/common-images/failure.png" alt="Fail"></div><div class="text-danger text-center">[%txt%]</div>',
		success: '<div class="statusicon"><img src="' + commonViewBaseUrl + 'img/common-images/success.png" alt="Success"></div><div class="text-success text-center">[%txt%]</div>',
		reqFail: '<div class="statusicon"><img src="' + commonViewBaseUrl + 'img/common-images/failure.png" alt="Fail"></div><div class="text-danger text-center">Sorry, we couldn\'t process your request.<br /><div class="errorDesc">[%txt%]<div></div>',
		reqSuccess: '<div class="statusicon"><img src="' + commonViewBaseUrl + 'img/common-images/success.png" alt="Success"></div><div class="txt-thanks">Thank You!</div><div class="text-success text-center">[%txt%]</div>',
		browserSupport:'<div id="browserSupport"><p>You are seeing this page because you are using a unsupported browser.<br /> Currently we support the following browsers.</p><ul><li class="bsChrome">Chrome</li><li class="bsFirefox">Firfox</li><li class="bsSafari">Safari</li><li class="bsEdge">Internet Explorer Version 10 and later</li></ul></div>'
	},
	
	initialize : function() {
		var self = this;
		//self.loadCssFile(commonViewBaseUrl+'css/common.min.css');
		$('body').append(commonView.msg.networkModal + commonView.msg.notificationModal);
		$('#networkModal, #networkOverlay').hide();
		$('#msgModal, #msgOverlay').hide();
		setInterval("commonView.isUserOnline()", 30000);
		self.bindEvents();
	},
	
	isFileLoaded: function(url, tag, attr) {
		if (!url) url = (tag == 'script') ? "http://xxx.co.uk/xxx/script.js" : 'http://xxx.co.uk/xxx/style.css';
		var flag = false;
		$(tag).each(function() {
			if ($( this ).attr(attr) == url){
				flag = true;
				return false;
			}
		});
		return flag;
	},

	loadScript: function(url, callback) {
		var self = this;
		var script = document.createElement("script");
		script.type = "text/javascript";
		if (script.readyState) { //IE
			script.onreadystatechange = function() {
				if (script.readyState === "loaded" || script.readyState === "complete") {
					script.onreadystatechange = null;
					if (callback !== '' && callback !== undefined) {
						callback();
					}
				}
			};
		} else { //Others
			script.onload = function() {
				if (callback !== '' && callback !== undefined) {
					callback();
				}
			};
		}
		script.src = url;
		document.getElementsByTagName("head")[0].appendChild(script);
	},
	
	loadCssFile : function(filePath){
		var self = this;
		if(!self.isFileLoaded(filePath, 'link', 'href')){
			if (document.createStyleSheet) {
				document.createStyleSheet(filePath);
			} else {
				$('head').append('<link rel="stylesheet" href="' + filePath + '" type="text/css" />');
			}
		}		
	},
	
	isUserOnline : function(){
		var self = this;	
		if (!navigator.onLine) {
			$('#networkModal, #networkOverlay').show();
		} else {
			$('#networkModal, #networkOverlay').hide();
		}
	},
	
	bindEvents : function(){
		var self = this;
		
		$(document).off('click', '#btnNetRefresh').on('click', '#btnNetRefresh', function(e) {
			self.isUserOnline();
		});
		
		$(document).off('click', '#msgModal .btnOk, #msgModal .btnNo').on('click', '#msgModal .btnOk, #msgModal .btnNo', function(e) {
			self.hideMessage();
		});
		
	},
	
	getDate: function(date,seperator) {
		var self = this;
		var sep = (typeof seperator != 'undefined' && seperator != '') ? seperator : '-';
		var date = (typeof date != 'undefined' && date != '') ? new Date(date) : new Date();
		var dd = date.getDate();
		dd = (dd < 10) ? '0' + dd : dd;		
		var mm = date.getMonth() + 1;//January is 0!
		mm = (mm < 10) ? '0' + mm : mm;		
		var yyyy = date.getFullYear();
    return dd + sep + mm + sep + yyyy;
  },
	
	setStartEndDate : function(options){
		var self = this;
		var sep = (typeof options.seperator != 'undefined' && options.seperator != '') ? seperator : '-';
		var date = (typeof options.date != 'undefined' && options.date != '') ? new Date(date) : new Date();		
		var yLimit = (typeof options.yearLimit != 'undefined' && options.yearLimit != '') ? options.yearLimit : 10;		
		var dd = date.getDate();
		dd = (dd < 10) ? '0' + dd : dd;		
		var mm = date.getMonth() + 1;//January is 0!
		mm = (mm < 10) ? '0' + mm : mm;		
		var yyyy = date.getFullYear();
		var endYear = yyyy + yLimit;		
		$(options.startEl).val(dd + sep + mm + sep + yyyy);
		$(options.endEl).val('01' + sep + mm + sep + endYear);		
	},

	getMonthYear: function(expiry){
		var self = this;
		var data = {'expMonth':'','expYear':''};
		if(expiry.length == 7){
			var sections = expiry.split('/');
			data.expMonth = parseInt(sections[0], 10);
			data.expYear = parseInt(sections[1], 10);
		}	
		return data;
	},
	
	getObjectLength: function (obj) {
		var size = 0;
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) size++;
		}
		return size;
	},

	sortDesc: function (data, key) {
		var sortList = data.sort(function (a, b) {
			var keyA = new Date(a[key]),
			keyB = new Date(b[key]);
			// Compare the 2 dates (decending order)
			if (keyA > keyB) return -1;
			if (keyA < keyB) return 1;
			return 0;
		});
		return sortList;
	},
	
	getIEVersion: function () {
		var sAgent = window.navigator.userAgent;
		var Idx = sAgent.indexOf("MSIE");
		if (Idx > 0) {
			// If IE, return version number.
			return parseInt(sAgent.substring(Idx + 5, sAgent.indexOf(".", Idx)));
		} else if (!!navigator.userAgent.match(/Trident\/7\./)) {
			// If IE 11 then look for Updated user agent string.
			return 11;
		} else {
			//It is not IE
			return 0;
		}
	},
	
	getBrowserDetails: function(){
		var self = this;
		var objappVersion = navigator.appVersion;
		var objAgent = navigator.userAgent;
		var objbrowserName = navigator.appName;
		var objfullVersion = '' + parseFloat(navigator.appVersion);
		var objBrMajorVersion = parseInt(navigator.appVersion, 10);
		var objOffsetName, objOffsetVersion, ix;
		// In Chrome
		if ((objOffsetVersion = objAgent.indexOf("Chrome")) != -1) {
				objbrowserName = "Chrome";
				objfullVersion = objAgent.substring(objOffsetVersion + 7);
		}
		// In Microsoft internet explorer 
		else if ((objOffsetVersion = objAgent.indexOf("MSIE")) != -1) {
				objbrowserName = "MSIE";
				objfullVersion = objAgent.substring(objOffsetVersion + 5);
		}
		// In Firefox 
		else if ((objOffsetVersion = objAgent.indexOf("Firefox")) != -1) {
				objbrowserName = "Firefox";
				objfullVersion = objAgent.substring(objOffsetVersion + 8);
		}
		// In Safari 
		else if ((objOffsetVersion = objAgent.indexOf("Safari")) != -1) {
				objbrowserName = "Safari";
				objfullVersion = objAgent.substring(objOffsetVersion + 7);
				if ((objOffsetVersion = objAgent.indexOf("Version")) != -1) objfullVersion = objAgent.substring(objOffsetVersion + 8);
		}
		// For other browser "name/version" is at the end of userAgent
		else if ((objOffsetName = objAgent.lastIndexOf(' ') + 1) < (objOffsetVersion = objAgent.lastIndexOf('/'))) {
				objbrowserName = objAgent.substring(objOffsetName, objOffsetVersion);
				objfullVersion = objAgent.substring(objOffsetVersion + 1);
				if (objbrowserName.toLowerCase() == objbrowserName.toUpperCase()) {
						objbrowserName = navigator.appName;
				}
		}
		// trimming the fullVersion string at semicolon/space if present 
		if ((ix = objfullVersion.indexOf(";")) != -1) objfullVersion = objfullVersion.substring(0, ix);
		if ((ix = objfullVersion.indexOf(" ")) != -1) objfullVersion = objfullVersion.substring(0, ix);
		objBrMajorVersion = parseInt('' + objfullVersion, 10);
		if (isNaN(objBrMajorVersion)) {
				objfullVersion = '' + parseFloat(navigator.appVersion);
				objBrMajorVersion = parseInt(navigator.appVersion, 10);
		}
		//console.log('Browser name = ' + objbrowserName + '\n' + 'Full version = ' + objfullVersion + '\n' + 'Major version = ' + objBrMajorVersion + '\n' + 'navigator.appName = ' + navigator.appName + '\n' + 'navigator.userAgent = ' + navigator.userAgent);
		var browserDetails = {
				'BrowserName': objbrowserName,
				'FullVersion': objfullVersion,
				'MajorVersion': objBrMajorVersion,
				'AppName': navigator.appName,
				'UserAgent': navigator.userAgent
		};
		return browserDetails;
	},
	
	callJsonService: function(url, requestType, successCallback, errorCallback, postdata, showLoader, loaderMsg) {
		$.support.cors = true;
		var self = this;
		if(showLoader){
			commonView.addLoader(loaderMsg);
		}
		var ua = window.navigator.userAgent;
		var msie = ua.indexOf("MSIE ");
		if (msie > 0 && parseInt(ua.substring(msie + 5, ua.indexOf(".", msie))) <= 9 && window.XDomainRequest) {
			function createCORSRequest(method, apiUrl) {
				var xhr = new XMLHttpRequest();
				if ("withCredentials" in xhr) {
					xhr.open(method, apiUrl, true);
				} else if (typeof XDomainRequest != "undefined") {
					xhr = new XDomainRequest();
					xhr.open(method, apiUrl);
				} else {
					xhr = null;
				}
				return xhr;
			}

			var request = createCORSRequest(requestType, url);
			if (request) {
				request.onload = function() {
					commonView.removeLoader();
					var str = $.trim(request.responseText);
					if (str != '') {
						if (typeof successCallback === "function") {
							var res = JSON.parse(str);
							successCallback(postdata, res, request.contentType);
						}
					} else {
						errorCallback(postdata, {}, 'No response found');
					}
				};
				request.onerror = function() {
					commonView.removeLoader();
					var str = $.trim(request.responseText);
					if (str != '') {
						if (typeof errorCallback === "function") {
							var err = JSON.parse(str);
							//var status = e.status;
							//var errMsg = self.msg.reqFail.replace('[%txt%]',e.statusText);
							errorCallback(postdata, err, err);
						}
					} else {
						errorCallback(postdata, {}, 'No response found');
					}
				};
				var data = (typeof postdata === 'undefined') ? '' : JSON.stringify(postdata);
				setTimeout(function(){
					request.send(data);
				}, 0);
			}
		} else {
			$.ajax({
				type: requestType,
				url: url,
				//async:false,
				//global:false,
				//dataType:'json',
				//contentType : 'application/json; charset=utf-8',
				data: (typeof postdata === 'undefined') ? '' : JSON.stringify(postdata),
				success: function(data, status) {
					commonView.removeLoader();
					var str = $.trim(data);
					if (str != '') {
						if (typeof successCallback === "function") {
							//var res = JSON.parse(str);
							successCallback(postdata, data, status);
						}
					} else {
						errorCallback(postdata, {}, 'No response found');
					}
				},
				error: function(e) {
					commonView.removeLoader();
					var str = $.trim(e);
					if (str != '') {
						var status = e.status;
						var errMsg = self.msg.reqFail.replace('[%txt%]', e.statusText);
						if (typeof errorCallback === "function") {
							//var err = JSON.parse(str);
							errorCallback(postdata, e, e.statusText);
						}
					} else {
						errorCallback(postdata, {}, 'No response found');
					}
				}
			});
		}
	},	
	
	showMessage : function(options){
		var self = this;
		var div = $('#msgModal');
		$(div).find('.btn').hide();
		var msgBoxCls = (typeof options.msgBoxCls != 'undefined') ? 'detail-box animated zoomIn '+options.msgBoxCls : 'detail-box animated zoomIn'; 
		var okBtnCls = (typeof options.okBtnCls != 'undefined') ? 'btn btnOk btn-primary '+options.okBtnCls : 'btn btnOk btn-primary'; 
		var yesBtnCls = (typeof options.yesBtnCls != 'undefined') ? 'btn btnYes pull-right  btn-primary '+options.yesBtnCls : 'btn btnYes pull-right btn-primary'; 
		var noBtnCls = (typeof options.noBtnCls != 'undefined') ? 'btn btnNo pull-left btn-default '+options.noBtnCls : 'btn btnNo pull-left btn-default'; 
		var okBtnLbl = (typeof options.okBtnLbl != 'undefined') ? options.okBtnLbl : 'Ok'; 
		var yesBtnLbl = (typeof options.yesBtnLbl != 'undefined') ? options.yesBtnLbl : 'Yes'; 
		var noBtnLbl = (typeof options.noBtnLbl != 'undefined') ? options.noBtnLbl : 'No'; 
		var btn = (options.showOk) ? '.btnOk' : '.btnYes, .btnNo' ;
		$(div).find('#msgDiv').html(options.msg).removeClass('success_msg error_msg note_msg').addClass(options.msgCls);
		$(div).find('#msgBox').attr('class',msgBoxCls);
		$(div).find('.btnOk').attr('class',okBtnCls).html(okBtnLbl);
		$(div).find('.btnYes').attr('class',yesBtnCls).html(yesBtnLbl);
		$(div).find('.btnNo').attr('class',noBtnCls).html(noBtnLbl);
		$(div).find(btn).show();
		$('#msgOverlay, #msgModal').show();
		$('body').addClass('hiddenOverflow');
	},
	
	hideMessage : function(){
		$('#msgModal #msgBox').attr('class','detail-box animated zoomIn');
		$('#msgModal #msgDiv').html('').removeClass('success_msg error_msg note_msg');
		$('#msgModal, #msgOverlay').hide();
		$('body').removeClass('hiddenOverflow');
	},
	
	addLoader: function(msg){
		var self = this;
		$('#loaderOverlay').remove();					
		$('body').append('<div id="loaderOverlay"><div class="loadimg"></div><div class="status-msg">'+msg+'</div></div>');
		if(msg != ''){
			$('#loaderOverlay .status-msg').css('display','inline-block');
		}
	},
	
	setTimeoutLoaderMsg: function(msg,time){
		var self = this;
		self.loadTimeout = setTimeout(function() {
			$('#loaderOverlay .status-msg').html(msg);
		}, time);
	},
	
	removeLoader: function(){
		var self = this;
		$('#loaderOverlay').remove();	
		clearTimeout(self.loadTimeout);		
	},
	
	openNewWindow:function(flag,url){
		var self = this;
		var pageUrl = (typeof url != 'undefined' && url != '') ? url : commonViewBaseUrl+'request.html';
		if(!flag){
			txnCancelledByUser = true;
			bankWindow = window.open(pageUrl,'myWindow','directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=550,height=350');
			bankWindow.moveTo(100, 100);			
			commonView.addLoader(config.msg.loadingMsg.replace('[%txt%]','your payment is in process'));
			var loop = setInterval(function() {   
				if(bankWindow.closed) {  
					clearInterval(loop);  
					if(txnCancelledByUser){
						commonView.removeLoader();  
						paynimoCheckout.showFinalResponse({'isSuccess': false, 'errorCode':-1, 'errorDesc':config.msg.txnCancelled, 'msgStr':commonView.msg.reqFail.replace('[%txt%]',config.msg.txnCancelled), 'msgBoxCls':'', 'msgCls':'error_msg', 'res':{tarCall: config.tarCall,features:config.features, reqData:config.reqData}});     
					}
				}  
			}, 1000);
		}
	},
	
	closeNewWindow:function(){
		var self = this;
		txnCancelledByUser = false;
		if(typeof bankWindow !== 'undefined'){
			bankWindow.close();
		}
	}
};						

var validationView = {
	regex:{
		letter:/^[a-zA-Z ]+$/,
		specialChar:/[/[0-9!@#$%^&*()\-+=_?[\]{}|;':,."\/<>]+/,
		alphanumeric: /^(?:\s*[a-zA-Z0-9]{2,}\s*)*$/,
		number:/^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/,
		email: /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,4}$/,
		mobile: /^\d{10}$/,  /* /^((\\+91-?)|0)?[0-9]{10}$/  */
		emailOrMobile: /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,4}|(^\d{10}$)$/,
		password: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
		date:/^(0[1-9]|[12][0-9]|3[01])[-/.](0[1-9]|1[012])[-/.](19|20)\d\d$/,
		accountNo: /^[0-9]|([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$/,
		aadharNo: /^\d{16}$/,
		ifsc: /^[A-Z|a-z]{4}[0][A-Z|a-z|0-9]{6}$/,
		mmid: /^\d{7}$/,
		amount:/^\d+(?:\.\d{1,2})?$/,  // range 1-5000 with 2 decimal  OR for start with 0 /^\d{1,4}(?:\.\d{1,2})?$/
		percentageEx: /(^100([.]0{1,2})?)$|(^\d{1,2}([.]\d{1,4})?)$/,
		promocode:/^[a-zA-Z0-9]{6}$/,
		cvv:/^\d{3,4}$/,
		otp:/^\d{4,8}$/,	
		month:/^0[1-9]$|^[0]*1[0-2]$/,
		year: /^[1-9][0-9][0-9][0-9]$/, /* 1000 to 9999 */
		isMobile: /^\d{1,9}$|^\d{11,}$/,
		tenDigitMobile: /^\d{10}$/,
		siIdentifier: /^[ A-Za-z0-9_-]+$/,
		card: {
			amex: /^(34|37)/,
			visa: /^4/,
			master: /^5[1-5]/,
			maestro: /^(50|63|66|5[6-8]|6[8-9]|600[0-9]|6010|601[2-9]|60[2-9]|61|620|621|6220|6221[0-1])/,
			maestro16d: /^(508125|508126|508159|508192|508227|504809)/,
			diner: /^(30|36|38)/,
			rupay: /^(606([1-9])|607|608|508|652)/,
			//misc: /^(0)/,
			discover: /^6(?:011|5)/,
			jcb: /^(?:2131|1800|35)/
		}	
	},
	length: {
		amex: 15,
		visa: 16,
		master: 16,
		maestro: 19,
		maestro16d: 16,
		diner: 14,
		rupay: 16,
		discover: 16,
		jcb: 16
	},
	allowedCardType:['visa', 'master'],
	msg:{
		required: '*Required',
		blank: '[%txt%] can\'t be blank.',
		invalidData: 'Please enter valid [%txt%]',
		selectOption : 'Please select [%txt%]',
		checkboxChecked : 'Please [%txt%]',
		invalidPassword:'Password must contain at least one uppercase letter, one number and special character!',
		matchPassword:'Passwords do not match!',
		tenCharMobile: 'Enter valid 10 digit mobile number.',
		invalidExpiry: 'The expiry date is before today\'s date. Please enter a valid expiry date.',
		dateFormat: '[%txt%] date must be valid and in the format dd-mm-yyyy.',
    lessDate: '[%txt%] date should not be less than today\'s date.',
		invalidDate: 'End date should be greater than start date.',
		invalidExpiryFormat:'The expiration date formate is not correct!',
		invalidExpiry:'The expiration date is not valid.',
		passedExpiry:'The expiration date has passed.',
		supportedCard: 'Please enter [%txt%] card only.'
	},
	initialize : function() {
		var self = this;
		self.bindEvents();
	},
		
	bindEvents : function() {
		var self = this;
		
		/* numpad for input type password(use type="tel" instead of password and apply CSS CLASS "telpass" for each instances where input type password) */
		$(document).on('keyup', '.telpass', function (event) {
			try{
				var style = window.getComputedStyle(this);
				//console.log(style);
				if (typeof style != 'undefined' && style.webkitTextSecurity) {
					//do nothing
				} else {
					$(this).attr("type", "password");
				}
			} catch(e){
				$(this).attr("type", "password");
			}
		});
		
		$(document).off('input keyup change', '.blank-field').on('input keyup change', '.blank-field', function() {
			self.validateRequired({ 'el' : this, 'msg': self.msg.required});
		}); 
		
		$(document).off('input keyup change', '.cardNum-field').on('input keyup change', '.cardNum-field', function() {
			var str = $(this).val();
			$(this).val(str.replace(/[^0-9\ ]/g, ''));
			var crdnumber = $(this).val().split(" ").join(""); // remove space
			if (crdnumber.length > 0) {
				crdnumber = crdnumber.match(new RegExp('.{1,4}', 'g')).join(" ");
			}
			$(this).val(crdnumber);
			var div = $(this).parents('.instrumentForm');
			self.validateCardNo({
				'el': this,
				'elClass': $(this).attr('data-cls'),
				'msg': self.msg.invalidData.replace('[%txt%]', $(this).attr('data-val')),
				'expiryEl': $(div).find('.expiry-field'),
				'cvvEl': $(div).find('.cvv-field'),
				'maestroEl': $(div).find('.maestro-field')
			});
			self.moveToNext(div, this, $(div).find($(this).attr('data-next')));
		});	
		
		$(document).off('change', '.maestro-field').on('change', '.maestro-field', function(e) {
			var div = $(this).parents('.instrumentForm');
			self.clearValidation($(div).find('.expiry-field, .cvv-field'),true);
			if ($(this).prop('checked')) {
				$(div).find('.cardNum-field').attr('data-next','.letter-field');
				$(div).find('.expiryCvvSection').hide();
			} else {
				$(div).find('.cardNum-field').attr('data-next','.expiry-field');
				$(div).find('.expiryCvvSection').show();				
			}
		});		
		
		$(document).off('input keyup change', '.expiry-field').on('input keyup change', '.expiry-field', function(e) {
			var str = $(this).val();
			$(this).val(str.replace(/[^0-9\/]/g, ''));			
			$(this).closest('.form-group').find(".err_msg").removeClass("err-msg-container").html('');	
			var div = $(this).parents('.instrumentForm');
			var expiry = $(this).val();
			var currentMonth = new Date().getMonth() + 1;
			var currentYear  = new Date().getFullYear();
			if (!isNaN(expiry)) {
				if(expiry.length == 2 && expiry == 0){
					temp_val = expiry.toString().substr(0, 1);
					$(this).val(temp_val);
				}else{
					if (expiry > 1 && expiry < 10 && expiry.length == 1) {
						temp_val = "0" + expiry + "/"+currentYear.toString().substr(0, 2);
						$(this).val(temp_val);
					} else if (expiry >= 1 && expiry < 10 && expiry.length == 2 && e.keyCode != 8) {
						temp_val = expiry + "/"+currentYear.toString().substr(0, 2);
						$(this).val(temp_val);
					} else if (expiry > 9 && expiry.length == 2 && e.keyCode != 8) {
						temp_val = expiry + "/"+currentYear.toString().substr(0, 2);
						$(this).val(temp_val);
					} 
				}
			}else{
				if(e.keyCode == 8 && expiry.length == 3){
					temp_val = expiry.toString().substr(0, 1);
					$(this).val(temp_val);
				}
			}
			self.validateExpiry({'el': this});
			self.moveToNext(div, this, $(div).find($(this).attr('data-next')));			
		});
		
		$(document).off('input keyup change', '.month-field').on('input keyup change', '.month-field', function() {
			var str = $(this).val();
			$(this).val(str.replace(/[^0-9]/g, ''));
			var div = $(this).parents('.instrumentForm');
			self.validateExpiryMonthYear({
				'el': this,
				'regex': self.regex.month,
				'msg': self.msg.invalidData.replace('[%txt%]', $(this).attr('data-val')),
				'monthEl': $(div).find('.month-field'),
				'yearEl': $(div).find('.year-field')
			});
			self.moveToNext(div, this, $(div).find($(this).attr('data-next')));
		});  
		
		$(document).off('input keyup change', '.year-field').on('input keyup change', '.year-field', function() {
			var str = $(this).val();
			$(this).val(str.replace(/[^0-9]/g, ''));
			var div = $(this).parents('.instrumentForm');
			self.validateExpiryMonthYear({
				'el': this,
				'regex': self.regex.year,
				'msg': self.msg.invalidData.replace('[%txt%]', $(this).attr('data-val')),
				'monthEl': $(div).find('.month-field'),
				'yearEl': $(div).find('.year-field')
			});
			self.moveToNext(div, this, $(div).find($(this).attr('data-next')));
		});

		$(document).off('keypress, keydown', '.year-field').on('keypress, keydown', '.year-field', function(e) {
			if ((this.selectionStart < 2) || ((this.selectionStart == 2) && (e.which == 8))) {
				return false;
			}
		});
		
		$(document).off('input keyup change', '.cvv-field').on('input keyup change', '.cvv-field', function() {
			var str = $(this).val();
			$(this).val(str.replace(/[^0-9]/g, ''));
			self.validateValue({ 'el' : this, 'regex' : self.regex.cvv, 'msg':self.msg.invalidData.replace('[%txt%]', $(this).attr('data-val'))});
			var div = $(this).parents('.instrumentForm');
			self.moveToNext(div, this, $(div).find($(this).attr('data-next')));
		}); 
		
		$(document).off('input keyup change', '.ifsc-field').on('input keyup change', '.ifsc-field', function() {
			self.validateValue({ 'el' : this, 'regex' : self.regex.ifsc, 'msg':self.msg.invalidData.replace('[%txt%]', $(this).attr('data-val'))});
		}); 		
		
		$(document).off('input keyup change', '.mmid-field').on('input keyup change', '.mmid-field', function() {
			self.validateValue({ 'el' : this, 'regex' : self.regex.mmid, 'msg':self.msg.invalidData.replace('[%txt%]', $(this).attr('data-val'))});
		}); 
		
		$(document).off('input keyup change', '.otp-field').on('input keyup change', '.otp-field', function() {
			var str = $(this).val();
			$(this).val(str.replace(/[^0-9]/g, ''));
			self.validateValue({ 'el' : this, 'regex' : self.regex.otp, 'msg':self.msg.invalidData.replace('[%txt%]', $(this).attr('data-val'))});
		});  
		
		$(document).off('input keyup change', '.letter-field').on('input keyup change', '.letter-field', function() {
			self.validateValue({ 'el' : this, 'regex' : self.regex.letter, 'msg':self.msg.invalidData.replace('[%txt%]', $(this).attr('data-val'))});
		});
		
		$(document).off('input keyup change', '.alphanum-field').on('input keyup change', '.alphanum-field', function() {
			self.validateValue({ 'el' : this, 'regex' : self.regex.alphanumeric, 'msg':self.msg.invalidData.replace('[%txt%]', $(this).attr('data-val'))});
		}); 
		
		$(document).off('input keyup change', '.num-field').on('input keyup change', '.num-field', function() {	
			self.validateValue({ 'el' : this, 'regex' : self.regex.number, 'msg':self.msg.invalidData.replace('[%txt%]', $(this).attr('data-val'))});
		});
		
		$(document).off('input keyup change', '.date-field').on('input keyup change', '.date-field', function(e) {
			var str = $(this).val();
			$(this).val(str.replace(/[^0-9\- ]/g, ''));
			str = $(this).val();
			if (e.keyCode != 193 && e.keyCode != 111) {
					if (e.keyCode != 8) {
							if (str.length == 2) {
									$(this).val(str + "-");
							} else if (str.length == 5) {
									$(this).val(str + "-");
							}
					} else {
							var temp = str;
							if (str.length == 6) {
									$(this).val(temp.substring(0, 4));
							} else if (str.length == 3) {
									$(this).val(temp.substring(0, 1));
							}
					}
			} else {
					var temp = str;
					var tam = str.length;
					$(this).val(temp.substring(0, tam - 1));
			}
			if($(this).hasClass('startDate')){
				validationView.validateDate({
					'startDateEl': '#'+$(this).attr('id'),
					'endDateEl': '#'+$(this).attr('data-endDateEl')
				});
			} else if($(this).hasClass('endDate')){
				validationView.validateDate({
					'startDateEl': '#'+$(this).attr('data-startDateEl'),
					'endDateEl': '#'+$(this).attr('id')
				});
			} else{
				self.validateValue({ 'el' : this, 'regex' : self.regex.date, 'msg':self.msg.invalidData.replace('[%txt%]', $(this).attr('data-val'))});	
			}			
		});
		
		$(document).off('input keyup change', '.mobile-field').on('input keyup change', '.mobile-field', function() {
			var str = $(this).val();  
			$(this).val(str.replace(/[^0-9]/g,''));
			self.validateValue({ 'el' : this, 'regex' : self.regex.mobile, 'msg':self.msg.invalidData.replace('[%txt%]', $(this).attr('data-val'))});
		});
		
		$(document).off('input keyup change', '.email-field').on('input keyup change', '.email-field', function() {
			var str = $(this).val(); 
			self.validateValue({ 'el' : this, 'regex' : self.regex.email, 'msg':self.msg.invalidData.replace('[%txt%]', $(this).attr('data-val'))});
		});
		
		$(document).off('input keyup change', '.pass-field').on('input keyup change', '.pass-field', function() {
			self.validateValue({ 'el' : this, 'regex' : self.regex.password, 'msg':self.msg.invalidPassword});
		});
		
		$(document).off('input keyup change', '.username-field').on('input keyup change', '.username-field', function() {
			var str = $(this).val(); 
			if(str != ''){
				self.validateUsername({ 'el' : this , 'msg': self.msg.invalidData.replace('[%txt%]', $(this).attr('data-val'))});
			}
		});
		
		$(document).off('input keyup change', '.amount-field').on('input keyup change', '.amount-field', function(e) {
			var str = $(this).val(); 
			var newNum = str.replace(/[^0-9\.]/g,'').replace(/\./, "x").replace(/\./g, "").replace(/x/, ".");
			$(this).val(newNum);
			self.validateValue({ 'el' : this, 'regex' : self.regex.amount, 'msg': self.msg.invalidData.replace('[%txt%]', $(this).attr('data-val'))});
		});		
		
		$(document).off('change', '.select-field').on('change', '.select-field', function() {
			self.validateSelect({ 'el' : this, 'msg': self.msg.selectOption.replace('[%txt%]', $(this).attr('data-val'))});
		});			
		
		$(document).off('change', '.check-field').on('change', '.check-field', function() {
			self.validateCheck({ 'el' : this, 'msg': self.msg.checkboxChecked.replace('[%txt%]', $(this).attr('data-val'))});
		});
		
		$(document).off('keyup', '.regex-field').on('keyup', '.regex-field', function() {
			var regex = new RegExp($(this).attr('data-regex'));
			self.validateValue({ 'el' : this, 'regex' : regex, 'msg':self.msg.invalidData.replace('[%txt%]', $(this).attr('data-val'))});
		});
		
	},
	
	getCardType : function(cardNum){
		var self = this;
		var cardRegex = self.regex.card;
		var tmplen = cardNum.substring(0, 6); 
		var cardType = '';
		if (tmplen.length >= 6) {
			for (var key1 in cardRegex) {
				var regex = cardRegex[key1]; 
				if (tmplen.match(regex)) {
					cardType = key1;
				} 
			}
		}
		return cardType;
	},
	
	getMaskedCardNumber: function(cardNum){
		var self = this;
		var len = cardNum.length;
		var maskedCardNo = cardNum;
		if(len == 14){
			maskedCardNo = cardNum.replace(/\d{10}(\d{4})/, "XXXXX XXXX X$1");
		} else if(len == 15){
			maskedCardNo = cardNum.replace(/\d{11}(\d{4})/, "XXXX XXXXXX X$1");
		} else if(len == 16){
			maskedCardNo = cardNum.replace(/\d{12}(\d{4})/, "XXXX XXXX XXXX $1");
		} else if(len == 19){
			maskedCardNo = cardNum.replace(/\d{15}(\d{4})/, "XXXX XXXX XXXX XXX$1");
		}		
		return maskedCardNo;
	},

	clearValidation: function(el,clearForm) {
		var self = this;
		$(el).removeClass("txt-invalid txt-valid");
		$(el).closest('.form-group').find(".err_msg").removeClass("err-msg-container").html('');
		if(clearForm){	
			$(el).val('');
		}
		$(el).each(function( index ) {
			if($(this).hasClass('cardNum-field')){
					$(this).attr('class',$(this).attr('data-cls'));
				}
		});		
		/* self.addValidationMark(el); */
	},	
	
	setValidEl: function(el) {
		var self = this;
		$(el).removeClass("txt-invalid").addClass("txt-valid");
		$(el).closest('.form-group').find(".err_msg").removeClass("err-msg-container").html('');
		/* self.addValidationMark(el); */
	},
	
	setInvalidEl: function(option){
		var self = this;
		var msg = self.msg.required;
		$(option.el).each(function( index ) {
			if($(this).hasClass('check-field')){
				msg = self.msg.checkboxChecked.replace('[%txt%]', $(this).attr('data-val'));
			} else if($(this).val() != ''){
				msg = self.msg.invalidData.replace('[%txt%]', $(this).attr('data-val'));
			}
			msg = (typeof option.msg !== 'undefined') ? option.msg : msg;
			$(this).removeClass("txt-valid").addClass("txt-invalid");
			$(this).closest('.form-group').find(".err_msg").addClass("err-msg-container").html(msg);
			/* self.addValidationMark(this); */
		});
	},

  validateSelect : function(option){
		var self = this;
		var val = $(option.el).val();
		if(val == "0" || val == "" || val == null){
			self.setInvalidEl({'el':option.el,'msg':option.msg});
		}else{
			self.setValidEl(option.el);
		}
	},
	
  validateCheck : function(option){
		var self = this;
		if(!$(option.el).prop('checked')){
			self.setInvalidEl({'el':option.el,'msg':option.msg});
		}else{
			self.setValidEl(option.el);
		}
	},
	
	validateRequired: function(option) {
		var self = this;
		var username = $(option.el);
		var val = username.val();
		if (val == "") {
			self.setInvalidEl({'el':option.el,'msg':option.msg});
		} else {
			self.setValidEl(option.el);
		}
		/* self.addValidationMark(option.el); */
	},
	
	validateUsername : function(option){
		var self = this;
		var username = $(option.el);
		var val = username.val();
		if(val == ""){	
			self.clearValidation(option.el,false);
		}else{
			if(val.match(self.regex.tenDigitMobile)){
				 $(option.el).attr('maxlength', '10');                                                          
			}else{
				 $(option.el).attr('maxlength', '100');
			}
			if(val.match(self.regex.isMobile)){	
				self.setInvalidEl({'el':option.el,'msg':self.msg.tenCharMobile});
			}else if(val.match(self.regex.tenDigitMobile) || val.match(self.regex.email)){
				self.setValidEl(option.el);
			}else{
				self.setInvalidEl({'el':option.el, 'msg':option.msg});
			}
		}
		/* self.addValidationMark(option.el); */
	},
	
	validateValue: function(option) {
		var self = this;
		var element = $(option.el);
		var val = element.val();
		if (val == "") {
			self.clearValidation(option.el,false);
		} else {
			if (val.match(option.regex)) {
				self.setValidEl(option.el);
			} else {
				self.setInvalidEl({'el':option.el,'msg':option.msg});
			}
		}
		/* self.addValidationMark(option.el); */
	},
	
	validateExpiry: function(option) {
		var self = this;
		var element = $(option.el);
		var val = element.val();
		if (val == "") {
			self.clearValidation(option.el,false);		
		} else {
			if(val.length < 7){
				self.setInvalidEl({'el':option.el,'msg':self.msg.invalidExpiry});	
			}else{
				var currentMonth = new Date().getMonth() + 1;
				var currentYear  = new Date().getFullYear();
				var sections = val.split('/');
				var year         = parseInt(sections[1], 10),
						month        = parseInt(sections[0], 10);
				if (sections.length !== 2) {
					self.setInvalidEl({'el':option.el,'msg':self.msg.invalidExpiryFormat});
				} else if (month <= 0 || month > 12 || year > currentYear + 20) {
					self.setInvalidEl({'el':option.el,'msg':self.msg.invalidExpiry});
				} else if (year < currentYear || (year == currentYear && month < currentMonth)) {
					self.setInvalidEl({'el':option.el,'msg':self.msg.passedExpiry});
				}else{
					self.setValidEl(option.el);
				}
			}
		}
		/* self.addValidationMark(option.el); */
	},
	
	validateExpiryMonthYear: function(option) {
		var self = this;
		var element = $(option.el);
		var val = element.val();
		if (val == "") {
			self.clearValidation(option.el,false);			
		} else {
			if (val.match(option.regex)) {
				$(option.el).removeClass("txt-invalid").addClass("txt-valid");
				$(option.el).parents('.datecapture').find(".err_msg").removeClass("err-msg-container").html('');
				var exMonth = $(option.monthEl).val();
				var exYear = $(option.yearEl).val();
				var today = new Date();
				var someday = new Date();
				someday.setFullYear(exYear, exMonth, 1);
				$(option.monthEl).removeClass("txt-invalid").addClass("txt-valid");
				$(option.yearEl).removeClass("txt-invalid").addClass("txt-valid");
				$(option.monthEl).parents('.datecapture').find(".err_msg").removeClass("err-msg-container").html('');
				if (!exMonth.match(self.regex.month)) {
					$(option.monthEl).removeClass("txt-valid").addClass("txt-invalid");
					$(option.yearEl).removeClass("txt-valid").addClass("txt-invalid");
					$(option.monthEl).parents('.datecapture').find(".err_msg").addClass("err-msg-container").html(self.msg.invalidData.replace('[%txt%]', 'month'));
				}else{				
					if (exYear != '20' && someday < today) {
						$(option.monthEl).removeClass("txt-valid").addClass("txt-invalid");
						$(option.yearEl).removeClass("txt-valid").addClass("txt-invalid");
						$(option.monthEl).parents('.datecapture').find(".err_msg").addClass("err-msg-container").html(self.msg.invalidExpiry);
					}
				}
			} else {
				self.setInvalidEl({'el':option.el,'msg':option.msg});			
			}
		}
		/* self.addValidationMark(option.monthEl);
		self.addValidationMark(option.yearEl); */
	},

	validateDate: function(option) {
		var self = this;
		var date = new Date();
		var toCompare = true;
		var start = $.trim($(option.startDateEl).val());
		var a = start.split('-');
		var startDate = new Date(a[2], a[1], a[0]);
		var end = $.trim($(option.endDateEl).val());
		var b = end.split('-');
		var endDate = new Date(b[2], b[1], b[0]);
		self.setValidEl(option.startDateEl);
		self.setValidEl(option.endDateEl);
		if (start === "") {
			toCompare = false;
			self.setInvalidEl({'el':option.startDateEl,'msg':self.msg.blank.replace('[%txt%]', 'Start date')});	
		} else if (!self.validateDateFormat(start)) {
			toCompare = false;
			self.setInvalidEl({'el':option.startDateEl,'msg':self.msg.dateFormat.replace('[%txt%]', 'Start')});
		} else if (startDate < date) {
			toCompare = false;
			self.setInvalidEl({'el':option.startDateEl,'msg':self.msg.lessDate.replace('[%txt%]', 'Start')});
		}
		if (end === "") {
			toCompare = false;
			self.setInvalidEl({'el':option.endDateEl,'msg':self.msg.blank.replace('[%txt%]', 'End date')});	
		} else if (!self.validateDateFormat(end)) {
			toCompare = false;
			self.setInvalidEl({'el':option.endDateEl,'msg':self.msg.dateFormat.replace('[%txt%]', 'End')});	
		} else if (endDate < date) {
			toCompare = false;
			self.setInvalidEl({'el':option.endDateEl,'msg':self.msg.lessDate.replace('[%txt%]', 'End')});
		}
		if (toCompare && !(startDate < endDate)) {
			self.setInvalidEl({'el':option.startDateEl,'msg':self.msg.invalidDate});
			self.setInvalidEl({'el':option.endDateEl,'msg':self.msg.invalidDate});
		}
		/* self.addValidationMark(option.startDateEl);
		self.addValidationMark(option.endDateEl); */
		/* if($(option.el).hasClass('txt-valid') && option.el.id == 'newDebitStartDate'){   
		 var d = new Date(a[2],a[1],'01');
		 var intYear = d.getFullYear() + 30;
		 $("#newDebitEndDate").val('01-'+a[1]+'-'+intYear);
		} */
		/* else{
				$("#newDebitEndDate").val('');
			 } */
	},

	validateDateFormat: function(currVal) {
		var rxDatePattern = /^(\d{2})(-)(\d{2})(-)(\d{4})$/;
		// is format OK?
		var dtArray = currVal.match(rxDatePattern);
		if (dtArray === null) {
			return false;
		}
		//Checks for dd-mm-yyyy format.
		dtDay = parseInt(dtArray[1], 10);
		dtMonth = parseInt(dtArray[3], 10);
		dtYear = parseInt(dtArray[5], 10);
		var checkDtMonth = (dtMonth === 4 || dtMonth === 6 || dtMonth === 9 || dtMonth === 11);
		var checkDtDay = (checkDtMonth && dtDay === 31);
		if (dtMonth < 1 || dtMonth > 12) {
			return false;
		} else if (dtDay < 1 || dtDay > 31) {
			return false;
		} else if (checkDtDay) {
			return false;
		} else if (dtMonth === 2) {
			var isleap = ((dtYear % 4 === 0 && dtYear % 100 !== 0) || dtYear % 400 === 0);
			if (dtDay > 29 || (dtDay === 29 && !isleap)) {
				return false;
			}
			// the date should be greater than current date
		}
		return true;
	},

	validateAmount: function(option) {
		var self = this;
		var element = $(option.el);
		var val = element.val();
		if (val == "") {
			self.clearValidation(option.el,false);
		} else {
			if (parseInt(val) >= option.min){
				if(option.max == 'Infinity'){
					self.setValidEl(option.el);
				}else{
					if(parseInt(val) <= option.max) {
						self.setValidEl(option.el);
					}else{
						self.setInvalidEl(option.el);
					}
				}
			} else {
				self.setInvalidEl({'el':option.el,'msg':option.msg});
			}
		}
		/* self.addValidationMark(option.el); */
	},
	
	validateCardNo: function(option) {
		var self = this;
		var num = $(option.el).val();
		var cardRegex = self.regex.card;
		var setLen = self.length;
		var cardType = "";

		$(option.el).attr('class', option.elClass);
		if (num == "") {
			$(option.el).attr('class', option.elClass);
			self.clearValidation(option.el,false);
			//return false;
		} else {
			// Function to Validation Cards Number and get Cards Type 
			var tmplen = num.split(" ").join("").substring(0, 6); // tmplen stores first 6 digit of Cards number
			var setCardNumber = num.split(" ").join("");
			$(option.cvvEl).attr('maxlength', '3');

			if (tmplen.length >= 6) {
				// Get Cards Type 
				var matchCardSeq = 0;
        for (var key1 in cardRegex) {
					var regex = cardRegex[key1]; // get Card Label (visa,master...)
					if (tmplen.match(regex)) {
						var cardType = key1;
						matchCardSeq++;
						$(option.el).attr('class', cardType + ' ' +option.elClass);
						if (key1 == "amex") {
							$(option.cvvEl).attr('maxlength', '4');
						}
					} // condition to match regex and get the card type.
				}
				if (matchCardSeq > 1) { //to remove logo if sequence matches with more than one card type
					$(option.el).css('background-image', 'none');
				} else {
					$(option.el).removeAttr('style');
				}
				
				// Get Card Length in Value (L) 
				for (var key2 in setLen) {
					var matchLen = setLen[key2];
					var ValidLen = cardType.match(key2);
					if (cardType.match(key2)) {
						var L = matchLen;
						$(option.el).attr('maxlength', matchLen + 3);
					}
				}
			}
			if (cardType == "") {
				self.setInvalidEl({'el':option.el,'msg':option.msg});
			} else {
				/* if($.inArray(cardType, self.allowedCardType) == -1){
					self.setInvalidEl({'el':option.el,'msg':self.msg.supportedCard.replace('[%txt%]', self.allowedCardType.join(" / "))});
					return;
				} */          
				if (cardType == "maestro" || cardType == "maestro16d") {
					if(cardType == "maestro"){
						$(option.el).attr('maxlength', '23');
					}
					$(option.maestroEl).closest('.maestroCheck').show();
				}else{
					$(option.maestroEl).closest('.maestroCheck').hide();
					$(option.maestroEl).prop('checked',false);
					$(option.maestroEl).attr('checked',false);
					$(option.maestroEl).trigger('change');
				}
				if (setCardNumber.length === L) {
					if (!self.validateMod10(setCardNumber)) {
						self.setInvalidEl({'el':option.el,'msg':option.msg});
					} else {
						self.setValidEl(option.el);
					}
				} else {
					self.setInvalidEl({'el':option.el,'msg':option.msg});
				}
			}
		}
		/* self.addValidationMark(option.el); */
	},

	validateMod10: function(cardNumber) {
		var self = this;
		var ar = new Array(cardNumber.length);
		var i = 0,
			sum = 0;
		for (i = 0; i < cardNumber.length; ++i) {
			ar[i] = parseInt(cardNumber.charAt(i));
		}
		for (i = ar.length - 2; i >= 0; i -= 2) {
			ar[i] *= 2;
			if (ar[i] > 9) ar[i] -= 9;
		}
		for (i = 0; i < ar.length; ++i) {
			sum += ar[i];
		}
		return (((sum % 10) == 0) ? true : false);
	},

	moveToNext: function(parentFieldID,currentFieldID, nextFieldID) {
		if(!$(parentFieldID).find(currentFieldID).hasClass('txt-valid')){
			return;
		}
		var val = $(parentFieldID).find(currentFieldID).val();
		var len = $(parentFieldID).find(currentFieldID).attr('maxlength');
		if (val.length >= len) {
			$(parentFieldID).find(nextFieldID).focus();
			if (nextFieldID == '#cvvCode' && navigator.userAgent.toLowerCase().indexOf("chrome") >= 0 || navigator.userAgent.toLowerCase().indexOf("safari") >= 0) {
				window.setInterval(function() {
					$('input:-webkit-autofill').each(function() {
						var clone = $(this).clone(true, true);
						$(this).after(clone).remove();
					});
					//$(nextFieldID).focus();
				}, 20);
			}
		}
	},
	
	addValidationMark: function(el) {
		if ($(el).hasClass("txt-invalid")) {
			$(el).next(".glyphicon").removeClass("glyphicon-ok").addClass("glyphicon-remove");
		} else if ($(el).hasClass("txt-valid")) {
			$(el).next(".glyphicon").removeClass("glyphicon-remove").addClass("glyphicon-ok");
		} else {
			$(el).next("i").removeClass("glyphicon-ok glyphicon-remove");
		}
		if ($(el).val() == "") {
			$(el).next("i").removeClass("glyphicon-ok glyphicon-remove");
		}
	}
	
};

$(document).ready(function(){
	$.session._init();
	commonView.initialize();
	validationView.initialize();
});