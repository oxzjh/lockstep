cc.game.run(function() {
	cc.DrawNode.prototype.drawSolidRect = function(origin, destination, color) {
		this.drawRect(origin, destination, color, 0);
	};
	cc.EventListenerTouchOneByOne = cc._EventListenerTouchOneByOne;
	cc.EventListenerKeyboard = cc._EventListenerKeyboard;
	cc.EventListenerCustom = cc._EventListenerCustom;
	cc.eventManager.addEventListenerWithSceneGraphPriority = cc.eventManager.addEventListenerWithFixedPriority = cc.eventManager.addListener;
	
	cc.view.enableRetina(sys.isIos);
	cc.view.setOrientation(2);

	cc.frameSize = cc.view.getFrameSize();
	cc.view.setDesignResolutionSize(1024, 576, cc.frameSize.height/cc.frameSize.width<0.5625?2:4);
	cc.winSize = cc.director.getWinSize();
	cc.winCenter = {x:cc.winSize.width*0.5, y:cc.winSize.height*0.5}
	cc.director.setClearColor(cc.color(6, 13, 38));

	cc.director.runScene(new SceneLogin())
});