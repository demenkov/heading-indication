//plot function
jQuery(document).ready(function($) {
	var circle = [],
		earth = [],
		celestialEquatorFront = [],
		celestialEquatorBack = [],
		celestialHorizonFront = [],
		celestialHorizonBack = [],
		verticalLights = [],
		PPd = [],
		yAxis = [],
		xAxis = [],
		PP = [],
		sphereRadius = 6,
		earthRadius = 2.5,
		earthX = 0,
		earthY = -2.5,
		points = [
			{
				x		: -sphereRadius*Math.cos(Math.PI/4),
				y		: -sphereRadius*Math.sin(Math.PI/4),
				letter	: 'P\'',
				label	: 'Южный полюс мира',
				left	: -15,
				top		: 10,
				color	: '#ea8df7',
			},
			{
				x		: sphereRadius*Math.cos(Math.PI/4),
				y		: sphereRadius*Math.sin(Math.PI/4),
				letter	: 'P',
				label	: 'Северный полюс мира',
				left	: 10,
				top		: -15,
				color	: '#ea8df7',
			},
			{
				x		: sphereRadius*Math.cos(Math.PI/4),
				y		: -sphereRadius*Math.sin(Math.PI/4),
				letter	: 'Q',
				left	: 10,
				top		: -5,
				color	: '#911e42',
			},
			{
				x		: -sphereRadius*Math.cos(Math.PI/4),
				y		: sphereRadius*Math.sin(Math.PI/4),
				letter	: 'Q\'',
				left	: -15,
				top		: -30,
				color	: '#911e42',
			},
			{
				x		: -6,
				y		: 0,
				letter	: 'S',
				label	: 'Точка юга',
				left	: -25,
				top		: -10,
				color	: '#EDC240',
			},
			{
				x		: 6,
				y		: 0,
				letter	: 'N',
				label	: 'Точка севера',
				left	: 10,
				top		: -10,
				color	: '#EDC240',
			},
			{
				x		: -2.4,
				y		: 1.1,
				letter	: 'C',
				label	: 'Местоположение светила',
				left	: 10,
				top		: -10,
				color	: '#CB4B4B',
			},
			{
				x		: 1.1,
				y		: 2.4,
				letter	: 'W',
				label	: 'Точка запада',
				left	: 5,
				top		: -25,
				color	: '#EDC240',
			},
			{
				x		: 0,
				y		: -6,
				letter	: 'n',
				label	: 'Надир',
				left	: -5,
				top		: 5,
				color	: '#000000',
			},
			{
				x		: 0,
				y		: 6,
				letter	: 'Z',
				label	: 'Зенит',
				left	: -5,
				top		: -30,
				color	: '#000000',
			},
			{
				x		: -1.1,
				y		: -2.45,
				letter	: 'E',
				label	: 'Точка востока',
				left	: -5,
				top		: -30,
				color	: '#EDC240',
			}
		];
	for (var phi = 0; phi <= 2 * Math.PI; phi+=0.01) {
		circle.push([sphereRadius*Math.cos(phi), sphereRadius*Math.sin(phi)]);
	}
	for (var phi = 0; phi <= 2 * Math.PI; phi+=0.01) {
		earth.push([earthX + earthRadius*Math.cos(phi), earthY + earthRadius*Math.sin(phi)]);
	}
	for (var phi = Math.PI; phi <= 3*Math.PI/2; phi+=0.01) {
		celestialEquatorFront.push([4.2 + 8.5 * Math.cos(phi), 4.2 + 8.5 * Math.sin(phi)]);
	}
	for (var phi = Math.PI/2; phi >= 0; phi-=0.01) {
		celestialEquatorBack.push([-4.2 + 8.5 * Math.cos(phi), -4.2 + 8.5 * Math.sin(phi)]);
	}
	for (var phi = 5*Math.PI/4; phi <= 7*Math.PI/4; phi+=0.01) {
		celestialHorizonFront.push([8.5 * Math.cos(phi), 6 + 8.5 * Math.sin(phi)]);
	}
	for (var phi = Math.PI/4; phi <= 3*Math.PI/4; phi+=0.01) {
		celestialHorizonBack.push([8.5 * Math.cos(phi), -6 + 8.5 * Math.sin(phi)]);
	}
	for (var phi = 3*Math.PI/4; phi <= 5*Math.PI/4; phi+=0.01) {
		verticalLights.push([6 + 8.5 * Math.cos(phi), 8.5 * Math.sin(phi)]);
	}
	for (var phi = Math.PI/2; phi <= Math.PI; phi+=0.01) {
		PPd.push([4.2 + 8.5 * Math.cos(phi), -4.2 + 8.5 * Math.sin(phi)]);
	}
	for (var x = -sphereRadius; x <= sphereRadius; x+=0.01) {
		yAxis.push([0,x]);
	}
	for (var y = -sphereRadius; y <= sphereRadius; y+=0.01) {
		xAxis.push([y,0]);
	}
	for (var c = -sphereRadius; c <= sphereRadius; c+=0.01) {
		PP.push([c*Math.cos(Math.PI/4),c*Math.sin(Math.PI/4)]);
	}
	var graphics = [
			{
				data: xAxis,
				lines: {
					show: true,
					fill: false
				},
				color: '#42aaff',
				label : 'Полуденная линия'
			},
			{
				data: celestialHorizonBack,
				lines: {
					show: true,
					fill: false
				},
				color: '#EDC240',
				label : 'Истинный горизонт'
			},
			{
				data: yAxis,
				lines: {
					show: true,
				},
				points: {
					show: false
				},
				color: '#000000',
			},
			{
				data: earth,
				lines: {
					show: true,
					fill: true
				},
				color: '#5da130',
				label: 'Земля'
			},
			{
				data: PP,
				lines: {
					show: true,
					fill: false
				},
				color: '#ea8df7',
				label: 'Ось мира'
			},
			{
				data: [
					[sphereRadius*Math.cos(Math.PI/4), -sphereRadius*Math.sin(Math.PI/4)],
					[-sphereRadius*Math.cos(Math.PI/4), sphereRadius*Math.sin(Math.PI/4)]
				],
				lines: {
					show: true,
					fill: false
				},
				color: '#911e42'
			},
			{
				data: circle,
				lines: {
					show: true,
					fill: false
				},
				color: 'black',
				label: 'Вспомогательная небесная сфера'
			},
			{
				data: celestialEquatorBack,
				lines: {
					show: true,
					fill: false
				},
				color: '#AFD8F8',
				label : 'Небесный экватор'
			},
			{
				data: celestialEquatorFront,
				lines: {
					show: true,
					fill: false,
				},
				color: '#AFD8F8',
				label : 'Небесный экватор'
			},
			{
				data: celestialHorizonFront,
				lines: {
					show: true,
					fill: false
				},
				color: '#EDC240',
				label : 'Истинный горизонт'
			},
			{
				data: PPd,
				lines: {
					show: true,
					fill: false
				},
				color: '#d5d5d5',
				label : 'Меридиан'

			},
			{
				data: verticalLights,
				lines: {
					show: true,
					fill: false
				},
				color: '#CB4B4B',
				label: 'Вертикал светила'
			},
		];
	for (var i in points) {
		graphics.push({
			data: [[points[i].x,points[i].y]],
			points: {
				show: true,
				radius: 7,
				symbol: 'circle',
			},
			label: points[i].label ? points[i].label : null,
			color: points[i].color,
		});
	}
	var plot = $.plot(
		$("#sphere"),
		graphics,
		{
			yaxis: {
				min: -6.5,
				max: 6.5,
				show: false
			},
			xaxis: {
				min: -6.5,
				max: 6.5,
				show: false
			},
			grid: {
				show: false,
				hoverable: true
			},
			legend: {
				show: false
			}
		}
	);
	for (var i in points) {
		var point = plot.pointOffset({ x: points[i].x, y: points[i].y});
		$("#sphere").append('<div class = "point" style="position:absolute;left:' + (point.left + points[i].left) + 'px;top:' + (point.top + points[i].top) + 'px;">' + points[i].letter + '</div>');
	}

	function showTooltip(x, y, contents) {
		$('<div id="tooltip">' + contents + '</div>').css( {
			position: 'absolute',
			display: 'none',
			top: y + 5,
			left: x + 5,
			border: '1px solid #fdd',
			padding: '2px',
			'background-color': '#fee',
			opacity: 0.80
		}).appendTo("body").fadeIn(200);
	}

	var previousPoint = null;
	$("#sphere").bind("plothover", function (event, pos, item) {
		if (item) {
			if (previousPoint != item.dataIndex) {
				previousPoint = item.dataIndex;

				$("#tooltip").remove();
				var x = item.datapoint[0].toFixed(2),
					y = item.datapoint[1].toFixed(2);

				if (item.series.label) {
					showTooltip(item.pageX, item.pageY,
								item.series.label);
				}
			}
		}
		else {
			$("#tooltip").remove();
			previousPoint = null;
		}
	});
});