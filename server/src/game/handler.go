package game

import "golib/server"

type handler struct {
}

func (this *handler) OnMessage(socket server.ISocket, message []byte) {

}

func (this *handler) OnClose(socket server.ISocket) {
}
