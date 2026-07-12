import { MQ_QUEUE_NAME, MQ_EXCHANGE_NAME } from '../utils/constants'

/**
 * mockBroker mensimulasikan perilaku message broker (RabbitMQ-like)
 * sepenuhnya di sisi client: publish/subscribe in-memory dengan bentuk
 * pesan { id, queue, exchange, routingKey, type, payload, timestamp }.
 *
 * Di aplikasi nyata, modul ini akan diganti dengan klien AMQP
 * (mis. amqplib di backend, atau STOMP/WebSocket bridge di frontend)
 * yang terhubung ke server RabbitMQ sungguhan — namun kontrak
 * publish()/subscribe() di bawah ini didesain agar penggantian tersebut
 * tidak mengubah kode consumer (NotificationContext, LogStream, dst).
 */

const listeners = new Set()
let connectionState = 'disconnected' // disconnected | connecting | connected
let messageSeq = 0

function setConnectionState(next) {
  connectionState = next
  listeners.forEach((fn) => fn({ __system: true, connectionState: next }))
}

export const mockBroker = {
  connect() {
    if (connectionState === 'connected') return
    setConnectionState('connecting')
    // simulasikan handshake AMQP
    setTimeout(() => setConnectionState('connected'), 600)
  },

  disconnect() {
    setConnectionState('disconnected')
  },

  getConnectionState() {
    return connectionState
  },

  /** Publish pesan ke "queue" simulasi */
  publish(routingKey, type, payload) {
    messageSeq += 1
    const message = {
      id: `msg_${Date.now()}_${messageSeq}`,
      queue: MQ_QUEUE_NAME,
      exchange: MQ_EXCHANGE_NAME,
      routingKey,
      type,
      payload,
      timestamp: Date.now(),
    }
    // simulasikan latensi jaringan broker
    setTimeout(() => {
      listeners.forEach((fn) => fn(message))
    }, 150 + Math.random() * 250)
    return message
  },

  /** Subscribe sebagai consumer; mengembalikan fungsi unsubscribe */
  subscribe(callback) {
    listeners.add(callback)
    return () => listeners.delete(callback)
  },
}
