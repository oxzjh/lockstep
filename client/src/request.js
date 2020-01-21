// socket for gate
var request = {
	dispatchErrorMethods:{},

	init:function(url, openCallback) {
		this._ws = new WebSocket(url);
		this._ws.onopen = openCallback;
		this._ws.onmessage = function(e) {
			cc.log(e.data);
			var ret = JSON.parse(e.data);
			if (ret.code) {
				cc.log(ret.code);
			} else {
				cc.dispatch(ret._method, ret);
			}
		};
		this._ws.onerror = function(e) {
			cc.log("error:", e);
		};
		this._ws.onclose = function(e) {
			cc.log("close:", e);
		};
	},

	send:function(method, data, dispatchError) {
		this.dispatchErrorMethods[method] = dispatchError;
		data._method = method;
		this._ws.send(JSON.stringify(data));
	},

	close:function() {
		this._ws.close();
		this._ws = null;
	}
};