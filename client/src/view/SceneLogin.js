var SceneLogin = cc.Scene.extend({
	ctor:function() {
		this._super();

		var txt_info = new cc.LabelTTF("连接中...", "", 24)
		txt_info.setPosition(cc.winCenter)
		this.addChild(txt_info)

		request.init("ws://192.168.8.88:3001", function() {
			request.send("connect", {_uid:plugin.getId()});
		});

		cc.listen("connect", function() {
			txt_info.string = "等待其他玩家加入";
		}, this)

		cc.listen("start", function() {
			cc.director.runScene(new SceneGame());
		}, this);
	}
})