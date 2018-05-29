
export default function timeline() {

	console.log('timelinedefault')
	var timelines = document.getElementsByClassName('cd-horizontal-timeline'),
		eventsMinDistance = 40;
	console.log('init', timelines)
initTimeline(timelines);

		function initTimeline(timelines) {
			console.log('timelineseeee', timelines)
			
			
				var timeline = timelines,
					timelineComponents = {};
				//cache timeline components 
			timelineComponents['timelineWrapper'] = document.getElementsByClassName('events-wrapper')[0];
			timelineComponents['eventsWrapper'] = document.getElementsByClassName('events')[0];
			timelineComponents['fillingLine'] = document.getElementsByClassName('filling-line')[0];
			timelineComponents['timelineEvents'] = timelineComponents['eventsWrapper'].getElementsByTagName("a");
				//timelineComponents['timelineEvents'] = timelineComponents['eventsWrapper'].find('a');
				timelineComponents['timelineDates'] = parseDate(timelineComponents['timelineEvents']);
				timelineComponents['eventsMinLapse'] = minLapse(timelineComponents['timelineDates']);
			timelineComponents['timelineNavigation'] = document.getElementsByClassName('cd-timeline-navigation')[0];
			timelineComponents['eventsContent'] = document.getElementsByClassName('events-content')[0];

				//assign a left postion to the single events along the timeline
				setDatePosition(timelineComponents, eventsMinDistance);
				//assign a width to the timeline
				var timelineTotWidth = setTimelineWidth(timelineComponents, eventsMinDistance);
				//the timeline has been initialize - show it
			timeline[0].classList.add('loaded');
			/*
				//detect click on the next arrow
				timelineComponents['timelineNavigation'].on('click', '.next', function(event){
					event.preventDefault();
					updateSlide(timelineComponents, timelineTotWidth, 'next');
				});
				//detect click on the prev arrow
				timelineComponents['timelineNavigation'].on('click', '.prev', function(event){
					event.preventDefault();
					updateSlide(timelineComponents, timelineTotWidth, 'prev');
				});
				//detect click on the a single event - show new event content
				*/
				 var updateTime = function(event){
					console.log('clicktimed')
					event.preventDefault();
					 for (var i = 0; i < timelineComponents['timelineEvents'].length; i++) {
						 timelineComponents['timelineEvents'][i].classList.remove('selected');
					 }
					
					this.classList.add('selected');
					updateOlderEvents((this));
					updateFilling(this, timelineComponents['fillingLine'], timelineTotWidth);
					 console.log(timelineComponents['eventsContent'],'eventscontentssss')
					//updateVisibleContent(this, timelineComponents['eventsContent']);
				};
				var links = timelineComponents['eventsWrapper'].getElementsByTagName("a")
				for (var i = 0; i < links.length; i++){
					links[i].onclick = updateTime;
					console.log('addevent')
				}
				
				/*
				//on swipe, show next/prev event content
				timelineComponents['eventsContent'].on('swipeleft', function(){
					var mq = checkMQ();
					( mq == 'mobile' ) && showNewContent(timelineComponents, timelineTotWidth, 'next');
				});
				timelineComponents['eventsContent'].on('swiperight', function(){
					var mq = checkMQ();
					( mq == 'mobile' ) && showNewContent(timelineComponents, timelineTotWidth, 'prev');
				});

				//keyboard navigation
				$(document).keyup(function(event){
					if(event.which=='37' && elementInViewport(timeline.get(0)) ) {
						showNewContent(timelineComponents, timelineTotWidth, 'prev');
					} else if( event.which=='39' && elementInViewport(timeline.get(0))) {
						showNewContent(timelineComponents, timelineTotWidth, 'next');
					}
				});
	*/
		}

		function updateSlide(timelineComponents, timelineTotWidth, string) {
			//retrieve translateX value of timelineComponents['eventsWrapper']
			var translateValue = getTranslateValue(timelineComponents['eventsWrapper']),
				wrapperWidth = Number(timelineComponents['timelineWrapper'].style.width);
			//translate the timeline to the left('next')/right('prev') 
			(string == 'next') 
				? translateTimeline(timelineComponents, translateValue - wrapperWidth + eventsMinDistance, wrapperWidth - timelineTotWidth)
				: translateTimeline(timelineComponents, translateValue + wrapperWidth - eventsMinDistance);
		}

		function showNewContent(timelineComponents, timelineTotWidth, string) {
			//go from one event to the next/previous one
			var visibleContent =  timelineComponents['eventsContent'].find('.selected'),
				newContent = ( string == 'next' ) ? visibleContent.next() : visibleContent.prev();

			if ( newContent.length > 0 ) { //if there's a next/prev event - show it
				var selectedDate = timelineComponents['eventsWrapper'].find('.selected'),
					newEvent = ( string == 'next' ) ? selectedDate.parent('li').next('li').children('a') : selectedDate.parent('li').prev('li').children('a');
				
				updateFilling(newEvent, timelineComponents['fillingLine'], timelineTotWidth);
				updateVisibleContent(newEvent, timelineComponents['eventsContent']);
				newEvent.addClass('selected');
				selectedDate.removeClass('selected');
				updateOlderEvents(newEvent);
				updateTimelinePosition(string, newEvent, timelineComponents);
			}
		}

		function updateTimelinePosition(string, event, timelineComponents) {
			//translate timeline to the left/right according to the position of the selected event
			var eventStyle = window.getComputedStyle(event, null),
				eventLeft = Number(eventStyle.getPropertyValue("left").replace('px', '')),
				timelineWidth = Number(timelineComponents['timelineWrapper'].style.width),
				timelineTotWidth = Number(timelineComponents['eventsWrapper'].style.width);
			var timelineTranslate = getTranslateValue(timelineComponents['eventsWrapper']);

					if( (string == 'next' && eventLeft > timelineWidth - timelineTranslate) || (string == 'prev' && eventLeft < - timelineTranslate) ) {
						translateTimeline(timelineComponents, - eventLeft + timelineWidth/2, timelineWidth - timelineTotWidth);
					}
		}

		function translateTimeline(timelineComponents, value, totWidth) {
			console.log(timelineComponents['eventsWrapper'],'evewrapper')
			var eventsWrapper = timelineComponents['eventsWrapper'];
			value = (value > 0) ? 0 : value; //only negative translate value
			value = ( !(typeof totWidth === 'undefined') &&  value < totWidth ) ? totWidth : value; //do not translate more than timeline width
			setTransformValue(eventsWrapper, 'translateX', value+'px');
			//update navigation arrows visibility
			//(value == 0 ) ? timelineComponents['timelineNavigation'].find('.prev').addClass('inactive') : timelineComponents['timelineNavigation'].find('.prev').removeClass('inactive');
			//(value == totWidth ) ? timelineComponents['timelineNavigation'].find('.next').addClass('inactive') : timelineComponents['timelineNavigation'].find('.next').removeClass('inactive');
		}

		function updateFilling(selectedEvent, filling, totWidth) {
			//change .filling-line length according to the selected event
			console.log(selectedEvent,'selected')
			var eventStyle = window.getComputedStyle(selectedEvent, null),
				eventLeft = eventStyle.getPropertyValue("left"),
				eventWidth = eventStyle.getPropertyValue("width");
			eventLeft = Number(eventLeft.replace('px', '')) + Number(eventWidth.replace('px', ''))/2;
			var scaleValue = eventLeft/totWidth;
			setTransformValue(filling, 'scaleX', scaleValue);
		}

		function setDatePosition(timelineComponents, min) {
			for (var i = 0; i < timelineComponents['timelineDates'].length; i++) { 
					var distance = daydiff(timelineComponents['timelineDates'][0], timelineComponents['timelineDates'][i]),
						distanceNorm = Math.round(distance/timelineComponents['eventsMinLapse']) + 2;
				//timelineComponents['timelineEvents'][i].style.left = distanceNorm * min + 'px';
				timelineComponents['timelineEvents'][i].style.left = (timelineComponents['eventsWrapper'].offsetWidth / timelineComponents['timelineEvents'].length)* i  + 'px';
			}
		}

		function setTimelineWidth(timelineComponents, width) {
			var timeSpan = daydiff(timelineComponents['timelineDates'][0], timelineComponents['timelineDates'][timelineComponents['timelineDates'].length-1]),
				timeSpanNorm = timeSpan/timelineComponents['eventsMinLapse'],
				timeSpanNorm = Math.round(timeSpanNorm) + 4,
				totalWidth = timeSpanNorm*width;
			console.log(timelineComponents['eventsWrapper'].offsetWidth,'thweigth')
			totalWidth = timelineComponents['eventsWrapper'].offsetWidth
			timelineComponents['eventsWrapper'].style.width=(totalWidth+'px');
			updateFilling(timelineComponents['eventsWrapper'].querySelector('a.selected'), timelineComponents['fillingLine'], totalWidth);
			updateTimelinePosition('next', timelineComponents['eventsWrapper'].querySelector('a.selected'), timelineComponents);
		
			return totalWidth;
		}

		function updateVisibleContent(event, eventsContent) {
			console.log(eventsContent,'eventContent')
			var eventDate = event.getAttribute('data-date'),
				visibleContent = eventsContent.getElementsByClassName('selected')[0],
				selectedContent = eventsContent.querySelector('[data-date="' + eventDate + '"]')
				//selectedContent = eventsContent.find('[data-date="'+ eventDate +'"]'),
				selectedContentHeight = selectedContent.height();

			if (selectedContent.index() > visibleContent.index()) {
				var classEnetering = 'selected enter-right',
					classLeaving = 'leave-left';
			} else {
				var classEnetering = 'selected enter-left',
					classLeaving = 'leave-right';
			}

			selectedContent.attr('class', classEnetering);
			visibleContent.attr('class', classLeaving).one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
				visibleContent.removeClass('leave-right leave-left');
				selectedContent.removeClass('enter-left enter-right');
			});
			eventsContent.css('height', selectedContentHeight+'px');
		}

		function updateOlderEvents(event) {
			
			var parent = event.parentElement;
			console.log(event, 'tareget',parent)
		//	var active = element.querySelector('.active');
			var prev = parent.previousElementSibling;
			var next = parent.nextElementSibling;
			console.log(prev, next, parent, 'siblings')
			if (prev){	
				prev.getElementsByTagName("a")[0].classList.add('older-event');
				while (prev = prev.previousElementSibling) prev.getElementsByTagName("a")[0].classList.add("older-event");
			}
			if (next){
				next.getElementsByTagName("a")[0].classList.remove('older-event')
				while (next = next.nextElementSibling) next.getElementsByTagName("a")[0].classList.remove("older-event");
			}
			
			
			//while (e = parent.previousElementSibling) prev.classList.add("older-event");
			//prev.getElementsByTagName("a")[0].classList.add('older-event')
			//next.getElementsByTagName("a")[0].classList.remove('older-event')
		//	event.parent('li').prevAll('li').children('a').addClass('older-event').end().end().nextAll('li').children('a').removeClass('older-event');
		}

		function getTranslateValue(timeline) {
			var timelineStyle = window.getComputedStyle(timeline, null),
				timelineTranslate = timelineStyle.getPropertyValue("-webkit-transform") ||
							timelineStyle.getPropertyValue("-moz-transform") ||
							timelineStyle.getPropertyValue("-ms-transform") ||
							timelineStyle.getPropertyValue("-o-transform") ||
							timelineStyle.getPropertyValue("transform");

					if( timelineTranslate.indexOf('(') >=0 ) {
						var timelineTranslate = timelineTranslate.split('(')[1];
					timelineTranslate = timelineTranslate.split(')')[0];
					timelineTranslate = timelineTranslate.split(',');
					var translateValue = timelineTranslate[4];
					} else {
						var translateValue = 0;
					}

					return Number(translateValue);
		}

		function setTransformValue(element, property, value) {
			element.style["-webkit-transform"] = property+"("+value+")";
			element.style["-moz-transform"] = property+"("+value+")";
			element.style["-ms-transform"] = property+"("+value+")";
			element.style["-o-transform"] = property+"("+value+")";
			element.style["transform"] = property+"("+value+")";
		}

		//based on http://stackoverflow.com/questions/542938/how-do-i-get-the-number-of-days-between-two-dates-in-javascript
		function parseDate(events) {
			var dateArrays = [];
			console.log(events,'events')
			for (var i = 0; i < events.length; i++){
				var singleDate = events[i];
				console.log(singleDate,'singleadeta')
				 var dateComp = singleDate.getAttribute('data-date').split('T');
				if( dateComp.length > 1 ) { //both DD/MM/YEAR and time are provided
					var dayComp = dateComp[0].split('/'),
						timeComp = dateComp[1].split(':');
				} else if( dateComp[0].indexOf(':') >=0 ) { //only time is provide
					var dayComp = ["2000", "0", "0"],
						timeComp = dateComp[0].split(':');
				} else { //only DD/MM/YEAR
					var dayComp = dateComp[0].split('/'),
						timeComp = ["0", "0"];
				}
				var	newDate = new Date(dayComp[2], dayComp[1]-1, dayComp[0], timeComp[0], timeComp[1]);
				dateArrays.push(newDate);
			};
				return dateArrays;
		}

		function daydiff(first, second) {
				return Math.round((second-first));
		}

		function minLapse(dates) {
			//determine the minimum distance among events
			var dateDistances = [];
			for (var i = 1; i < dates.length; i++) { 
					var distance = daydiff(dates[i-1], dates[i]);
					dateDistances.push(distance);
			}
			return Math.min.apply(null, dateDistances);
		}

		/*
			How to tell if a DOM element is visible in the current viewport?
			http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
		*/
		function elementInViewport(el) {
			var top = el.offsetTop;
			var left = el.offsetLeft;
			var width = el.offsetWidth;
			var height = el.offsetHeight;

			while(el.offsetParent) {
					el = el.offsetParent;
					top += el.offsetTop;
					left += el.offsetLeft;
			}

			return (
					top < (window.pageYOffset + window.innerHeight) &&
					left < (window.pageXOffset + window.innerWidth) &&
					(top + height) > window.pageYOffset &&
					(left + width) > window.pageXOffset
			);
		}

		function checkMQ() {
			//check if mobile or desktop device
			return window.getComputedStyle(document.querySelector('.cd-horizontal-timeline'), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "");
		}
	}
