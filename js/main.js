//main function
jQuery(document).ready(function($) {
	"use strict";
	//add date interactivity
	$('#inputDate').datepicker({
		format : 'dd.mm.yyyy',
		weekStart : 1,
		language : 'ru'
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
		defaultTime : 'current',
		showMeridian : false,
		showSeconds	: true
	});

	function calculate() {
		fixInputs();
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

	$('#starNum').on('keyup', function() {
		if (!$('#starName option[value="' + $(this).val() + '"]').length) {
			$(this).closest('div.control-group').addClass('error');
		}
		else {
			$(this).closest('div.control-group').removeClass('error');
			$('#starName').select2('val', $(this).val());
		}
	});

	$('#inputLatitude').add('#inputLongitude').on('change', calculate);
	//change star if it's not visible in this latitude
	$('#inputLatitude').on('blur', fixStars);

	function fixStars(e) {
		var stars = getAvailableStars(e.target);
		if (!$(stars).filter(':selected').length) {
			$('#starName').select2('val', $(stars[0]).val());
		}
		$('#starNum').val($('#starName').val());
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

	function fixInputs() {
		var lat = $('#inputLatitude').val() ? parseFloat($('#inputLatitude').val()) : null;
		var lng = $('#inputLongitude').val() ? parseFloat($('#inputLongitude').val()) : null;
		
		if (lat > 90) {
			lat = 90;
		}
		if (lat < 0 || isNaN(lat)) {
			lat = 0;
		}
		
		if (lng > 180) {
			lng = 180;
		}

		if (lng < 0 || isNaN(lng)) {
			lng = 0;
		}
		
		$('#inputLatitude').val(lat);
		$('#inputLongitude').val(lng);
	}
});