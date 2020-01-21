// socket for game
var socket = {
	init:function(url, openCallback) {
		this._ws = new WebSocket(url);
		this._ws.binaryType = "arraybuffer";
		this._ws.onopen = openCallback;
		this._ws.onmessage = function(e) {
			var reader = new buffer.Reader(e.data)
			var opcode = reader.readUint8()
			if (opcode == 255) {
				var frameIndex = reader.readInt32()
				if (frameIndex != FrameData.frames.length) {
					cc.log("ERROR: missing frame!!!", frameIndex-1);
				}
				var actionCount = reader.readUint8()
				if (actionCount>0) {
					for (var i=0; i<actionCount; i++) {
						var p = FrameData.players[reader.readUint8()]
						p.direction = reader.readUint8()
						p.attack = reader.readUint8()
						p.skill = reader.readUint8()
						if (p.direction != 8) {
							p.curDirection = p.direction;
						}
					}
				}
				FrameData.frames.push(frameIndex);
				cc.dispatch("socket_data", {frameIndex:frameIndex})
				return
			}
			if (opcode == 0) {
				var idx = reader.readUint8();
				if (idx == GameData.myIndex) {
					cc.dispatch("socket_connect", {})
				}
				return;
			}
		};
		this._ws.onerror = function(e) {
			cc.log("error:", e);
		};
		this._ws.onclose = function(e) {
			cc.log("close:", e);
		};
	},

	send:function(buf) {
		this._ws.send(buf);
	},
}