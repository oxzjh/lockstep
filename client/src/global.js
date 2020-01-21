cc.dispatch = function(event, data) {
	var eventCustom = new cc.EventCustom(event);
	eventCustom._userData = data;
	cc.eventManager.dispatchEvent(eventCustom);
};

cc.listen = function(event, callback, nodeOrPriority) {
	var listener = cc.EventListenerCustom.create(event, function(e) {
		callback(e._userData);
	});
	if (typeof nodeOrPriority == "number") {
		cc.eventManager.addEventListenerWithFixedPriority(listener, nodeOrPriority);
	} else {
		cc.eventManager.addEventListenerWithSceneGraphPriority(listener, nodeOrPriority);
	}
	return listener;
};

cc.addTouchListener = function(node, callback) {
	var listener = cc.EventListenerTouchOneByOne.create();
	listener.onTouchBegan = function(touch) {
		if (!node.visible || node.disabled) return false;
		var parent = node.parent;
		while (parent) {
			if (!parent.visible) return false;
			parent = parent.parent;
		}

		var p = node.convertTouchToNodeSpace(touch);
		if (p.x>0 && p.y>0 && p.x<node.width && p.y<node.height) {
			callback(node, 0, touch);
			return true;
		}
		return false;
	};
	listener.onTouchMoved = function(touch) {
		callback(node, 1, touch);
	};
	listener.onTouchEnded = function(touch) {
		callback(node, 2, touch);
	};
	cc.eventManager.addEventListenerWithSceneGraphPriority(listener, node);
	return listener;
};

cc.addClickListener = function(node, callback, scaleFactor) {
	scaleFactor = scaleFactor || 1.1;
	var defaultScale = node.getScale();
	var touchIn = false;
	var listener = cc.addTouchListener(node, function(node, status, touch) {
		if (status == 0) {
			node.setScale(defaultScale*scaleFactor);
			touchIn = true;
		}
		else if (status == 1) {
			var p = node.convertTouchToNodeSpace(touch);
			touchIn = p.x>0 && p.y>0 && p.x<node.width && p.y<node.height;
			node.setScale(touchIn ? defaultScale*scaleFactor: defaultScale);
		}
		else if (status == 2) {
			if (touchIn) {
				// cc.audio.playEffect("res/sound/effect_click.mp3");
				node.setScale(defaultScale);
				callback(node);
			}
		}
	});
	listener.setSwallowTouches(true);
	return listener
};

cc.showToast = function(info) {
	new ui.Toast(info)
};
