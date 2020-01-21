var buffer = {
	/**
	 * @class
	 */
	Reader:function(buf) {
		this._dataView = new DataView(buf);
		this.position = 0;
	},

	/**
	 * @class
	 */
	Writer:function(size) {
		this._dataView = new DataView(new ArrayBuffer(size || 1024));
		this.length = 0;
	},

	toString:function(bytes) {
		var str = "";
		for (var i=0; i<bytes.length; i++) {
			var c = bytes[i];
			if (c < 0x80) {
				str += String.fromCharCode(c);
			}
			else if (c < 0xE0) {
				str += String.fromCharCode((c&0x3F)<<6 | bytes[++i]&0x3F);
			}
			else if (c < 0xF0) {
				str += String.fromCharCode((c&0x1F)<<12 | (bytes[++i]&0x3F)<<6 | bytes[++i]&0x3F);
			}
			else {
				str += String.fromCharCode((c&0xF)<<18 | (bytes[++i]&0x3F)<<12 | (bytes[++i]&0x3F)<<6 | bytes[++i]&0x3F)	
			}
		}
		return str;
	},

	toBytes:function(str) {
		var bytes = [];
		for (var i=0; i<str.length; i++) {
			var c = str.charCodeAt(i);
			if (c < 0x80) {
				bytes.push(c);
			}
			else if (c < 0x800) {
				bytes.push(0xC0|(c>>6), 0x80|(c&0x3F));
			}
			else if (c < 0xD800 || c>= 0xE000) {
				bytes.push(0xE0|(c>>12), 0x80|((c>>6)&0x3F), 0x80|(c&0x3F));
			}
			else {
				i++;
				c = 0x10000+(((c&0x3FF)<<10)|(str.charCodeAt(i)&0x3FF));
				bytes.push(0xF0|(c>>18), 0x80|((c>>12)&0x3F), 0x80|((c>>6)&0x3F), 0x80|(c&0x3F));
			}
		}
		return bytes;
	},

	bytesLength:function(str) {
		var length = 0;
		for (var i=0; i<str.length; i++) {
			var c = str.charCodeAt(i);
			if (c < 0x80) {
				length++;
			}
			else if (c < 0x800) {
				length += 2;
			}
			else if (c < 0xD800 || c>= 0xE000) {
				length += 3;
			}
			else {
				i++;
				length += 4;
			}
		}
		return length;
	}
};

buffer.Reader.prototype.readBool = function() {
	return this.readUint8() != 0;
};

buffer.Reader.prototype.readInt8 = function() {
	return this._dataView.getInt8(this.position++);
};

buffer.Reader.prototype.readUint8 = function() {
	return this._dataView.getUint8(this.position++);
};

buffer.Reader.prototype.readInt16 = function() {
	var ret = this._dataView.getInt16(this.position);
	this.position += 2;
	return ret;
};

buffer.Reader.prototype.readUint16 = function() {
	var ret = this._dataView.getUint16(this.position);
	this.position += 2;
	return ret;
};

buffer.Reader.prototype.readInt32 = function() {
	var ret = this._dataView.getInt32(this.position);
	this.position += 4;
	return ret;
};

buffer.Reader.prototype.readUint32 = function() {
	var ret = this._dataView.getUint32(this.position);
	this.position += 4;
	return ret;
};

buffer.Reader.prototype.readInt64 = function() {
	var ret = this._dataView.getBigInt64(this.position);
	this.position += 8;
	return ret;
};

buffer.Reader.prototype.readUint64 = function() {
	var ret = this._dataView.getBigUint64(this.position);
	this.position += 8;
	return ret;
};

buffer.Reader.prototype.readInt = function() {
	var uval = this.readUint();
	var val = uval>>>1;
	if (uval & 1) {
		val = ~val;
	}
	return val;
};

buffer.Reader.prototype.readUint = function() {
	var val = 0;
	var s = 0;
	while (true) {
		var b = this.readUint8();
		if (b < 0x80) {
			return val | b<<s;
		}
		val |= (b&0x7F)<<s;
		s+=7;
	}
};

buffer.Reader.prototype.readFloat32 = function() {
	var ret = this._dataView.getFloat32(this.position);
	this.position += 4;
	return ret;
};

buffer.Reader.prototype.readFloat64 = function() {
	var ret = this._dataView.getFloat64(this.position);
	this.position += 8;
	return ret;
};

buffer.Reader.prototype.readString = function() {
	return buffer.toString(this.readBytes(this.readUint()));
};

buffer.Reader.prototype.readBytes = function(size) {
	var ret = new Uint8Array(this._dataView.buffer.slice(this.position, this.position+size));
	this.position += size;
	return ret;
};


buffer.Writer.prototype.writeBool = function(val) {
	this.writeUint8(val ? 1 : 0);
};

buffer.Writer.prototype.writeInt8 = function(val) {
	this._dataView.setInt8(this.length++, val);
};

buffer.Writer.prototype.writeUint8 = function(val) {
	this._dataView.setUint8(this.length++, val);
};

buffer.Writer.prototype.writeInt16 = function(val) {
	this._dataView.setInt16(this.length, val);
	this.length += 2;
};

buffer.Writer.prototype.writeUint16 = function(val) {
	this._dataView.setUint16(this.length, val);
	this.length += 2;
};

buffer.Writer.prototype.writeInt32 = function(val) {
	this._dataView.setInt32(this.length, val);
	this.length += 4;
};

buffer.Writer.prototype.writeUint32 = function(val) {
	this._dataView.setUint32(this.length, val);
	this.length += 4;
};

buffer.Writer.prototype.writeInt64 = function(val) {
	this._dataView.setBigInt64(this.length, val);
	this.length += 8;
};

buffer.Writer.prototype.writeUint64 = function(val) {
	this._dataView.setBigUint64(this.length, val);
	this.length += 8;
};

buffer.Writer.prototype.writeInt = function(val) {
	var uval = (val<<1);
	if (val<0) {
		uval = ~uval;
	}
	this.writeUint(uval);
};

buffer.Writer.prototype.writeUint = function(val) {
	while (val >= 0x80) {
		this.writeUint8(val | 0x80);
		val >>>= 7;
	}
	this.writeUint8(val);
};

buffer.Writer.prototype.writeFloat32 = function(val) {
	this._dataView.setFloat32(this.length, val);
	this.length += 4;
};

buffer.Writer.prototype.writeFloat64 = function(val) {
	this._dataView.setFloat64(this.length, val);
	this.length += 8;
};

buffer.Writer.prototype.writeString = function(val) {
	var bytes = buffer.toBytes(val);
	this.writeUint(bytes.length);
	this.writeBytes(bytes);
};

buffer.Writer.prototype.writeBytes = function(bytes) {
	for (var i=0; i<bytes.length; i++) {
		this.writeUint8(bytes[i]);
	}
};

buffer.Writer.prototype.getBuffer = function() {
	return this._dataView.buffer.slice(0, this.length);
};