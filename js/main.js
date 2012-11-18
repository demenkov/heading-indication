//main function
jQuery(document).ready(function($) {
	"use strict";
	//extend standart math functions wuth new one - convert degrees into radians
	Math.rad = function(number) {
		return number * Math.PI / 180;
	}

	Math.deg = function(number) {
		return number * 180 / Math.PI;
	}

	Math.cosec = function(number) {
		return 1/Math.sin(number);
	}

	Math.cot = function(number) {
		return 1/Math.tan(number);
	}

	//enable content tabs
	$('#mainMenu a').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
	});
	//$('#mainMenu a:first').tab('show');
	$('#description').show();

	//add date interactivity
	$('#inputDate').datepicker({
		format		: 'dd.mm.yyyy',
		weekStart	: 1,
		language	: 'ru'
	})
	.on('changeDate', function() {
		$('#inputDate').datepicker('hide');
		calculate();
	})
	.on('blur', function() {
		$('#inputDate').datepicker('hide');
		calculate();
	})
	.on('focus', function(e) {
		e.stopPropagation();
	})
	.siblings('span.add-on')
	.on('click', function(e) {
		$('#inputDate').focus();
	});
	//add time interactivity
	$('#inputTime').timepicker({
		defaultTime		: '22:53:51',
		showMeridian	: false,
		showSeconds		: true
	});

	//add some validators
	$('#inputLatitude').on('blur keyup', function() {
		var val = $(this).val() ? parseFloat($(this).val()) : null;
		if (val > 90) {
			val = 90;
		}
		if (val < 0 || isNaN(val)) {
			val = 0;
		}

		if (val == 90) {
			$('#inputLatitudeSec').val(0)
		}
		$(this).val(val);
		calculate();
	});

	$('#inputLongitude').on('blur keyup', function() {
		var val = $(this).val() ? parseFloat($(this).val()) : null;
		if (val > 180) {
			val = 180;
		}
		if (val < 0 || isNaN(val)) {
			val = 0;
		}

		if (val == 180) {
			$('#inputLongitudeSec').val(0)
		}

		$(this).val(val);
		calculate();
	});

	$('#inputLongitudeSec').add('#inputLatitudeSec').on('blur keyup', function(e) {
		var val = $(this).val() ? parseFloat($(this).val()) : null;

		if (val > 60) {
			val = 60;
		}
		if (val < 0 || isNaN(val)) {
			val = 0;
		}

		if ($(this).attr('id') == 'inputLongitudeSec' && $('#inputLongitude').val() == '180') {
			val = 0;
		}

		if ($(this).attr('id') == 'inputLatitudeSec' && $('#inputLatitude').val() == '90') {
			val = 0;
		}

		$(this).val(val);
		calculate();
	});

	$('#timeZone').on('blur keyup', function() {
		var val = $(this).val() ? parseFloat($(this).val()) : null;
		if (val > 12) {
			val = 12;
		}
		if (val < 0 || isNaN(val)) {
			val = 0;
		}
		$(this).val(val);
		calculate();
	});

	$('#cp').on('blur keyup', function() {
		var val = $(this).val() ? parseFloat($(this).val()) : null;
		if (val < 0 || isNaN(val)) {
			val *= -1;
		}
		$(this).val(val);
		calculate();
	});

	$('#timeZone')
	.add('#inputTime')
	.on('keyup', calculate);

	$('input[name="starSelect"]').add('input[name="sunSelect"]').on('click', calculate);

	$('#inputTime').on('change', calculate);



	function ut(h,m,z)
	{
		return (h-z+m/60);
	}

	function jd(y,m,d,u)
	{
		return (367*y)-Math.floor((7/4)*(Math.floor((m+9)/12)+y))+Math.floor(275*m/9)+d-730531.5+(u/24)
	}

	//http://wildphoto.irk.ru/travel/sun.html
	//http://planetcalc.ru/320/?language_select=ru

	Math.azimuth = function(lg,la,ye,mo,da,ho,mi,zo) {
		var uu=ut(ho,mi,zo);
		var jj=jd(ye,mo,da,uu);
		var T=jj/36525;
		var k=Math.PI/180.0;
		var M=357.5291+35999.0503*T-0.0001559*T*T-0.00000045*T*T*T
		M=M % 360
		var Lo=280.46645+36000.76983*T+0.0003032*T*T
		Lo=Lo % 360
		var DL=(1.9146-0.004817*T-0.000014*T*T)*Math.sin(k*M)+(0.019993-0.000101*T)*Math.sin(k*2*M)+0.00029*Math.sin(k*3*M)
		var L=Lo+DL
		var eps=23.43999-0.013*T
		var delta=(1/k)*Math.asin(Math.sin(L*k)*Math.sin(eps*k))
		var RA=(1/k)*Math.atan2(Math.cos(eps*k)*Math.sin(L*k),Math.cos(L*k))
		RA=(RA+360) % 360

		var GMST=280.46061837+360.98564736629*jj+0.000387933*T*T-T*T*T/38710000
		GMST=(GMST+360) % 360
		var LMST=GMST+lg
		var H=LMST-RA
		var eqt=(Lo-RA)*4
		var azm=(1/k)*Math.atan2(-Math.sin(H*k),Math.cos(la*k)*Math.tan(delta*k)-Math.sin(la*k)*Math.cos(H*k));
		azm=(azm+360) % 360;

		return azm;
	}

	function calculate() {

		$('#inputSunAzimuth')
		.add('#inputSunRa')
		.add('#inputSunGradient')
		.add('#inputSunLha')
		.add('#inputStarLha')
		.add('#inputStarRa')
		.add('#inputStarGradient')
		.add('#inputStarAzimuth')
		.add('#inputCompass')
		.val('');
		//soon
		var d = $('#inputDate').val().split('.'),
			t = $('#inputTime').val().split(':'),
			latitude = parseInt($('#inputLatitude').val()),
			latitudeSec = parseFloat($('#inputLatitudeSec').val()),
			longitude = parseInt($('#inputLongitude').val()),
			longitudeSec = parseFloat($('#inputLongitudeSec').val()),
			cp = parseFloat($('#cp').val()),
			star = $('input[name="starSelect"]').attr('checked') ? true : false,
			west = $('#westEast').val() == 'west' ? true : false,
			north = $('.btn.north').hasClass('active') ?  'north' : 'south',
			zone = parseInt($('#timeZone').val());

		var date = {
			day			: parseInt(d[0]),
			month		: parseInt(d[1]),
			year		: parseInt(d[2])
		};
		var time = {
			hours	: parseInt(t[0]),
			minutes	: parseInt(t[1]),
			seconds	: parseInt(t[2]),
			zone	: zone
		};

		//http://en.wikipedia.org/wiki/Julian_date
		var a = (14 - date.month) / 12;
		var y = date.year + 4800 - a;
		var m = date.month + 12 * a - 3;
		var JDN = date.day + ((153 * m) + 2) / 5 + 365 * y + y/4 - y/100 + y/400 - 32045;
		var JD = JDN + (time.hours - 12) / 24 + (time.minutes) / 1440 + (time.seconds) / 3600;

		//http://en.wikipedia.org/wiki/Position_of_the_Sun
		var n = JD - 2451545.0;
		var L = 280.460 + 0.9856474 * n;
		L = (L > 360) ? L - 360 : ((L < 0) ? L + 360 : L);
		var g = 357.528 + 0.9856003 * n;
		g = (g > 360) ? g - 360 : ((g < 0) ? g + 360 : g);
		var lambda = L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2*g);
		var R = 1.00014 - 0.01671 * Math.cos(g) - 0.00014 * Math.cos(2*g);
		var eps = 23.439 - 0.0000004;
		var alpha = Math.atan(Math.cos(eps)*Math.tan(lambda));
		var beta = Math.asin(Math.sin(eps)*Math.sin(lambda));

		if (alpha) {
			$('#inputSunGradient').val(Math.deg(alpha).toFixed(2));
		}

		if (beta) {
			$('#inputSunRa').val(Math.deg(beta).toFixed(2));
		}

		var fullLongitude	= longitude + longitudeSec / 60;
		fullLongitude *= (west) ? -1 : 1;
		var fullLatitude	= latitude + latitudeSec / 60;

		var azimuth = Math.azimuth(fullLongitude,fullLatitude,date.year,date.month,date.day,time.hours,time.minutes,zone);

		if (azimuth) {
			$('#inputSunAzimuth').val(azimuth.toFixed(2));
		}

		var deltaKSun = azimuth - cp;

		if (deltaKSun && star) {
			$('#inputCompass').val(deltaKSun.toFixed(2) * -1);
		}

		//http://en.wikipedia.org/wiki/Sunrise_equation
		var nSpider = JD - 2451545.0009 + fullLongitude/360;
		var n = nSpider + 0.5;
		var jSpider  = 2451545.0009 + fullLongitude/360 + n;
		var M = 357.5291 + 0.98560028 * (jSpider - 2451545) % 360;
		var C = 1.9148 * Math.sin(M) + 0.0200 * Math.sin(2*M) + 0.0003 * Math.sin(3*M);
		var lambda = (M +102.9372+C+180) % 360;
		var jTransit = jSpider + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2*lambda);
		var beta = Math.asin(Math.sin(lambda) * Math.sin(23.45));
		var lat = longitude + longitudeSec / 60;
		var W = Math.acos((Math.sin(-0.83) - Math.sin(lat) * Math.sin(beta)) / (Math.sin(lat) * Math.cos(beta)));
		if (W) {
			$('#inputSunLha').val(Math.deg(W).toFixed(2));
		}

		/*var date = {
			day			: parseInt(d[0]),
			month		: parseInt(d[1]),
			year		: parseInt(d[2]),
			monthStroke	: (parseInt(d[1]) <= 2) ? parseInt(d[1]) + 12 : parseInt(d[1]),
			yearStroke	: (parseInt(d[1]) <= 2) ? parseInt(d[2]) - 1 : parseInt(d[2]),
		};
		var time = {
			hours	: west ? parseInt(t[0]) - zone : parseInt(t[0]) + zone,
			minutes	: parseInt(t[1]),
			seconds	: parseInt(t[2])
		};
		var UT = time.hours + time.minutes/60 + time.seconds/3600;//(12.3)
		var JD = 1720996.5 -
			Math.round(date.yearStroke/100) +
			Math.round(date.yearStroke/400) +
			Math.round(365.25 * date.yearStroke) +
			Math.round(30.6 * (date.monthStroke + 1)) +
			date.day +
			UT/24;//(2.20)
		var d = JD - 2400000.5;
		var tau			= JD/36525; //(12.2)
		var M0Sun		= 359.9286;
		var K0			= 1.9154;
		var E0			= 23.4412;
		var Omega0Moon	= 55.199;
		var L0			= 279.6034;
		var S0			= 99.6056;

		var RSun			= 0.26696 + 0.00447 * Math.cos(M0Sun); //(12.19)
		var deltaMStroke	= 0.985647 * (UT / 24); //(12.18)
		var deltaM			= 35999.05 * tau; //(12.17)
		var OmegaMoon		= Omega0Moon - 1934.14 * tau; // (12.8)

		var MSun 	= M0Sun + deltaM + deltaMStroke; //(12.16)
		var K		= K0 - 0.004881 * tau; //(12.15)

		var nu				= K * Math.sin(MSun) + 0.02 * Math.sin(2 * MSun); //(12.14)
		var deltaPsi		= -0.00479 * Math.sin(OmegaMoon); //(12.9)
		var deltaL			= 36000 * tau + 0.768925 * tau; //(12.2)
		var deltaLstroke	= 0.985647 * UT / 24; //(12.13)

		var L				= L0 + deltaL + deltaLstroke; //(12.11)
		var lambdaSun		= L + nu + deltaPsi; //(12.9)
		var deltaE			= 0.002666 * Math.cos(OmegaMoon); //(12.7)
		var E				= E0 - 0.013012 * tau + deltaE; //(12.6)
		var betaSun			= Math.asin(Math.sin(lambdaSun) * Math.sin(E)); // (12.5)
		var alphaStrokeSun	= Math.acos(Math.cos(lambdaSun) / Math.cos(betaSun)); //(12.4)
		var alphaSun		= (betaSun > 0) ? alphaStrokeSun : 360 - alphaStrokeSun;


		var fullLongitude	= longitude + longitudeSec / 60;
		var fullLatitude	= latitude + latitudeSec / 60;

		var timegr = S0 + deltaL + deltaPsi * Math.cos(E); // (12.28)
		timegr = (timegr > 360) ? ((timegr/360) - Math.round(timegr/360)) * 360 - 180 : timegr; //(12.29)
		timegr = (timegr < 0) ? timegr + 360 : timegr; // (12.30)
		var timegrSpider = timegr + 360.98565 * (UT/24) - alphaSun; //(12.31)
		var sunLha = (west) ? timegrSpider - fullLongitude  : timegrSpider + fullLongitude; // (12.32)

		var azimuth = (Math.atan(Math.cos(Math.rad(fullLatitude)) * Math.tan(Math.rad(betaSun)) * Math.cosec(Math.rad(sunLha)) - Math.sin(Math.rad(fullLatitude)) * Math.cot(Math.rad(sunLha))))/60;

		azimuth = azimuth*57.3;
		var deltaKSun = azimuth - cp;*/



		/*if (sunLha) {
			$('#inputSunLha').val(sunLha.toFixed(2));
		}

		if (betaSun) {
			$('#inputSunGradient').val(betaSun.toFixed(2));
		}

		if (alphaSun) {
			$('#inputSunRa').val(alphaSun.toFixed(2));
		}

		if (azimuth) {
			$('#inputSunAzimuth').val(azimuth.toFixed(2));
		}

		if (deltaKSun && star) {
			$('#inputCompass').val(deltaKSun.toFixed(2));
		}*/
	}

	//change buttons state at the same time
	$('.westEast .btn.east').on('click', function(e) {
		$('#westEast').val('east');
		$('.westEast .btn.east').not($(this)).button('toggle');
		calculate();
	});
	$('.westEast .btn.west').on('click', function(e) {
		$('#westEast').val('west');
		$('.westEast .btn.west').not($(this)).button('toggle');
		calculate();
	});

	$('.northSouth button').on('click', fixStars);

	$("#starName").select2({
		formatNoMatches : function(term) {
			return 'Нет совпадений ' + term;
		}
	}).on("change", fixStars);

	//change star if it's not visible in this latitude
	$('#inputLatitude').on('blur', fixStars);

	function fixStars(e) {
		var stars = getAvailableStars(e.target);
		if (!$(stars).filter(':selected').length) {
			$('#starName').select2('val', $(stars[0]).val());
		}
	}

	function getAvailableStars(el) {
		var semisphere = ($(el).attr('type') == 'button') ?
				($(el).hasClass('north') ? 'north' : 'south'):
				($('.northSouth button.south').hasClass('active') ? 'south' : 'north'),
			latitude = $('#inputLatitude').val();
		var options = $('#starName option').filter(function(i) {
			var grouplat = 90;
			if (typeof $(this).parent('optgroup').attr(semisphere) !== 'undefined') {
				grouplat = parseInt($(this).parent('optgroup').attr(semisphere));
			}
			return grouplat >= latitude;
		});
		return options;
	}

	calculate();
});