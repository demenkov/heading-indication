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

	$('.northSouth button').on('click', function(e) {
		var semisphere = $(this).hasClass('north') ? 'north' : 'south',
			constellation = $('#starName option:selected').closest('optgroup');
		var visibleInSemisphere = constellation.hasClass(semisphere),
			visibleInLatitude = (typeof constellation.attr(semisphere) !== 'undefined') ? 
				(constellation.attr(semisphere) >= $('#inputLatitude').val()) : 
				true;
		if (!visibleInSemisphere || !visibleInLatitude) {
			$('#starName').select2('val', ($($('#starName optgroup.' + semisphere + 'option')[0]).val()));
		}
	});
	$("#starName").select2({
		formatNoMatches : function(term) {
			return 'Нет совпадений ' + term;
		}
	}).on("change", function(e) {
		var semisphere = $('.northSouth button.south').hasClass('active') ? 'south' : 'north',
			constellation = $('#starName option:selected').closest('optgroup');
		var visibleInSemisphere = constellation.hasClass(semisphere),
			visibleInLatitude = (typeof constellation.attr(semisphere) !== 'undefined') ? 
				(constellation.attr(semisphere) >= $('#inputLatitude').val()) : 
				true;
		if (!visibleInSemisphere || !visibleInLatitude) {
			var latitude = typeof constellation.attr(semisphere) !== 'undefined' ? constellation.attr(semisphere) : 90;
			$('#inputLatitude').val(latitude);
		}
	});

	$('#inputLatitude').add('#inputLongitude').on('change', calculate);
	//change star if it's not visible in this latitude
	$('#inputLatitude').on('blur', function() {
		var semisphere = $('.northSouth button.south').hasClass('active') ? 'south' : 'north',
			inputLat = $(this).val();
		var options = $('#starName option').filter(function(i){
			var latitude = (typeof $(this).closest('optgroup').attr(semisphere) !== 'undefined') ? parseInt($(this).closest('optgroup').attr(semisphere)) : 90;
			return latitude >= inputLat;
		});
		if (!options.filter(':selected').length) {
			$('#starName').select2('val', $(options[0]).val());
		}
	});

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