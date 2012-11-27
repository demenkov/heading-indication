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



	function ut(h,m,s,z) {
		return (h-z+m/60+s/3600);
	}

	function jd(y,m,d,u) {
		return (367*y)-Math.floor((7/4)*(Math.floor((m+9)/12)+y))+Math.floor(275*m/9)+d-730531.5+(u/24)
	}

	function J_day_(Day,Month,Year) {
		var i,d;
		d = 0;

		for (i=1995; i<=Year-1; i++)
		{
		if  ( ( i/4-Math.floor(i/4) ) == 0 )
		{d = parseFloat(d) + 366}
		else
		{d = parseFloat(d) + 365};
		};

		for (i=1; i<=Month-1; i++)
		{
		if ((i==1) || (i==3) || (i==5) || (i==7) || (i==8) || (i==10) || (i==12))
		{d = Math.floor(d) + 31};
		if ( (i==4) || (i==6) || (i==9) || (i==11) )
		{d = Math.floor(d) + 30};
		if ( (i==2) )
		{if  ((i/4-Math.floor(i/4)) == 0 )
		{d = Math.floor(d) + 29}
		else
		{d = Math.floor(d) + 28};
		};
		};
		//var J_day = parseFloat(d) + parseFloat(Day) + parseFloat(2449717.5);
		var J_day = Math.floor(d) + Day + 2449717.5;
		return J_day;
	};

	//{**********************************************************}
	function L_star_jd(j_d)
	//{       определяется долгота солнца юлианскому дню         }
	//{              cредняя ошибка - 12"                        }
	//{Const
	{
		var  e = 0.01671;
		var  r =1296000;
		var  l,m,lam,t2000;
		t2000 = (j_d - 2451545)/36525;
		l = parseFloat(1009678) + (100*r + 2771)*t2000;    //{ средняя долгота }
		// document.AZ_H.test.value="t2000="+t2000+ " j_d="+ j_d+" l="+l;
		l = l*2*Math.PI/1296000;
		m = parseFloat(1287100) + parseFloat((99*r + 1292581)*t2000);
		//  document.AZ_H.test.value="m="+m+ " l="+l;
		//{ средняя аномалия }
		m = m*2*Math.PI/1296000;
		lam = l + 2*e*Math.sin(m) + 1.25*e*e*Math.sin(2*m);// { истинная долгота }

		//document.AZ_H.test.value="lam="+lam+ " m="+ m+" l="+l;
		return lam; //J_day;
	};

	function StarTime(iday,im,iyear) {
		//---Const
		//--- r : real = 1296000.0;    //                 {    ! 360.*3600.}

		var r = 1296000.0;

		var month = new Array(31,28,31,30,31,30,31,31,30,31,30,31);


		var i;
		//integer
		var t,sm,p,e,q,d,f,m,l,pl,ps,s0,ihs,ims,sec;
		// : real;
		//{*--------------------------------------------------------------------*
		//*                        Calculate iday and t                        *
		//*--------------------------------------------------------------------*}

		if (im != 1) {
		//--	i = (iyear div 4)*4;
		var tmp_=Math.floor(iyear/4);
		i=Math.round(4*tmp_);
		if (iyear == i)
		    {month[2] = 29};
		//[1] - v JS s 0 numeracija massiva!, no v dannom sluchae - my uzhe pribavili izvne funkcii
		for (i=1; i<=im-1; i++)  {iday += month[i-1]};
		};

		//50-ja stroka

		var iy = iyear - 1900;
		//--- iday = (iday-1)+(iy-1) div 4;
		iday = Math.floor((iday-1)+(iy-1)/4);

		//document.loc_star.test.value=iy+','+iday+"; "+l_hour+":"+l_min+":"+l_sec;


		//--t := Longint(iday) + Longint(iy)*365.0;
		t=iday + iy*365.0;
		t = (t+0.5)/36525.0;   // {   ! 00.01.1900 12h UT}
		t = t - 1;    // {   ! 01.01.2000 12h UT1}
		//60-ja stroka
		//{*--------------------------------------------------------------------*
		//*                    Calculate mean sidereal time                    *
		//*--------------------------------------------------------------------*}
		sm = 24110.548410 + 8640184.8128660*t + 0.093104*t*t- 0.00000620*t*t*t;
		while (sm <= 0) {sm = sm + 86400.0};
		while (sm > 86400) {sm = sm - 86400.0};
		//{*--------------------------------------------------------------------*
		//*             Calculate long and short periodic nutation             *
		//*--------------------------------------------------------------------*}
		//70-ja stroka
		p = Math.PI/180.0/3600.0;
		//{-------------------}
		e = p*(84381.448 - 46.8150*t - 0.00059*t*t + 0.0018130*t*t*t);
		//{-------------------}
		q = p*( 450160.280 -   5.0*r*t - 482890.539*t+ 7.455*t*t + 0.0080*t*t*t);
		d = p*(1072261.3070 + 1236.0*r*t + 1105601.328*t - 6.891*t*t+ 0.0190*t*t*t);
		f = p*( 335778.8770 + 1342.0*r*t + 295263.1370*t - 13.2570*t*t+ 0.0110*t*t*t);
		m = p*(1287099.804 +  99.0*r*t+1292581.2240*t -  0.5770*t*t - 0.0120*t*t*t);
		l = p*( 485866.7330+1325.0*r*t + 715922.633*t + 31.3100*t*t+ 0.0640*t*t*t);
		//80-ja stroka{*-------------------}

		pl =  -(17.19960 + 0.017420*t)*Math.sin(q);

		//pl=sin(q);
		pl = pl + (0.20620 + 0.000020*t)*Math.sin(2.0*q);
		pl = pl +   0.00460            *Math.sin(q+2.0*f-2.0*l);
		pl = pl +   0.00110            *Math.sin(2.0*(l-f));
		pl = pl -   0.00030            *Math.sin(2.0*(q+f-l));
		pl = pl-   0.00030            * Math.sin (l-m-d);
		pl = pl-   0.00020            * Math.sin (q-2.0*d+2.0*f-2.0*m);
		pl = pl+   0.00010            * Math.sin (q-2.0*f+2.0*l);
		pl = pl-( 1.31870+ 0.000160*t)* Math.sin (2.0*(q-d+f));
		pl = pl+(  0.14260-0.000340*t)* Math.sin (m);
		pl = pl-(  0.05170-0.000120*t)* Math.sin (2.0*q-2.0*d+2.0*f+m);
		pl = pl+(  0.02170-0.000050*t)* Math.sin (2.0*q-2.0*d+2.0*f-m);
		pl = pl+(  0.01290+0.000010*t)* Math.sin (q-2.0*d+2.0*f);
		pl = pl+   0.00480            * Math.sin (2.0*(l-d));
		pl = pl-   0.00220            * Math.sin (2.0*(f-d));
		pl = pl+(  0.00170-0.000010*t)* Math.sin (2.0*m);
		pl = pl-   0.00150            * Math.sin (q+m);
		pl = pl-(  0.00160-0.000010*t)* Math.sin (2.0*(q-d+f+m));
		pl = pl-   0.00120            * Math.sin (q-m);
		pl = pl-   0.00060            * Math.sin (q+2.0*d-2.0*l);
		pl = pl-   0.00050            * Math.sin (q-2.0*d+2.0*f-m);
		pl = pl+   0.00040            * Math.sin (q-2.0*d+2.0*l);
		pl = pl+   0.00040            * Math.sin (q-2.0*d+2.0*f+m);
		pl = pl-   0.00040            * Math.sin (l-d);
		pl = pl+   0.00010            * Math.sin (2.0*l+m-2.0*d);
		pl = pl+   0.00010            * Math.sin (q+2.0*d-2.0*f);
		pl = pl-   0.00010            * Math.sin (2.0*d-2.0*f+m);
		pl = pl+   0.00010            * Math.sin (2.0*q+m);
		pl = pl+   0.00010            * Math.sin (q+d-l);
		pl = pl-   0.00010            * Math.sin (m+2.0*f-2.0*d);
		//111-ja stroka{*------------------- }
		ps =   -(  0.22740+0.000020*t)* Math.sin (2.0*(q+f));
		ps = ps+(  0.07120+0.000010*t)* Math.sin (l);
		ps = ps-(  0.03860+0.000040*t)* Math.sin (q+2.0*f);
		ps = ps-   0.03010            * Math.sin (2.0*q+2.0*f+l);
		ps = ps-   0.01580            * Math.sin (l-2.0*d);
		ps = ps+   0.01230            * Math.sin (2.0*q+2.0*f-l);
		ps = ps+   0.00630            * Math.sin (2.0*d);
		ps = ps+(  0.00630+0.000010*t)* Math.sin (q+l);
		ps = ps-(  0.00580+0.000010*t)* Math.sin (q-l);
		ps = ps-   0.00590            * Math.sin (2.0*q+2.0*d+2.0*f-l);
		ps = ps-   0.00510            * Math.sin (q+2.0*f+l);
		ps = ps-   0.00380            * Math.sin (2.0*(q+d+f));
		ps = ps+   0.00290            * Math.sin (2.0*l);
		ps = ps+   0.00290            * Math.sin (2.0*q-2.0*d+2.0*f+l);
		ps = ps-   0.00310            * Math.sin (2.0*(q+f+l));
		ps = ps+   0.00260            * Math.sin (2.0*f);
		ps = ps+   0.00210            * Math.sin (q+2.0*f-l);
		ps = ps+   0.00160            * Math.sin (q+2.0*d-l);
		ps = ps-   0.00130            * Math.sin (q-2.0*d+l);
		ps = ps-   0.00100            * Math.sin (q+2.0*d+2.0*f-l);
		ps = ps-   0.00070            * Math.sin (l+m-2.0*d);
		ps = ps+   0.00070            * Math.sin (2.0*q+2.0*f+m);
		ps = ps-   0.00070            * Math.sin (2.0*q+2.0*f-m);
		ps = ps-   0.00080            * Math.sin (2.0*q+2.0*d+2.0*f+l);
		ps = ps+   0.00060            * Math.sin (2.0*d+l);
		ps = ps+   0.00060            * Math.sin (2.0*(q-d+f+l));
		ps = ps-   0.00060            * Math.sin (q+2.0*d);
		ps = ps-   0.00070            * Math.sin (q+2.0*d+2.0*f);
		ps = ps+   0.00060            * Math.sin (q-2.0*d+2.0*f+l);
		ps = ps-   0.00050            * Math.sin (q-2.0*d);
		ps = ps+   0.00050            * Math.sin (l-m);
		ps = ps-   0.00050            * Math.sin (q+2.0*f+2.0*l);
		ps = ps-   0.00040            * Math.sin (m-2.0*d);
		ps = ps+   0.00040            * Math.sin (l-2.0*f);
		ps = ps-   0.00040            * Math.sin (d);
		ps = ps-   0.00030            * Math.sin (l+m);
		ps = ps+   0.00030            * Math.sin (l+2.0*f);
		ps = ps-   0.00030            * Math.sin (2.0*q+2.0*f-m+l);
		ps = ps-   0.00030            * Math.sin (2.0*q+2.0*d+2.0*f-m-l);
		ps = ps-   0.00020            * Math.sin (q-2.0*l);
		ps = ps-   0.00030            * Math.sin (2.0*q+2.0*f+3.0*l);
		ps = ps-   0.00030            * Math.sin (2.0*q+2.0*d+2.0*f-m);
		ps = ps+   0.00020            * Math.sin (2.0*q+2.0*f+m+l);
		ps = ps-   0.00020            * Math.sin (q-2.0*d+2.0*f-l);
		ps = ps+   0.00020            * Math.sin (q+2.0*l);
		ps = ps-   0.00020            * Math.sin (2.0*q+l);
		ps = ps+   0.00020            * Math.sin (3.0*l);
		ps = ps+   0.00020            * Math.sin (2.0*q+d+2.0*f);
		ps = ps+   0.00010            * Math.sin (2.0*q-l);
		ps = ps-   0.00010            * Math.sin (l-4.0*d);
		ps = ps+   0.00010            * Math.sin (2.0*(q+d+f-l));
		ps = ps-   0.00020            * Math.sin (2.0*q+4.0*d+2.0*f-l);
		ps = ps-   0.00010            * Math.sin (2.0*l-4.0*d);
		ps = ps+   0.00010            * Math.sin (2.0*q-2.0*d+2.0*f+m+l);
		ps = ps-   0.00010            * Math.sin (q+2.0*d+2.0*f+l);
		ps = ps-   0.00010            * Math.sin (2.0*q+4.0*d+2.0*f-2.0*l);
		ps = ps+   0.00010            * Math.sin (2.0*q+4.0*f-l);
		ps = ps+   0.00010            * Math.sin (l-m-2.0*d);
		ps = ps+   0.00010            * Math.sin (q-2.0*d+2.0*f+2.0*l);
		ps = ps-   0.00010            * Math.sin (2.0*(q+d+f+l));
		ps = ps-   0.00010            * Math.sin (q+2.0*d+l);
		ps = ps+   0.00010            * Math.sin (2.0*q-2.0*d+4.0*f);
		ps = ps+   0.00010            * Math.sin (2.0*q-2.0*d+2.0*f+3.0*l);
		ps = ps-   0.00010            * Math.sin (l+2.0*f-2.0*d);
		ps = ps+   0.00010            * Math.sin (q+2.0*f+m);
		ps = ps+   0.00010            * Math.sin (q+2.0*d-m-l);
		ps = ps-   0.00010            * Math.sin (q-2.0*f);
		ps = ps-   0.00010            * Math.sin (2.0*q-d+2.0*f);
		ps = ps-   0.00010            * Math.sin (2.0*d+m);
		ps = ps-   0.00010            * Math.sin (l-2.0*f-2.0*d);
		ps = ps-   0.00010            * Math.sin (q+2.0*f-m);
		ps = ps-   0.00010            * Math.sin (q-2.0*d+m+l);
		ps = ps-   0.00010            * Math.sin (l-2.0*f+2.0*d);
		ps = ps+   0.00010            * Math.sin (2.0*(l+d));
		ps = ps-   0.00010            * Math.sin (2.0*q+4.0*d+2.0*f);
		ps = ps+   0.00010            * Math.sin (d+m);

		var s0 = sm+(pl+ps)/15.0* Math.cos (e);
		//{*--------------------------------------------------------------------*
		//*                            Print results                           *
		//*--------------------------------------------------------------------*}

		var star_time = Math.PI/12*s0/3600.0;

		//document.AZ_H.test.value="s0="+s0+" star_time_rad="+star_time;

		return star_time;
		//в радианах
	};

	function MS(s) {
	//Begin
	while (s < 0) {s = s + 24};
	while (s > 24) {s = s - 24};
	s = s*(Math.PI/12);
	return s;
	//End;
	};

	//http://wildphoto.irk.ru/travel/sun.html
	//http://planetcalc.ru/320/?language_select=ru

	Math.sun = function(lg,la,ye,mo,da,ho,mi,se,zo) {
		var uu=ut(ho,mi,se,zo);
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

		var ha = (ho*60 + mi + (eqt - 4*-lg - 60*zo))/4-180 ;

		return {
			ha		: ha,
			ra		: RA,
			azimuth	: azm,
			dec		: Math.deg(declin)
		};
	}

	Math.star = function(lg,la,ye,mo,da,ho,mi,se,zo,alpha,beta) {
		var pi= Math.PI;
		var p0 = pi/12;
		var e1 = 23;  //{ наклон эклиптики }
		var e2 = 26;
		var e3 = 23;

		var longitude_h = lg/15;

		var e = pi*(e1 + e2/60 + e3/3600)/180;
		var e4 = Math.cos(e);
		var e5 = Math.sin(e);
		var p1 = Math.cos(pi/6);
		var p2 = Math.sin(pi/6);

		var t =  ye - 1950 + (mo - 0.5)/12;
		var t0 = t/100 + 0.5;
		var a5 = pi*(1.5 + t0*0.00532578);
		var a6 = Math.cos(a5);
		var a7 = Math.sin(a5);

		var e0 = 0.0167510 - (0.0000418 + 0.000000126*t0)*t0;
		//  { g - долгота солнца в перигелии }
		var g = 4.90816 + pi*(15 + (6189.03 + (1.63 + 0.012*t0)*t0)*t0)/648000;
		var g1 = Math.cos(g);
		var g2 = Math.sin(g);

		var v1 = -16;   //{ лучевая скорость }
		var Year = 1996; //{ год }

		var a4 = Math.rad(alpha);
		var d4 = Math.rad(beta);

		var j_d = J_day_(da,mo,ye);

		var  a = a4 + t*p0*(3.07327 + 1.33617*Math.sin(a4)*Math.sin(d4)/Math.cos(d4))/3600;
		var  d = d4 + t*pi*Math.cos(a4)*3.09299e-5;
		var  d5 = Math.cos(d);
		var  d6 = Math.sin(d);

		var  c1 = d5*Math.cos(a);
		var  c2 = d5*Math.sin(a);
		var  c4 = c2*e4 + d6*e5;

		var sin_Latitude=Math.sin(la/180*pi);
		var cos_Latitude=Math.cos(la/180*pi);

		var  d7 = sin_Latitude//0.816641
			*d6;
		var  d8 = cos_Latitude//0.577146
			*d5;
		var  d9 = cos_Latitude//0.577146
			*d6;
		var  d0 = sin_Latitude//0.816641
			*d5;
		//  { v2 поправка за движение солнца к апексу }
		var  v2 = -19.5*((c1*a6 + c2*a7)*p1 + p2*d6);
		//  { поправка за эксцентриситет орбиты земли }
		var  h = e0*(c1*g2 - c4*g1);
		var  y = (L_star_jd(j_d + 1) - L_star_jd(j_d))/24;

		var s0 = StarTime(da,mo,ye);

		var ir = s0*12/pi;
		var	gr = Math.floor(ir);
		var	min_ =  Math.floor((ir-gr)*60);
		var	sec =(ir-gr-min_/60)*3600;

		var t_=Math.floor(ho)+mi/60+se/3600;
		t_=t_+zo;

		s0 = parseInt(gr) + min_/60 + sec/3600 + longitude_h;
		//2.50556 - у Рудницкого!
		var s_00=s0-longitude_h;

		var s=s0 //в часах - на местную полночь
		+(zo)*1.002737909350795;

		var s_=parseFloat(s)+(parseFloat(t_))*1.002737909350795;

		s=MS(s);
		//s- в радианах!
		var  ak0 = (a - s)*0.997271/p0;
		  //{ ak0 - момент верхней кульминации по моск. времени }
		while (ak0 < 0) {ak0 = ak0 + 24 - 0.0656667};
		while (ak0 > 24) {ak0 = ak0 - 24};

		var  k1 = Math.floor(ak0);
		var  k2 = Math.floor((ak0-k1)*60); //frac(ak0)*60;
		var  k3 = Math.floor((ak0-k1-k2/60)*3600);

		var  r1 = k1;
		var  r2 = k2; //exit;

		var  u = t_;
		//var l__=L_star_jd(j_d);
		var  z = L_star_jd(j_d) + parseFloat(y*u);
		var  q = Math.cos(z);
		var  r = Math.sin(z);
		//document.AZ_H.test.value="u="+u+ " z="+ z+" y="+y+ " r="+ r;
		s = s0 + u + 9.85*u/3600;
		//текущее время захватили, ранее в s было время полночи!
		s= MS(s);

		//var  t9 = s - a;
		var  t9 = s - a;
		//текущее
		//зв. время в радианах минус альфа - часовой угол!

		var  b5 = Math.cos(t9);
		var  b6 = Math.sin(t9);
		var  b9 = d7 + d8*b5;
		var  b0 = Math.sqrt(1 - b9*b9);
		var  b3 = d5*b6/b0;
		var  b4 = (d0*b5 - d9)/b0;
		var H_all=180*Math.atan(b9/b0)/pi;
		var  b8 = Math.floor(180*Math.atan(b9/b0)/pi + 0.5);
		var  b7 = 180*Math.atan(b3/b4)/pi;
		if (b4 > 0)
		 {
		 if (b7 < 0)
		  {b7 = b7 + 360}
		 }
		else
		 {b7 = b7 + 180};

		if (b7>180) {b7=b7-360};
		var azimut=Math.abs(b7);


		return {
			ha		: H_all,
			ra		: alpha,
			dec		: beta,
			azimuth	: azimut
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

		var sun = Math.sun(fullLongitude,fullLatitude,date.year,date.month,date.day,time.hours,time.minutes,time.seconds,zone);
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

		var alpha = parseFloat($('#starName option:selected').attr('ra'));
		var beta = parseFloat($('#starName option:selected').attr('dec'));

		var Star = Math.star(fullLongitude,fullLatitude,date.year,date.month,date.day,time.hours,time.minutes,time.seconds,zone, alpha, beta);
		var deltaKStar = cp - Star.azimuth;

		if (Star.ra) {
			$('#inputStarRa').val(Star.ra.toFixed(2));
		}
		if (Star.dec) {
			$('#inputStarGradient').val(Star.dec.toFixed(2));
			var letter = (Star.dec > 0) ? 'N' : 'S';
			$('#inputStarGradient').siblings('.add-on').html(letter);
		}
		if (Star.ha) {
			$('#inputStarLha').val(Star.ha.toFixed(2))
		}
		if (Star.azimuth) {
			$('#inputStarAzimuth').val(Star.azimuth.toFixed(2));
		}

		if (deltaKStar && !star) {
			$('#inputCompass').val(deltaKStar.toFixed(2));
		}


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