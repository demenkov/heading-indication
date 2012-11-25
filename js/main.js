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

	Math.sec = function(number) {
		return 1/Math.cos(number);
	}

	Math.cosec = function(number) {
		return 1/Math.sin(number);
	}

	Math.cot = function(number) {
		return 1/Math.tan(number);
	}

	Date.prototype.getDOY = function() {
		var onejan = new Date(this.getFullYear(),0,1);
		return Math.ceil((this - onejan) / 86400000);
	}

	//enable content tabs
	$('#mainMenu a').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
	});
	$('#mainMenu a:first').tab('show');
	//$('#description').show();

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
		defaultTime		: '21:57:08',
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

	$('#starName').on('change', calculate)

	$('input[name="starSelect"]').add('input[name="sunSelect"]').on('click', calculate);

	$('#inputTime').on('change', calculate);



	function ut(h,m,z) {
		return (h-z+m/60);
	}

	function jd(y,m,d,u) {
		return (367*y)-Math.floor((7/4)*(Math.floor((m+9)/12)+y))+Math.floor(275*m/9)+d-730531.5+(u/24)
	}

	//http://wildphoto.irk.ru/travel/sun.html
	//http://planetcalc.ru/320/?language_select=ru

	Math.sun = function(lg,la,ye,mo,da,ho,mi,zo) {
		var uu=ut(ho,mi,zo);
		var jj=jd(ye,mo,da,uu);
		var T=jj/36525;
		var k=Math.PI/180.0;
		var M=357.5291+35999.0503*T-0.0001559*T*T-0.00000045*T*T*T
		M=M % 360
		M = k*M;
		var Lo=280.46645+36000.76983*T+0.0003032*T*T
		Lo=Lo % 360
		var DL=(1.9146-0.004817*T-0.000014*T*T)*Math.sin(M)+(0.019993-0.000101*T)*Math.sin(2*M)+0.00029*Math.sin(3*M) //C
		var L=Lo+DL
		var omega = 125.04 - 1934.136*T;
		var lambda = L - 0.00569 - 0.00478*Math.sin(k*omega);
		var eps=23.43999-0.013*T;
		var delta=(1/k)*Math.asin(Math.sin(L*k)*Math.sin(eps*k))
		var RA=(1/k)*Math.atan2(Math.cos(eps*k)*Math.sin(L*k),Math.cos(L*k))

		RA=(RA+360) % 360

		var declin = Math.sin(k*eps)*Math.sin(k*lambda);

		var GMST=280.46061837+360.98564736629*jj+0.000387933*T*T-T*T*T/38710000
		GMST=(GMST+360) % 360
		var LMST=GMST+lg
		var H=LMST-RA
		var eqt=(Lo-RA)*4
		var azm=(1/k)*Math.atan2(-Math.sin(H*k),Math.cos(la*k)*Math.tan(delta*k)-Math.sin(la*k)*Math.cos(H*k));
		azm=(azm+360) % 360;

		var ha = (ho*60 + mi + (eqt - 4*lg - 60*zo))/4-180 ;

		return {
			ha		: ha,
			ra		: RA,
			azimuth	: azm,
			dec		: Math.deg(declin)
		};
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
			westZone = $('#westEastZone').val() == 'west' ? true : false,
			north = $('#northSouth').val() == 'north' ?  true : false,
			zone = parseInt($('#timeZone').val());
		zone *= westZone ? -1: 1;

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

		var fullLongitude	= longitude + longitudeSec / 60;
		fullLongitude *= (west) ? -1 : 1;
		var fullLatitude	= latitude + latitudeSec / 60;
		fullLatitude *= (north) ? 1 : -1;

		var sun = Math.sun(fullLongitude,fullLatitude,date.year,date.month,date.day,time.hours,time.minutes,zone);
		var deltaKSun = cp - sun.azimuth;

		if (sun.ha) {
			$('#inputSunLha').val(sun.ha.toFixed(2))
		}

		if (sun.dec) {
			$('#inputSunGradient').val(sun.dec.toFixed(2));
			var letter = (sun.dec > 0) ? 'N' : 'S';
			$('#inputSunGradient').siblings('.add-on').html(letter);
		}

		if (sun.ra) {
			$('#inputSunRa').val(sun.ra.toFixed(2));
		}

		if (sun.azimuth) {
			$('#inputSunAzimuth').val(sun.azimuth.toFixed(2));
		}

		if (deltaKSun && star) {
			$('#inputCompass').val(deltaKSun.toFixed(2));
		}

		/*if (alphaSpider) {
			$('#inputStarRa').val(alphaSpider.toFixed(2));
		}
		if (betaSpider) {
			$('#inputStarGradient').val(betaSpider.toFixed(2));
			var letter = (betaSpider > 0) ? 'N' : 'S';
			$('#inputStarGradient').siblings('.add-on').html(letter);
		}
		if (tmSpider) {
			$('#inputStarLha').val(tmSpider.toFixed(2))
		}
		if (azimuth) {
			$('#inputStarAzimuth').val(azimuth.toFixed(2));
		}

		if (deltaKStar && !star) {
			$('#inputCompass').val(deltaKStar.toFixed(2));
		}*/


	}

	//change buttons state at the same time
	$('.westEast .btn.east').on('click', function(e) {
		$('#westEast').val('east');
		calculate();
	});
	$('.westEast .btn.west').on('click', function(e) {
		$('#westEast').val('west');
		calculate();
	});
	$('.westEastZone .btn.west').on('click', function(e) {
		$('#westEastZone').val('west');
		calculate();
	});
	$('.westEastZone .btn.east').on('click', function(e) {
		$('#westEastZone').val('east');
		calculate();
	});
	$('.northSouth .btn.north').on('click', function(e) {
		$('#northSouth').val('north');
		calculate();
	});
	$('.northSouth .btn.south').on('click', function(e) {
		$('#northSouth').val('south');
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
		calculate();
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