package game

import (
	"golib/lockstep"
	"golib/server"
	"golib/server/ws"
	"time"
)

var (
	gPlayers []uint
	rServer  server.IServer
	gServer  lockstep.IServer
)

func NewGame(players []uint) {
	gPlayers = players
	rServer = ws.SafeServe(":3002", &handler{}, time.Second*300, 2)
	gServer = lockstep.NewServer(rServer, 255, time.Millisecond*20)
	// gServer = lockstep.NewServer(rServer, 255, time.Second)
}

func getPlayerIndex(uid uint) int {
	for i, v := range gPlayers {
		if v == uid {
			return i
		}
	}
	return -1
}
