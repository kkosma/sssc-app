/*
 * @author zz85 / https://github.com/zz85
 * @author mrdoob / http://mrdoob.com
 * Running this will allow you to drag three.js objects around the screen.
 */

THREE.DragControls = function (_objects, _camera, _domElement) {

	if (_objects instanceof THREE.Camera) {

		console.warn('THREE.DragControls: Constructor now expects ( objects, camera, domElement )');
		var temp = _objects; _objects = _camera; _camera = temp;

	}

	var _plane = new THREE.Plane();
	var _raycaster = new THREE.Raycaster();

	var _mouse = new THREE.Vector2();
	var _offset = new THREE.Vector3();
	var _intersection = new THREE.Vector3();

	var _selected = null, _hovered = null;
	var currentTouches = new Array
	var findCurrentTouchIndex
	var activeBones = _objects

	//

	var scope = this;

	function activate() {

		_domElement.addEventListener('mousemove', onDocumentMouseMove, false);
		_domElement.addEventListener('mousedown', onDocumentMouseDown, false);
		_domElement.addEventListener('mouseup', onDocumentMouseCancel, false);
		_domElement.addEventListener('mouseleave', onDocumentMouseCancel, false);
		_domElement.addEventListener('touchmove', onDocumentTouchMove, false);
		_domElement.addEventListener('touchstart', onDocumentTouchStart, false);
		_domElement.addEventListener('touchend', onDocumentTouchEnd, false);

	}

	function deactivate() {

		_domElement.removeEventListener('mousemove', onDocumentMouseMove, false);
		_domElement.removeEventListener('mousedown', onDocumentMouseDown, false);
		_domElement.removeEventListener('mouseup', onDocumentMouseCancel, false);
		_domElement.removeEventListener('mouseleave', onDocumentMouseCancel, false);
		_domElement.removeEventListener('touchmove', onDocumentTouchMove, false);
		_domElement.removeEventListener('touchstart', onDocumentTouchStart, false);
		_domElement.removeEventListener('touchend', onDocumentTouchEnd, false);

	}

	function dispose() {

		deactivate();

	}

	function onDocumentMouseMove(event) {

		event.preventDefault();

		var rect = _domElement.getBoundingClientRect();

		_mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
		_mouse.y = - ((event.clientY - rect.top) / rect.height) * 2 + 1;

		_raycaster.setFromCamera(_mouse, _camera);

		if (_selected && scope.enabled) {

			if (_raycaster.ray.intersectPlane(_plane, _intersection)) {
				// Lock x Axis to origin
				_selected.position.x = 0
				_offset.x = 0
				_intersection.x = 0

				_selected.position.copy(_intersection.sub(_offset));

			}

			scope.dispatchEvent({ type: 'drag', object: _selected });

			return;

		}

		_raycaster.setFromCamera(_mouse, _camera);

		var intersects = _raycaster.intersectObjects(_objects);

		if (intersects.length > 0) {

			var object = intersects[0].object;

			_plane.setFromNormalAndCoplanarPoint(_camera.getWorldDirection(_plane.normal), object.position);

			if (_hovered !== object) {

				scope.dispatchEvent({ type: 'hoveron', object: object });

				_domElement.style.cursor = 'pointer';
				_hovered = object;

			}

		} else {

			if (_hovered !== null) {

				scope.dispatchEvent({ type: 'hoveroff', object: _hovered });

				_domElement.style.cursor = 'auto';
				_hovered = null;

			}

		}

	}

	function onDocumentMouseDown(event) {
		console.log('mousedonw', _objects, event, event.clientX)
		event.preventDefault();

		_raycaster.setFromCamera(_mouse, _camera);

		var inverseMatrix = new THREE.Matrix4(), ray = new THREE.Ray();
		//for example textGeo is the textGeometry
		inverseMatrix.getInverse(_objects[0].matrixWorld);
		ray.copy(_raycaster.ray).applyMatrix4(inverseMatrix);
		console.log('movvvvvvvvv', _mouse)
		if (_objects[0].geometry.boundingBox !== null) {
			if (ray.isIntersectionBox(_objects[0].geometry.boundingBox) === true || app.forceDrag == true) {
				//intersected

				_selected = _objects[0]

				_plane.setFromNormalAndCoplanarPoint(_camera.getWorldDirection(_plane.normal), _selected.position);

				if (_raycaster.ray.intersectPlane(_plane, _intersection)) {

					_offset.copy(_intersection).sub(_selected.position);

				}

				_domElement.style.cursor = 'move';

				scope.dispatchEvent({ type: 'dragstart', object: _selected });
			}
		}

		var intersects = _raycaster.intersectObjects(_objects);

		if (intersects.length > 0) {

			_selected = intersects[0].object;

			if (_raycaster.ray.intersectPlane(_plane, _intersection)) {

				_offset.copy(_intersection).sub(_selected.position);

			}

			_domElement.style.cursor = 'move';

			scope.dispatchEvent({ type: 'dragstart', object: _selected });

		}


	}

	function onDocumentMouseCancel(event) {

		event.preventDefault();

		if (_selected) {

			scope.dispatchEvent({ type: 'dragend', object: _selected });

			_selected = null;

		}

		_domElement.style.cursor = 'auto';

	}

	function onDocumentTouchMove(event) {
		//console.log('touchmovingggg')
		var touches = event.changedTouches;
		event.preventDefault();
		for (var i = 0; i < touches.length; i++) {


			event = touches[i];
			var currentTouchIndex = findCurrentTouchIndex(event.identifier);
			//	console.log(touches[i],event,currentTouchIndex,'yo')
			if (currentTouchIndex >= 0) {
				var currentTouch = currentTouches[currentTouchIndex];
				var rect = _domElement.getBoundingClientRect();
				console.log(currentTouch, currentTouchIndex, 'movetouches')
				currentTouch.pageX = event.pageX;
				currentTouch.pageY = event.pageY;
				currentTouches.splice(currentTouchIndex, 1, currentTouch);
				_mouse.x = ((currentTouch.pageX - rect.left) / rect.width) * 2 - 1;
				_mouse.y = - ((currentTouch.pageY - rect.top) / rect.height) * 2 + 1;

				_raycaster.setFromCamera(_mouse, _camera);
				//currentTouch.selected =currentTouch.object
				//console.log(_selected, scope.enabled, 'selected', _plane, _intersection, _mouse)
				if (currentTouch.selected && scope.enabled) {
					//console.log('sleects and enabled')
					if (_raycaster.ray.intersectPlane(currentTouch.plane, _intersection)) {
						console.log(currentTouch, currentTouch.plane, 'plane')
						// Lock x Axis to origin
						currentTouch.selected.position.x = 0
						currentTouch.offset.x = 0
						_intersection.x = 0
						//	console.log('intersected',_selected.position,_intersection)
						currentTouch.selected.position.copy(_intersection.sub(currentTouch.offset));

					}

					scope.dispatchEvent({ type: 'drag', object: currentTouch.object });

					//return;

				}
			}
		}

	}

	function onDocumentTouchStart(event) {
		console.log('touchstart', event, _objects, event.clientX)
		event.preventDefault();

		//event.changedTouches ? event = event.changedTouches[event.changedTouches.length-1] : null
		var touches = event.changedTouches;
		console.log(touches, 'touches')
		if (touches) {
			for (var i = 0; i < touches.length; i++) {
				console.log(touches[i], _objects, 'objects')
				event = touches[i]
				var rect = _domElement.getBoundingClientRect();

				_mouse.x = ((event.pageX - rect.left) / rect.width) * 2 - 1;
				_mouse.y = - ((event.pageY - rect.top) / rect.height) * 2 + 1;

				_raycaster.setFromCamera(_mouse, _camera);
				console.log(_mouse, _raycaster, 'rays', currentTouch)
				//var intersects = _raycaster.intersectObjects(_objects);

				var inverseMatrix = new THREE.Matrix4(), ray = new THREE.Ray();
				//for example textGeo is the textGeometry

				for (var e = 0; e < _objects.length; e++) {
					inverseMatrix.getInverse(_objects[e].matrixWorld);
					ray.copy(_raycaster.ray).applyMatrix4(inverseMatrix);
					if (_objects[e].geometry.boundingBox !== null) {
						console.log(_objects[e], 'OBJCT')
						if (ray.isIntersectionBox(_objects[e].geometry.boundingBox) === true || app.forceDrag == true) {

							currentTouches.push({
								id: event.identifier,
								pageX: event.pageX,
								pageY: event.pageY,
								object: _objects[e],
								selected: null,
							});

							var currentTouchIndex = findCurrentTouchIndex(event.identifier);
							if (currentTouchIndex >= 0) {
								var currentTouch = currentTouches[currentTouchIndex];

								//intersected

								currentTouch.selected = currentTouch.object
								console.log(currentTouch.selected, 'selectpos')
								_plane.setFromNormalAndCoplanarPoint(_camera.getWorldDirection(_plane.normal), currentTouch.selected.position);
								currentTouch.plane ? {} : currentTouch.plane = new THREE.Plane().copy(_plane);
								if (_raycaster.ray.intersectPlane(_plane, _intersection)) {
									console.log('startintersect')
									_offset.copy(_intersection).sub(currentTouch.selected.position);
									currentTouch.offset ? {} : currentTouch.offset = new THREE.Vector3().copy(_offset)

								}
								console.log('touchmovein', _selected)
								_domElement.style.cursor = 'move';
								app.controls.enabled = false;
								scope.dispatchEvent({ type: 'dragstart', object: currentTouch.object });
							}
						}
					}
				}
			}
		}
	}

	function onDocumentTouchEnd(event) {

		event.preventDefault();
		console.log(event.changedTouches, 'TOUCHEND')
		var touches = event.changedTouches;

		for (var i = 0; i < touches.length; i++) {
			var touch = touches[i];
			var currentTouchIndex = findCurrentTouchIndex(touch.identifier);
			//console.log('REmove Touch)', currentTouchIndex,touch,i);
			if (currentTouchIndex >= 0) {
				var currentTouch = currentTouches[currentTouchIndex];
				console.log('REmove Touch)', currentTouch.object);
				currentTouches.splice(currentTouchIndex, 1);
				scope.dispatchEvent({ type: 'dragend', object: currentTouch.object });

				//currentTouch.object = null;
				// Remove the record.
				//currentTouch.selected =null

			} else {
				console.log('Touch was not found!');
			}

		}

		if (currentTouches.length == 0) {
			console.log('ENABLE CONTROLS')
			app.controls.enabled = true;
		}

		if (_selected) {



		}


		_domElement.style.cursor = 'auto';

	}

	// Finds the array index of a touch in the currentTouches array.
	findCurrentTouchIndex = function (id) {
		for (var i = 0; i < currentTouches.length; i++) {
			if (currentTouches[i].id === id) {
				return i;
			}
		}

		// Touch not found! Return -1.
		return -1;
	};

	activate();

	// API

	this.enabled = true;

	this.activate = activate;
	this.deactivate = deactivate;
	this.dispose = dispose;

	// Backward compatibility

	this.setObjects = function () {

		console.error('THREE.DragControls: setObjects() has been removed.');

	};
	this.addObject = function (object) {
		activeBones.push(object)

	}
	this.removeObject = function (object) {
		//var currentObject = activeBones.indexOf[object];
		var index = activeBones.findIndex(p => p.name == object.name)
		console.log("SPLECE", activeBones, index, object)
		activeBones.splice(index, 1);
		var touchIndex = currentTouches.findIndex(p => p.object.name == object.name)
		currentTouches.splice(touchIndex, 1);
		scope.dispatchEvent({ type: 'dragend', object: object });
		console.log("AFTERSPLICE", touchIndex, currentTouches[touchIndex], activeBones)

	}

	this.on = function (type, listener) {

		console.warn('THREE.DragControls: on() has been deprecated. Use addEventListener() instead.');
		scope.addEventListener(type, listener);

	};

	this.off = function (type, listener) {

		console.warn('THREE.DragControls: off() has been deprecated. Use removeEventListener() instead.');
		scope.removeEventListener(type, listener);

	};

	this.notify = function (type) {

		console.error('THREE.DragControls: notify() has been deprecated. Use dispatchEvent() instead.');
		scope.dispatchEvent({ type: type });

	};

};

THREE.DragControls.prototype = Object.create(THREE.EventDispatcher.prototype);
THREE.DragControls.prototype.constructor = THREE.DragControls;
