package game

import (
	"golib/server"
)

const (
	OP_CONNECT = 0
	OP_READY   = 1
	OP_DATA    = 255
)

type handler struct {
	ready int
}

func (this *handler) OnMessage(socket server.ISocket, message []byte) {
	if message[0] == OP_DATA {
		message[0] = byte(socket.GetId())
		gServer.Push(message)
		return
	}
	if message[0] == OP_READY {
		this.ready++
		if this.ready >= len(gPlayers) {
			gServer.Start()
		}
		return
	}
	if message[0] == OP_CONNECT {
		uid := uint(message[1])<<24 | uint(message[2])<<16 | uint(message[3])<<8 | uint(message[4])
		idx := getPlayerIndex(uid)
		if idx >= 0 {
			socket.Write([]byte{OP_CONNECT, byte(idx)})
			rServer.SetSocketId(socket, uint(idx))
		}
		return
	}
}

func (this *handler) OnClose(socket server.ISocket) {
}
