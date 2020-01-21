var SceneGame = cc.Scene.extend({
	ctor:function() {
		this._super();

		var MOVE_SPEED = 3;
		var BLINK_SPEED = 200;
		var BLINK_CD = 2;
		var ATTACK_CD = 0.6;
		var BULLET_LIFE_FRAME = 60
		var MAX_HP = 5

		this.container = new cc.Node()
		this.addChild(this.container)

		var bondary = new cc.DrawNode()
		bondary.drawRect(cc.p(0,0), cc.p(1024,1024), null, 2, cc.color.WHITE)
		this.container.addChild(bondary)
		for (var i=1; i<8; i++) {
			bondary.drawSegment(cc.p(0, i*128), cc.p(1024, i*128), 2, cc.color(255,255,255,60))
			bondary.drawSegment(cc.p(i*128, 0), cc.p(i*128, 1024), 2, cc.color(255,255,255,60))
		}

		var player1 = new cc.Sprite("res/player1.png")
		player1.x = 100
		player1.y = 100
		player1.scale = 1.6;
		player1.hp = MAX_HP
		this.container.addChild(player1)
		var hpbar1 = new cc.ProgressTimer(new cc.Sprite("res/hp.png"))
		hpbar1.x = 40
		hpbar1.y = 40
		hpbar1.percentage = 100
		player1.addChild(hpbar1)
		player1.hpbar = hpbar1

		var player2 = new cc.Sprite("res/player2.png")
		player2.x = 928
		player2.y = 928
		player2.scale = 1.6;
		player2.hp = MAX_HP
		this.container.addChild(player2)
		var hpbar2 = new cc.ProgressTimer(new cc.Sprite("res/hp.png"))
		hpbar2.x = 40
		hpbar2.y = 40
		hpbar2.percentage = 100
		player2.addChild(hpbar2)
		player2.hpbar = hpbar2

		var players = [player1, player2];
		var myrole = players[GameData.myIndex];
		this.myrole = myrole;

		this.playerMoved = true;
		this.scheduleUpdate();

		var self = this

		var joystick = new ui.Joystick(new cc.Sprite("res/joystick_base.png"), new cc.Sprite("res/joystick_stick.png"), 40, true)
		joystick.x = 120
		joystick.y = 120
		self.addChild(joystick)
		joystick.setKeyboardEnabled(true)
		joystick.registerEventHandler(function(angle) {
			if (angle == null) {
				PacketData.direction = 8
			} else {
				PacketData.direction = angle/45;
			}
		});

		var txt_ping = new cc.LabelTTF("0ms", "", 16)
		txt_ping.anchorX = 1;
		txt_ping.anchorY = 1;
		txt_ping.x = cc.winSize.width-20;
		txt_ping.y = cc.winSize.height-20;
		this.addChild(txt_ping)

		cc.listen("ping", function(result) {
			var dt = Date.now()-result.ts;
			if (dt>=200) {
				txt_ping.color = cc.color.RED;
			} else if (dt>=100) {
				txt_ping.color = cc.color.YELLOW;
			} else {
				txt_ping.color = cc.color.GREEN;
			}
			txt_ping.string = "ping:"+dt+" ms";
		}, this);

		var blinkCDing = false;
		var attackCDing = false;
		var gameOver = false

		var btn_blink = new cc.Sprite("res/button_blink.png");
		btn_blink.x = cc.winSize.width - 250
		btn_blink.y = 60;
		this.addChild(btn_blink)
		var blinkMasker = new cc.Sprite("res/button_blink.png")
		blinkMasker.color = cc.color(80,80,80)
		var blinkProgress = new cc.ProgressTimer(blinkMasker)
		blinkProgress.setPosition(btn_blink.getPosition())
		this.addChild(blinkProgress)
		cc.addClickListener(btn_blink, function() {
			if (gameOver) return
			if (blinkCDing) {
				// cc.showToast("技能冷却中...")
			} else {
				PacketData.skill = 1
				blinkCDing = true
				blinkProgress.percentage = 100
				blinkProgress.runAction(cc.sequence(cc.progressTo(BLINK_CD, 0), cc.callFunc(function() {
					blinkCDing = false
				})))
			}
		});

		var btn_attack = new cc.Sprite("res/button_attack.png");
		btn_attack.x = cc.winSize.width-100
		btn_attack.y = 100
		btn_attack.scale = 2
		this.addChild(btn_attack)
		var attackMasker = new cc.Sprite("res/button_attack.png")
		attackMasker.color = cc.color(80,80,80);
		var attackProgress = new cc.ProgressTimer(attackMasker)
		attackProgress.scale = btn_attack.scale
		attackProgress.setPosition(btn_attack.getPosition())
		this.addChild(attackProgress)
		cc.addClickListener(btn_attack, function() {
			if (gameOver) return
			if (attackCDing) {
				// cc.showToast("攻击冷却中...")
			} else {
				PacketData.attack = 1
				attackCDing = true
				attackProgress.percentage = 100;
				attackProgress.runAction(cc.sequence(cc.progressTo(ATTACK_CD, 0), cc.callFunc(function() {
					attackCDing = false
				})))
			}
		});

		var bullets = []

		cc.listen("socket_data", function(result) {
			
			for (var i=0; i<FrameData.players.length; i++) {
				var p = FrameData.players[i];
				if (p.direction!=null && p.direction<8) {
					var player = players[i];
					player.rotation = -p.direction*45;
					var axis = FrameData.AXIS[p.direction]
					player.x += axis[0]*MOVE_SPEED;
					player.y += axis[1]*MOVE_SPEED;
					player.x = Math.max(0, Math.min(1024, player.x))
					player.y = Math.max(0, Math.min(1024, player.y))
					if (i == GameData.myIndex) {
						self.playerMoved = true
					}
				}
				if (p.attack>0) {
					var player = players[i];
					if (p.attack == 1) { // fire 4 bullet
						for (var j=0; j<4; j++) {
							var bullet = new Bullet(i, j)
							bullet.x = player.x
							bullet.y = player.y
							self.container.addChild(bullet)
							bullets.push(bullet)
						}
					} else {
						//TODO:
					}
					p.attack = 0;
				}
				if (p.skill>0) {
					var player = players[i];
					if (p.skill == 1) { // blink
						var axis = FrameData.AXIS[p.curDirection]
						player.x += axis[0]*BLINK_SPEED
						player.y += axis[1]*BLINK_SPEED
						player.x = Math.max(0, Math.min(1024, player.x))
						player.y = Math.max(0, Math.min(1024, player.y))
					} else {
						//TODO:
					}
					p.skill = 0;
				}
				
			}

			checkBullet()

			var packet = PacketData.getPacket()
			if (packet != null) {
				socket.send(packet)
			}
		}, this);


		function checkBullet() {
			for (var i=bullets.length-1; i>=0; i--) {
				var bullet = bullets[i]
				bullet.update()
				var collide = false
				for (var j=0; j<players.length; j++) {
					var player = players[j]
					if (bullet.playerId==j) {
						continue
					}
					var dx = player.x-bullet.x;
					var dy = player.y-bullet.y;
					if (dx*dx+dy*dy<1600) {
						playerHit(player)
						collide = true
					}
				}
				
				if (collide || bullet.frame>BULLET_LIFE_FRAME) {
					self.container.removeChild(bullet)
					bullets.splice(i, 1)
				}
			}
		}

		function playerHit(player) {
			player.hp--
			if (player.hp<=0 && player==myrole) {
				gameOver = true
			}
			player.hpbar.percentage = player.hp*100/MAX_HP
		}
	},

	onEnter:function() {
		this._super();

		socket.send(PacketData.getReadyPack())

		var self = this;
		this.schedule(function() {
			request.send("ping", {ts:Date.now()})
		}, 1);
	},

	update:function(dt) {
		var tx = cc.winCenter.x-this.myrole.x
		var ty = cc.winCenter.y-this.myrole.y
		var dx = tx - this.container.x
		var dy = ty - this.container.y
		// if (this.playerMoved) {
		// 	this.playerMoved = false;
			if (Math.abs(dx)>10 || Math.abs(dy)>10) {
				this.container.x += dx*0.2
				this.container.y += dy*0.2
			} else {
				this.container.x = tx;
				this.container.y = ty;
			}
		// }
	}
})