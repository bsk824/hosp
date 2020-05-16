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

const clst = {
	parent : null,
	find : (_this, target) => {
		let tag = _this.parentNode.tagName.toLowerCase();
		let cls = _this.parentNode.classList;
		let id = _this.parentNode.getAttribute('id');
		clst.parent = _this.parentNode;
		if(target !== tag && !cls.contains(target) && target != id) {
			if(tag != 'body') {
				clst.find(clst.parent, target);
			} else {
				return false;
			}
		}
		return clst.parent;
	}
}
const childFind = (el, target) => {
	let obj = '';
	let arr = [];
	for(let idx = 0 ; idx < el.childNodes.length; idx++) {
		if(el.childNodes[idx].nodeType == 1) {
			let tag = el.childNodes[idx].tagName.toLowerCase();
			let cls = el.childNodes[idx].classList;
			let id = el.childNodes[idx].getAttribute('id');
			if(target === tag || cls.contains(target) || target === id) {
				obj = el.childNodes[idx];
				arr.push(el.childNodes[idx]);
			}
		}
	}
	if(arr.length > 1) {
		return arr;
	} else {
		return obj;
	}
}
const nextNodeFind = obj => {
	if(obj.nextSibling.nodeType == 1) {
		next = obj.nextSibling;
	} else {
		nextNodeFind(obj.nextSibling);
	}
	return next;
}

const mainHeight = () => {
	let wrap = document.querySelector('.mainSlideWrap');
	let slideWrap = childFind(wrap, 'swiper-wrapper');
	let slideItem = childFind(slideWrap, 'swiper-slide');
	let activeSlide = childFind(slideWrap, 'swiper-slide-active');
	let inner = activeSlide.querySelector('.inner');
	slideItem.forEach(obj => {
		obj.style.height = obj.querySelector('.inner').clientHeight+'px';
	});
	wrap.style.height = inner.clientHeight+'px';
}
const listTypeToggle = () => {
	let $this = event.currentTarget;
	let listWrap = clst.find($this, 'listWrap');
	listWrap.classList.toggle('typeCube');
}
const gnb = () => {
	let doc = document.querySelector('html');
	let gnb = document.querySelector('#gnb');
	let inner = gnb.querySelector('.inner');
	doc.classList.add('scrollLock');
	gnb.classList.add('open');
	gnb.addEventListener('click', () => {
		doc.classList.remove('scrollLock');
		gnb.classList.remove('open');
	});
	inner.addEventListener('click', () => {
		event.stopPropagation();
	});
}
const headerSearch = () => {
	let doc = document.querySelector('html');
	let wrap = document.querySelector('#header .searchWrap');
	let inner = wrap.querySelector('.inner');
	doc.classList.add('scrollLock');
	wrap.classList.add('open');
	wrap.addEventListener('click', () => {
		doc.classList.remove('scrollLock');
		wrap.classList.remove('open');
	});
	inner.addEventListener('click', () => {
		event.stopPropagation();
	});
}
const subMenu = () => {
	let $this = event.currentTarget;
	let wrap = clst.find($this, 'ul');
	let list = childFind(wrap, 'li');
	if($this.parentNode.classList.contains('active')){
		list.forEach( el =>{
			if(el.classList.contains('active')) el.classList.remove('active');
		});
	} else {
		list.forEach( el =>{
			if(el.classList.contains('active')) el.classList.remove('active');
		});
		$this.parentNode.classList.add('active');
	}
}
const listSearch = {
	btn : null,
	input: null,
	open : () => {
		listSearch.btn = event.currentTarget;
		listSearch.input = nextNodeFind(listSearch.btn);
		listSearch.input.classList.add('open');
	}, 
	close : () => {
		listSearch.input.classList.remove('open');
	}
} 
const locOpen = () => {
	let $this =  event.currentTarget;
	let wrap = clst.find($this, 'location');
	let box = childFind(wrap, 'locBox');
	if(box.length > 1){
		if($this.parentNode.classList.contains('active')){
			box.forEach( el =>{
				if(el.classList.contains('active')) el.classList.remove('active');
			});
		} else {
			box.forEach( el =>{
				if(el.classList.contains('active')) el.classList.remove('active');
			});
			$this.parentNode.classList.add('active');
		}
	} else {$this.parentNode.classList.toggle('active');}
}
const slide = {
	open : (el, time, cls, callBack) => {
		let wrap = el;
		let wrapH = 0;
		wrap.style.cssText = 'opacity: 0;display:block;'
		wrapH = wrap.clientHeight;
		wrap.style.cssText = 'overflow:hidden;height:0;transition:height '+(time*0.001)+'s';
		setTimeout(()=>{
			wrap.style.height = wrapH + 'px';
		},1);
		setTimeout(()=>{
			wrap.removeAttribute('style');
			if(cls) wrap.classList.add(cls);
			if(typeof callBack != 'undefined' && callBack){
				if(typeof callBack == 'function'){
					callBack();
				} else {
					if(callBack) { eval( callBack ); }
				}
			}
		},time);
	},
	close : (el, time, cls, callBack) => {
		let wrap = el;
		let wrapH = el.clientHeight;
		wrap.style.cssText = 'overflow:hidden;height:'+wrapH+'px;transition:height '+(time*0.001)+'s';
		setTimeout(()=>{
			wrap.style.height = '1px';
		},1);
		setTimeout(()=>{
			wrap.removeAttribute('style');
			if(cls) wrap.classList.remove(cls);
			if(typeof callBack != 'undefined' && callBack){
				if(typeof callBack == 'function'){
					callBack();
				} else {
					if(callBack) { eval( callBack ); }
				}
			}
		},300);
	},
	toggle : (el, time, cls, callBack) => {
		(el.classList.contains(cls)) ? slide.close(el, time, cls, callBack) : slide.open(el, time, cls, callBack);
	}
}

const slider = {
	obj : {},
	create : elm => {
		if(elm == 'mainSlide') {
			let slideWrap = $('#'+elm);
			let tab = slideWrap.find('.mainNav button');
			swiper = new Swiper('#'+elm+' .mainSlideWrap', {
				loop: true,
				autoHeight: true,
				on: {
					init : () => {
						mainHeight();
						$('.slideLink').on('touchmove', () => {
							event.stopPropagation();
						})
					},
					slideChangeTransitionEnd : () => {
						var num = swiper.realIndex;
						mainHeight();
						tab.eq(num).addClass('active').siblings().removeClass('active');
					}
				}
			});
			slider.obj[elm] = swiper;
			window.addEventListener('resize',() => {
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
			slider.obj[elm] = swiper;
			slider.obj[elm].on('slideChange', () => {
				let num = this.realIndex + 1;
				if(num < 10) num = '0'+num;
				slideNum.text(num);
			});
		}
	}
}