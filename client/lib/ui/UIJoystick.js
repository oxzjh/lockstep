var ui = ui || {};

ui.Joystick = cc.Node.extend({
	ctor:function(base, stick, radius, autoStop) {
		this._super();

		this._base = base;
		this._stick = stick;
		this._autoStop = autoStop;
		this._radius = radius || (base.width-stick.width)*0.5;
		this._radiusSquare = this._radius*this._radius;
		this._baseSquare = base.width*base.width*0.25;

		this._keycodeLeft = 65;
		this._keycodeRight = 68;
		this._keycodeUp = 87;
		this._keycodeDown = 83;

		this.addChild(base);
		this.addChild(stick);

		var self = this;

		var listener = cc.EventListenerTouchOneByOne.create();
		listener.onTouchBegan = function(touch) {

		};
		listener.onTouchMoved = function(touch) {

		};
		listener.onTouchEnded = function(touch) {

		};
		cc.eventManager.addEventListenerWithSceneGraphPriority(listener, self);
	},

	setKeyboardEnabled:function(value) {
		if (this._keyboardEnabled == value) return;
		this._keyboardEnabled = value;

		if (value) {
			var self = this;
			this._keyboardListener = cc.EventListenerKeyboard.create();
			this._keyboardListener.onKeyPressed = function(keycode) {
				if (keycode == self._keycodeLeft) {
					if (self._horizontal == -1) return;
					self._horizontal = -1;
				} else if (keycode == self._keycodeRight) {
					if (self._horizontal == 1) return;
					self._horizontal = 1;
				} else if (keycode == self._keycodeUp) {
					if (self._vertical == 1) return;
					self._vertical = 1;
				} else if (keycode == self._keycodeDown) {
					if (self._vertical == -1) return;
					self._vertical = -1;
				} else {
					return;
				}
				self._updateKeyboardEvent();
			};
			this._keyboardListener.onKeyReleased = function(keycode) {
				if (keycode == self._keycodeLeft) {
					if (self._horizontal == -1) {
						self._horizontal = 0;
						self._updateKeyboardEvent();
					}
				} else if (keycode == self._keycodeRight) {
					if (self._horizontal == 1) {
						self._horizontal = 0;
						self._updateKeyboardEvent();
					}
				} else if (keycode == self._keycodeUp) {
					if (self._vertical == 1) {
						self._vertical = 0;
						self._updateKeyboardEvent();
					}
				} else if (keycode == self._keycodeDown) {
					if (self._vertical == -1) {
						self._vertical = 0;
						self._updateKeyboardEvent();
					}
				}
			};
			cc.eventManager.addEventListenerWithSceneGraphPriority(this._keyboardListener, this);
		} else {
			cc.eventManager.removeEventListener(this._keyboardListener);
			this._keyboardListener = null;
		}
	},

	_updateKeyboardEvent:function() {
		if (this._handler) {
			if (this._horizontal == 1) {
				if (this._vertical == 1) {
					this._angle = 45;
				} else if (this._vertical == -1) {
					this._angle = 315;
				} else {
					this._angle = 0;
				}
			} else if (this._horizontal == -1) {
				if (this._vertical == 1) {
					this._angle = 135;
				} else if (this._vertical == -1) {
					this._angle = 225;
				} else {
					this._angle = 180;
				}
			} else {
				if (this._vertical == 1) {
					this._angle = 90;
				} else if (this._vertical == -1) {
					this._angle = 270;
				} else {
					this._angle = null;
				}
			}
			if (this._angle != null) {
				var rad = this._angle*Math.PI/180;
				this._stick.setPosition(this._radius*Math.cos(rad), this._radius*Math.sin(rad));
			} else {
				this._stick.setPosition(0, 0);
			}
			this._handler(this._angle);
		}
	},

	setKeycodes:function(left, right, up, down) {
		this._keycodeLeft = left;
		this._keycodeRight = right;
		this._keycodeUp = up;
		this._keycodeDown = down;
	},

	registerEventHandler:function(handler) {
		this._handler = handler;
	}
});