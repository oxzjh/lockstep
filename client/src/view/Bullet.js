var Bullet = cc.Sprite.extend({
	/**
	 * @param {int} direction 0-3: 0°,90°,180°,270°
	 */
	ctor:function(playerId, direction) {
		this._super("res/bullet.png");
		this.playerId = playerId
		this.rotation = direction*90;
		if (direction == 0) {
			this.horizontalAxis = 1
			this.verticalAxis = 0
		} else if (direction == 1) {
			this.horizontalAxis = 0
			this.verticalAxis = -1
		} else if (direction == 2) {
			this.horizontalAxis = -1
			this.verticalAxis = 0
		} else {
			this.horizontalAxis = 0
			this.verticalAxis = 1
		}
		this.frame = 0
		this.color = playerId==GameData.myIndex?cc.color.GREEN:cc.color.RED
	},

	update:function() {
		var speed = 8
		this.x += this.horizontalAxis*speed
		this.y += this.verticalAxis*speed
		this.frame++;
	}
})