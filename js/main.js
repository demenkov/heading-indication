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

	//change buttons state at the same time 
	$('.westEast .btn.east').on('click', function(e) {
		$('.westEast .btn.east').not($(this)).button('toggle');
	});
	$('.westEast .btn.west').on('click', function(e) {
		$('.westEast .btn.west').not($(this)).button('toggle');
	});

	$('.northSouth button').on('click', function(e) {
		var semisphere = $(this).hasClass('north') ? 'north' : 'south';
		
		if (!$('#starName option:selected').hasClass(semisphere)) {
			$('#starName').select2('val', ($($('#starName option.' + semisphere)[0]).val()));
		}
	});
	$("#starName").select2().on("change", function(e) {
		if (!$('#starName option:selected').hasClass('north') && !$('.northSouth button.south').hasClass('active')) {
			$('.northSouth button.south').button('toggle');
		}
		if (!$('#starName option:selected').hasClass('south') && !$('.northSouth button.north').hasClass('active')) {
			$('.northSouth button.north').button('toggle');
		}
	});

	$('#inputLatitude').add('#inputLongitude').on('change', calculate);

	function calculate() {
		fixInputs();
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