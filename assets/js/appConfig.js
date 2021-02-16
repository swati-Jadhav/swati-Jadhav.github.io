var protocol = location.protocol;

var serviceHost = window.location.host;
var appLiveCall = false;
var apiBaseUrl = location.protocol + '//' + serviceHost + '/api/';
var appBaseUrl = location.protocol + '//'+serviceHost + '/';

var appConfig = {
    apiUrl : apiBaseUrl + '',
	startingPage:'index.html',
    currentYear : new Date().getFullYear(),
    unsupportedBrowsers : {
		'Chrome': '34',
		'MSIE': '8',
		'Firefox': '34',
		'Opera': '29',
		'Safari': '4'
	},
	msg:{
		error:'Oops! Something went wrong.',
		systemError:'The system has experienced a failure. Please try after sometime.',
		loadingMsg: 'Please wait... [%txt%].',
		loadTimeData: '[%txt%] taking longer than usual. Please wait... it may take 1 to 5 minutes.',
		success:'Your request is processed successfully.',
		fail:'Your request could not be processed. Reason - [%txt%].',
		unsupported:'Our website has detected that you are using an outdated browser that will prevent you from accessing certain features. Kindly use updated broswer. For eg, IE 9+ | Chrome 35+ | Mozilla 35+ | Opera 30+ | Safari 5+',
		sessionExpired:'Your session has expired.'
	},
	hideMsgTimer:2000
};