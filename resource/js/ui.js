const device = {
	agent : navigator.userAgent.toLocaleLowerCase(),
	os : null,
	ver : null,
	init : () => {
		if(device.agent.indexOf('iphone') > -1 || device.agent.indexOf('ipad') > -1) {
			let str = device.agent.substring(device.agent.indexOf('os') + 3);
			let ver = str.substring(0, str.indexOf(' like'));
			device.os = 'ios';
			device.ver = device.os + ver;
		}
		if(device.agent.indexOf('android') > -1) {
			let str = device.agent.substring(device.agent.indexOf('android') + 8);
			let strSub = str.substring(0, str.indexOf(';'));
			let ver = strSub.replace(/[.]/gi,'_');
			device.os = 'android';
			device.ver = device.os + ver;
		}
		device.set();
	},
	set : () => {
		let html = document.querySelector('html');
		let htmlClass = html.getAttribute('class');
		let trash = '';
		if(device.agent.indexOf('samsung') > -1) trash += ' samsung';
		if(device.agent.indexOf('naver') > -1) trash += ' naver';
		(htmlClass) ? html.setAttribute('class', htmlClass+' '+device.ver+trash) : html.setAttribute('class', device.ver+trash);
	}
}
device.init();

const mainHeight = () => {
	let wrap = $('.mainSlideWrap > .swiper-wrapper');
	let slideItem = wrap.find('> .swiper-slide');
	slideItem.each(function(){
		$(this).css('height',$(this).find('> .inner').height()+'px');
	});
}
const slide = {
	obj : {},
	create : (elm) => {
		if(elm == 'mainSlide') {
			let slideWrap = $('#'+elm);
			let tab = slideWrap.find('.mainNav button');
			swiper = new Swiper('#'+elm+' .mainSlideWrap', {
				loop: true,
				autoHeight: true,
				on: {
					init : function() {
						mainHeight();
						$('.slideLink').on('touchmove', function(){
							event.stopPropagation();
						})
					},
					slideChange : function(){
						var num = this.realIndex;
						mainHeight();
						tab.eq(num).addClass('active').siblings().removeClass('active');
					}
				}
			});
			slide.obj[elm] = swiper;
			$(window).on('resize', function(){
				mainHeight();
			});
		}
		if(elm == 'visualSlide') {
			let slideWrap = $('#' + elm);
			let slideItem = slideWrap.find('.swiper-slide');
			let slideNum = slideWrap.find('.slideCount .numActive');
			let slideTotal = slideWrap.find('.slideCount .numTotal');
			let totalNum;
			(slideItem.length < 10) ? totalNum = '0'+slideItem.length : totalNum = slideItem.length;
			slideTotal.text(totalNum);
			swiper = new Swiper('#' + elm + ' .slideContainer', {
				loop: true,
				speed: 500,
				pagination: {
					el: '.' + elm + ' .slidePage',
					clickable: true,
					renderBullet: function (index, className) {
						return '<button type="button" class="' + className + '">' + (index + 1) + '</button>';
					},
				},
				navigation: {
					prevEl: '#' + elm + ' .slideNavPrev',
					nextEl: '#' + elm + ' .slideNavNext',
				}
			});
			slide.obj[elm] = swiper;
			slide.obj[elm].on('slideChange', function(){
				let num = this.realIndex + 1;
				if(num < 10) num = '0'+num;
				slideNum.text(num);
			});
		}
	}
}