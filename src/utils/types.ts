export interface Request {
  uri: string
  data: any
}

export interface ResponseResult {
  uri: string
  code: number
  message: string
}

export interface ResponsePager {
  uri: string
  message: string
  data: {
    rows: any[]
    total: number
  }
}

export interface ResponseMessage {
  uri: string
  message: string
  data: {
    rows: any[]
    total: number
  }
}
