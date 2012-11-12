//main function
jQuery(document).ready(function($) {
	"use strict";
	//extend standart math functions wuth new one - convert degrees into radians
	Math.rad = function(number) {
		return number * Math.PI / 180;
	}

	//add date interactivity
	$('#inputDate').datepicker({
		format		: 'dd.mm.yyyy',
		weekStart	: 1,
		language	: 'ru'
	})
	.on('changeDate', function() {
		$('#inputDate').datepicker('hide');
	})
	.on('blur', function() {
		$('#inputDate').datepicker('hide');
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
	$('#inputLatitude').on('blur', function() {
		var val = $(this).val() ? parseFloat($(this).val()) : null;
		if (val > 90) {
			val = 90;
		}
		if (val < 0 || isNaN(val)) {
			val = 0;
		}
		$(this).val(val);
	});

	$('#inputLongitude').on('blur', function() {
		var val = $(this).val() ? parseFloat($(this).val()) : null;
		if (val > 180) {
			val = 180;
		}
		if (val < 0 || isNaN(val)) {
			val = 0;
		}
		$(this).val(val);
	});

	$('#timeZone').on('blur', function() {
		var val = $(this).val() ? parseFloat($(this).val()) : null;
		if (val > 12) {
			val = 12;
		}
		if (val < 0 || isNaN(val)) {
			val = 0;
		}
		$(this).val(val);
	});

	$('#timeZone').on('keyup', calculate);

	function calculate() {
		var d = $('#inputDate').val().split('.'),
			t = $('#inputTime').val().split(':'),
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
			UT = time.hours + time.minutes/60 + time.seconds/3600,
			JD = 1720996.5 - 
			Math.round(date.yearStroke/100) + 
			Math.round(date.yearStroke/400) + 
			Math.round(365.25 * date.yearStroke) + 
			Math.round(30.6 * (date.monthStroke + 1)) + 
			date.day + 
			UT/24,
			tau = date.day/36525,
			//M01 = 357.528 + 35999.05 * tau + 0.04107 * UT,//средняя аномалия солнца
			M0 = 357.52910 + 35999.05030 * tau - 0.0001559 * 2 * tau - 0.00000048 * 3 * tau, //средняя аномалия солнца
			L0 = 280.46 + 36000.772 * tau + 0.04107 * UT; //средняя долгота солнца

		M0 = (M0 > 360) ? 360 : M0;
		var L = L0 + (1.915 - 0.0048 * tau) * Math.sin(Math.rad(M0)) + 0.02 * Math.sin(Math.rad(2 * M0));//долгота Солнца
		L = (L > 360) ? L-360 : L;
	}

	//change buttons state at the same time 
	$('.westEast .btn.east').on('click', function(e) {
		$('.westEast .btn.east').not($(this)).button('toggle');
	});
	$('.westEast .btn.west').on('click', function(e) {
		$('.westEast .btn.west').not($(this)).button('toggle');
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

	//$('#inputLatitude').add('#inputLongitude').on('change', calculate);
});