export const connectSocket = function (host)  {
    window.webSocket = new WebSocket(host);
    /*建立连接*/
    webSocket.onopen = evt => {
        let params = {
            actionType: 'Heartbeat'
        }
        webSocket.send(JSON.stringify(params))
    };
    /*连接关闭*/
    webSocket.onclose = evt => {
      console.log("webSocket连接关闭");
    };
    /*接收服务器推送消息*/
    webSocket.onmessage = evt => {
    //   let data = JSON.parse(evt.data);
      console.log('ws.js')
    };
    /*连接发生错误时*/
    webSocket.onerror = (evt,e) => {
    //   console.log(evt);
    }
  }

