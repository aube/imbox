var ImBox = function(params){

	var container = params.container;
	var images = params.images;
	var frames = [];
	var currentFrame = params.currentFrame || 0;
	var speed = params.speed || 400;
	var closeButton = params.closeButton;
	var zoomOnClick = params.zoomOnClick;
	var imagesIsThumbnails = params.imagesIsThumbnails;

	var _blockActionTimeOut;


	function Div(parent,styles)
	{
		var el = parent.appendChild(document.createElement('div'));
		for (var n in styles)
		{
			if (!styles.hasOwnProperty(n)) continue;
			el.style[n] = styles[n];
		}
		return el;
	}

	function toggleClass(el,name)
	{
		if (el && el.className)
			switch(el.className)
			{
				case '':
					el.className = name;
					break;
				case name:
					el.className = '';
					break;
				default:
					var rg = new RegExp('(^'+name+'[ ]+|[ ]+'+name+'[ ]+|[ ]+'+name+')','g');
					var tmp = el.className.replace(rg,'');
					if (tmp == el.className)
						el.className += ' '+name;
					else
						el.className = tmp;
			}
	}

	function setClasses()
	{
		for (var n = parseInt(frames.length/2); n > 0; n--)
		{
			var left = currentFrame-n;
			var rigth = (currentFrame+n) % frames.length;
			frames.slice(left)[0].className = 'left';
			frames.slice(rigth)[0].className = 'right';
		}
		frames[currentFrame].className = 'center';
	};

	function moveTo(n)
	{
		if (_blockActionTimeOut) return;
		setTimeout(function(){
			setClasses();
			_blockActionTimeOut=false
		},speed);
		_blockActionTimeOut = true;

		frames[currentFrame].className = 'oldcenter';

		if (imagesIsThumbnails)
			toggleClass(images[currentFrame],'active');

		currentFrame = n > (frames.length-1) ? n % (frames.length) : n;

		frames[currentFrame].className = 'center';

		if (imagesIsThumbnails)
			toggleClass(images[currentFrame],'active');
	};

	function prev()
	{
		return currentFrame+1 === frames.length ? 0 : currentFrame+1;
	}
	function next()
	{
		return currentFrame===0 ? frames.length-1 : currentFrame-1;
	}

	//actions
	var toLeft = function()
	{
		moveTo(next());
	}
	var toRight = function()
	{
		moveTo(prev());
	}

	var close = function()
	{
		if (params.container)
			container.innerHTML = '';
		else
		{
			container.parentNode.removeChild(container);
			window.removeEventListener('keyup',keyboardEvents);
		}
	}
	var keyboardEvents = function(event)
	{
		event = event || window.event;
		if (event.keyCode == 27 && ImBox.zoomBox) //esc with zoomBox
		{
			ImBox.zoomBox.close();
			delete ImBox.zoomBox;
		}
	}

	if (!images || !images.length)
	{
		return false;
	}


	//initialize container
	if (container)
	{
		container.innerHTML = '';
	}
	else
	{
		container = new Div(document.body);
	}

	container.className = 'imBox-container';
	if (params.containerClass)
		container.className += ' '+params.containerClass;

	if (zoomOnClick)
	{
		container.className += ' zoomOnClick';
	}


	//initialize frames
	for (var n in images)
	{
		if (!images.hasOwnProperty(n)) continue;

		var src = images[n];
		if (images[n] instanceof HTMLElement)
		{
			src = images[n].getAttribute('data-imboxsrc') || images[n].src;
			console.log(images[n]);
			if (imagesIsThumbnails)
			{
				images[n].addEventListener('click',
					(function(x){
						return function(){
							moveTo(+x);
						};
					})(n)
				);
			}
		}

		var styles = {
			backgroundImage:'url('+src+')',
			transition: 'left '+(speed/1000)+'s'
		};
		//styles='';
		var frame = new Div(container, styles);
		frames.push(frame);
	}


	if (zoomOnClick)
	{
		//create enlarged ImBox
		container.onclick = function(e){
			if (e.target == frames[currentFrame])
			{
				ImBox.zoomBox = new ImBox({
					images:images,
					currentFrame:currentFrame,
					closeButton:true,
					containerClass:'enlarged'
				});
				window.addEventListener('keyup',keyboardEvents);
			}
		};
	}


	//initialize controls
	if (images.length > 1)
	{
		var leftArrow = new Div(container);
		leftArrow.className = 'left-arrow';
		leftArrow.onclick = toLeft;

		var rightArrow = new Div(container);
		rightArrow.className = 'right-arrow';
		rightArrow.onclick = toRight;
	}

	if (closeButton)
	{
		closeButton = new Div(container);
		closeButton.className = 'close-button';
		closeButton.onclick = close;
	}

	setClasses();
	if (imagesIsThumbnails)
		toggleClass(images[currentFrame],'active');

	//public methods
	return {
		toLeft:toLeft
		,toRight:toRight
		,close:close
		,moveTo:moveTo
		,keyboardEvents:keyboardEvents
	}


}

/*
var params = {
	container:document.querySelector('.ImBox-container'),
	images:document.querySelectorAll('#contentContainer>img'),
	imagesIsThumbnails:true,
	closeButton:false,
	zoomOnClick:true
};
var box = new ImBox(params);
var n = 25;
//setInterval(function(){box.moveTo(n++)},1000);
//setInterval(box.close,10000);
*/