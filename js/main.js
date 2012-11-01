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

	$('#inputLatitude').add('#inputLongitude').on('change', calculate);

	function calculate() {
		var lat = parseFloat($('#inputLatitude').val());
		var lng = parseFloat($('#inputLongitude').val());
		
		if (lat > 90) {
			lat = 90;
		}
		if (lat < 0 || isNaN(lat)) {
			lat = 0;
		}
		
		if (lng > 180) {
			lng = 180;
		}

		if (lng <0 || isNaN(lng)) {
			lng = 0;
		}
		
		$('#inputLatitude').val(lat);
		$('#inputLongitude').val(lng);
	}
});