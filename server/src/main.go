package main

import (
	"fmt"
	"golib/jsonbuf"
	"golib/server/ws"
	"golib/sys"
	"os"
	"route"
	"time"
)

func main() {
	route.Initialize(ws.SafeServe(":3001", jsonbuf.NewHandler(nil, nil, nil), time.Second*300, 1))

	sys.Hook(func(s os.Signal) {
		fmt.Println("<-----", s)
	})
}
