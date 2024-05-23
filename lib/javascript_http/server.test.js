import { describe, it, expect } from 'vitest'
import http from 'http'
import { server } from './server'

describe('server', () => {
  it('creates a server with request and response handlers', () => {
    const createServerSpy = jest.spyOn(http, 'createServer')
    server()
    expect(createServerSpy).toHaveBeenCalled()
    createServerSpy.mockRestore()
  })

  it('listens on the correct hostname and port', () => {
    const listenSpy = jest.spyOn(http.Server.prototype, 'listen')
    server()
    expect(listenSpy).toHaveBeenCalledWith(3000, '127.0.0.1', expect.any(Function))
    listenSpy.mockRestore()
  })
})