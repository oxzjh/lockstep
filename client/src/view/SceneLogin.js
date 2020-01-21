var SceneLogin = cc.Scene.extend({
	onEnter:function() {
		this._super();

		var txt_info = new cc.LabelTTF("连接中...", "", 24)
		txt_info.setPosition(cc.winCenter)
		this.addChild(txt_info)

		var params = {};
		if (window.location.search != "") {
			var kvs = window.location.search.substr(1).split("&");
			for (var i=0; i<kvs.length; i++) {
				var kv = kvs[i];
				var idx = kv.indexOf("=");
				if (idx != -1) {
					params[kv.substr(0, idx)] = kv.substr(idx+1);
				}
			}
		}
		var host = params.host || "192.168.8.88"

		cc.log(host)
		request.init("ws://"+host+":3001", function() {
			request.send("connect", {_uid:plugin.getId()});
		});

		cc.listen("connect", function() {
			txt_info.string = "等待其他玩家加入";
		}, this)

		cc.listen("start", function(result) {
			GameData.players = result.players;
			GameData.myIndex = result.players.indexOf(plugin.getId());
			socket.init("ws://"+host+":3001", function() {
				socket.send(PacketData.getConnectPack())
			})
		}, this);

		cc.listen("socket_connect", function() {
			cc.director.runScene(new SceneGame());
		}, this);
	}
})