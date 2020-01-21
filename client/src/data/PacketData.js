var PacketData = {
	ACTION_DIRECTION:1,
	ACTION_ATTACK:2,

	prevDirection:8,
	direction:8,
	attack:0,
	skill:0,

	getPacket:function() {
		// if (FrameData.frames.length==0) return null;
		if (this.prevDirection==this.direction && this.attack==0 && this.skill==0) return null;
		var writer = new buffer.Writer(4);
		writer.writeUint8(255)
		writer.writeUint8(this.direction);
		writer.writeUint8(this.attack);
		writer.writeUint8(this.skill);
		this.prevDirection = this.direction;
		this.attack = 0;
		this.skill = 0;
		return writer.getBuffer()
	},

	getConnectPack:function() {
		var writer = new buffer.Writer(5)
		writer.writeUint8(0)
		writer.writeUint32(GameData.getUid())
		return writer.getBuffer()
	},

	getReadyPack:function() {
		var writer = new buffer.Writer(1)
		writer.writeUint8(1)
		return writer.getBuffer()
	}
}