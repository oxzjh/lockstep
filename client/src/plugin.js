var plugin = {
	getId:function() {
		var id = sys.localStorage.getItem("id");
		if (!id) {
			id = Math.floor(Date.now()/100)%1000000;
			sys.localStorage.setItem("id", id);
		} else {
			id = Number(id);
		}
		return id;
	}
};