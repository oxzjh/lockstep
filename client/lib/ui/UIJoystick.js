var ui = ui || {};

ui.Joystick = cc.Node.extend({
	ctor:function(base, stick, radius, autoStop) {
		this._super();

		var self = this;

		var listener = cc.EventListenerTouchOneByOne.create()
		listener.onTouchBegan = function(touch) {

		};
		listener.onTouchMoved = function(touch) {

		};
		listener.onTouchEnded = function(touch) {

		};
		cc.eventManager.addEventListenerWithSceneGraphPriority(listener, self);
	}
});