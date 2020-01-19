package game

import (
	"golib/lockstep"
	"golib/server/ws"
	"time"
)

var gServer lockstep.IServer

func NewGame(players []uint) {
	s := ws.SafeServe(":3002", &handler{}, time.Second*300, 2)
	gServer = lockstep.NewServer(s, time.Millisecond*20)
}
