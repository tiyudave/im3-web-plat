export interface WebSocketClientOptions {
  url: string
  heartbeatInterval?: number
  reconnectInterval?: number
}

export class WebSocketClient {
  private url: string
  private heartbeatInterval: number
  private reconnectInterval: number
  private ws: WebSocket
  private heartbeatTimer: number | null = null
  private reconnectTimer: number | null = null
  private isClosing: boolean = false
  private routes: Map<string, Function>

  constructor(options: WebSocketClientOptions) {
    this.url = options.url
    this.heartbeatInterval = options.heartbeatInterval ?? 30000 // 默认为 30 秒
    this.reconnectInterval = options.reconnectInterval ?? 5000 // 默认为 5 秒
    this.connect()
    this.routes = new Map()
  }

  private connect(): void {
    this.ws = new WebSocket(this.url)
    this.ws.addEventListener('open', this.handleOpen)
    this.ws.addEventListener('message', this.handleMessage)
    this.ws.addEventListener('close', this.handleClose)
    this.ws.addEventListener('error', this.handleError)
  }

  private handleOpen = (): void => {
    console.log('WebSocket connect success')
    this.startHeartbeat()
    this.clearReconnectTimer()
  }

  private handleMessage = (event: MessageEvent): void => {
    if (typeof event.data === 'string') {
      console.error('数据类型有误')
      return
    }
    event.data.text().then((result) => {
      if (typeof result == 'string' && result == '\x01') {
        return
      }
      try {
        if (!result) {
          console.warn('WebSocket message is null')
          return
        }
        let result_obj = JSON.parse(result)
        // let { uri, message, data } = result_obj
        // 有可能没有这个字段
        if (result_obj.message && result_obj.message != '') {
          console.log('message error: ', result_obj.message)
          return
        }
        if (!result_obj.uri) {
          console.log('uri error: ', result_obj)
          return
        }
        if (this.routes.has(result_obj.uri)) {
          this.routes.get(result_obj.uri)(result_obj)
        } else {
          console.warn('缺少关于事件的处理函数: ', result_obj.uri)
        }
      } catch (error) {
        console.warn('WebSocket 消息解析失败', error)
      }
    })
  }

  private handleClose = (): void => {
    console.warn('WebSocket 连接断开')
    this.stopHeartbeat()
    this.scheduleReconnect()
  }

  private handleError = (): void => {
    console.error('WebSocket 连接错误')
  }

  private startHeartbeat(): void {
    this.stopHeartbeat()
    this.heartbeatTimer = window.setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN) {
        // const blob = new Blob(["Ping"], { type: "application/octet-stream" });
        const pingData = new Uint8Array([0x02])
        this.ws.send(pingData)
      }
    }, this.heartbeatInterval)
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer !== null) {
      window.clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  private scheduleReconnect(): void {
    if (!this.isClosing && this.reconnectTimer === null) {
      console.log(`WebSocket ${this.url} 断开，${this.reconnectInterval / 1000} 秒后重连...`)
      this.reconnectTimer = window.setTimeout(() => {
        this.connect()
        this.reconnectTimer = null
      }, this.reconnectInterval)
    }
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer !== null) {
      window.clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  public send(path: string, message: any, callback?: Function): void {
    let req = JSON.stringify({
      uri: path,
      data: JSON.stringify(message),
    })
    const blob = new Blob([req], { type: 'application/octet-stream' })
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(blob)
    }
    // 如果不需要回调
    if (!callback) {
      console.log('未设置的回调函数')
      return
    }
    this.routes.set(path, callback)
  }

  public on(path: string, callback: Function): void {
    this.routes.set(path, callback)
  }

  public close(): void {
    this.isClosing = true
    this.stopHeartbeat()
    this.clearReconnectTimer()
    this.ws.close()
  }
}

export module WsModule {
  export let Ws: WebSocketClient
}
