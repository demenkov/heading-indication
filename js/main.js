//main function
jQuery(document).ready(function($) {
	"use strict";
	//add date interactivity
	$.fn.datepicker.DPGlobal.dates.daysMin = ["Сб", "По", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
	$.fn.datepicker.DPGlobal.dates.months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
	$('#inputDate').datepicker({
		format : 'dd.mm.yyyy',
		weekStart : 1
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
		$('#inputDate').trigger('focus');
		e.stopPropagation();
		$('body').on('click', function() {
			$('#inputDate').trigger('blur');
		});
	});
	//add time interactivity
	$('#inputTime').timepicker({
		defaultTime : 'current',
		showMeridian : false,
		showSeconds	: true
	});
});