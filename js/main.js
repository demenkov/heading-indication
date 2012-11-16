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
	$('#mainMenu a:first').tab('show');

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
		defaultTime		: 'current',
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
		$(this).val(val);
		calculate();
	});

	$('#inputLongitudeSec').add('#inputLatitudeSec').on('blur keyup', function() {
		var val = $(this).val() ? parseFloat($(this).val()) : null;
		if (val > 60) {
			val = 60;
		}
		if (val < 0 || isNaN(val)) {
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

	$('#timeZone')
	.add('#inputTime')
	.add('#cp')
	.on('keyup', calculate);

	$('input[name="starSelect"]').add('input[name="sunSelect"]').on('click', calculate);

	$('#inputTime').on('change', calculate);

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
			date = {
				day			: parseInt(d[0]),
				month		: parseInt(d[1]),
				year		: parseInt(d[2]),
				monthStroke	: (parseInt(d[1]) > 2) ? parseInt(d[1]) + 12 : parseInt(d[1]),
				yearStroke	: parseInt(d[2]) - 1
			}, 
			time = {
				hours	: parseInt(t[0]),
				minutes	: parseInt(t[1]),
				seconds	: parseInt(t[2])
			},
			UT = time.hours + time.minutes/60 + time.seconds/3600,//(12.3)
			JD = 1720996.5 - 
			Math.round(date.yearStroke/100) + 
			Math.round(date.yearStroke/400) + 
			Math.round(365.25 * date.yearStroke) + 
			Math.round(30.6 * (date.monthStroke + 1)) + 
			date.day + 
			UT/24,//(2.20)
			tau			= date.day/36525, //(12.2)
			M0Sun		= 359.9286,
			K0			= 1.9154,
			E0			= 23.4412,
			Omega0Moon	= 55.199,
			L0			= 279.6034,
			S0			= 99.6056;

		var RSun			= 0.26696 + 0.00447 * Math.cos(M0Sun), //(12.9)
			deltaMStroke	= 0.985647 * UT / 24, //(12.18)
			deltaM			= 35999.05 * tau, //(12.17)
			OmegaMoon		= Omega0Moon - 1934.14 * tau; // (12.8)

		var MSun 	= M0Sun + deltaM + deltaMStroke, //(12.16)
			K		= K0 - 0.004881 * tau; //(12.15)

		var nu				= K * Math.sin(MSun) + 0.02 * Math.sin(2 * MSun), //(12.14)
			deltaPsi		= -0.00479 * Math.sin(OmegaMoon), //(12.9)
			deltaL			= 36000 * tau + 0.768925 * tau, //(12.2)
			deltaLstroke	= 0.985647 * UT / 24; //(12.13)

		var L = L0 + deltaL + deltaLstroke; //(12.11)
		var lambdaSun = L + nu + deltaPsi; //(12.9)
		var deltaE = 0.002666 * Math.cos(OmegaMoon); //(12.7)
		var E = E0 - 0.013012 * tau + deltaE; //(12.6)
		var betaSun = Math.asin(Math.sin(lambdaSun) * Math.sin(E)); // (12.5)
		var alphaStrokeSun = Math.acos(Math.cos(lambdaSun) / Math.cos(betaSun)); //(12.4)
		var alphaSun = (betaSun > 0) ? alphaStrokeSun : 360 - alphaStrokeSun;

		var fullLongitude = longitude + longitudeSec / 60;
		
		var fullLatitude = latitude + latitudeSec / 60;
		
		var sunLha = (west) ? fullLongitude + UT : fullLongitude - UT;

		var azimuth = (Math.atan(Math.cos(Math.rad(fullLatitude)) * Math.tan(betaSun) * Math.cosec(Math.rad(sunLha)) - Math.sin(Math.rad(fullLatitude)) * Math.cot(Math.rad(sunLha))))/60;

		var deltaKSun = azimuth - cp;

		if (sunLha) {
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
		}
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