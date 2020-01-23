var ui = ui || {};

cc.log(sys);
ui.Input = cc.Node.extend({
	ctor:function(size, fontName, fontSize) {
		this._super();
		cc.log(this.getAnchorPoint())
	},

	setMaxLength:function() {

	},

	setInputFlag:function() {

	}
});