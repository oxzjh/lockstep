var GameData = {
	players:[1,2],
	myIndex:0,

	getUid:function() {
		return this.players[this.myIndex];
	}
}