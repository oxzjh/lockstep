var ui = ui || {};

ui.Toast = cc.DrawNode.extend({
	ctor:function(info) {
		this._super();
		this.drawSolidRect(cc.p(-200, -20), cc.p(200, 20), cc.color(0, 0, 0, 128));
		this.addChild(new cc.LabelTTF(info, "", 24));
		this.setPosition(cc.winSize.centerX, cc.winSize.height-200);
		this.scaleY = 0;
		this.runAction(cc.sequence(cc.scaleTo(0.2, 1, 1), cc.delayTime(2), cc.scaleTo(0.2, 1, 0), cc.removeSelf()));
		cc.director.getRunningScene().addChild(this, 20);
	}
});