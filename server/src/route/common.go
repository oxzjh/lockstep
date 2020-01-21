package route

import (
	"game"
	"golib/jsonbuf"
	"golib/server"
)

const PLAYER_COUNT = 2

var (
	rServer server.IServer
	gServer jsonbuf.IServer
	started bool
)

func init() {
	jsonbuf.Reg("connect", connect)
	jsonbuf.Reg("ping", ping)
}

func connect(socket server.ISocket, data map[string]interface{}) interface{} {
	if started {
		return nil
	}
	uid := uint(data["_uid"].(float64))
	rServer.SetSocketId(socket, uid)
	rServer.EnterRoom(socket, 1)
	if rServer.GetCount() == PLAYER_COUNT {
		started = true
		players := rServer.GetRoomUids(1, 0)
		gServer.Broadcast(map[string]interface{}{"_method": "start", "players": players})
		game.NewGame(players)
	}
	return map[string]interface{}{}
}

func ping(socket server.ISocket, data map[string]interface{}) interface{} {
	return map[string]interface{}{"ts": data["ts"]}
}

func Initialize(s server.IServer) {
	rServer = s
	gServer = jsonbuf.NewServer(s)
}
