import { useEffect, useRef, useState } from 'react'
import { mockBroker } from '../services/mockBroker'
import { activitySimulator } from '../services/activitySimulator'
import Card from '../components/common/Card.jsx'
import Button from '../components/common/Button.jsx'
import LogStreamViewer from '../components/logs/LogStreamViewer.jsx'

const MAX_MESSAGES = 200

export default function LogStream() {
  const [messages, setMessages] = useState([])
  const [connectionState, setConnectionState] = useState(mockBroker.getConnectionState())
  const [isPaused, setIsPaused] = useState(false)
  const isPausedRef = useRef(isPaused)
  isPausedRef.current = isPaused

  useEffect(() => {
    mockBroker.connect()
    activitySimulator.start()

    const unsubscribe = mockBroker.subscribe((message) => {
      if (message.__system) {
        setConnectionState(message.connectionState)
        return
      }
      if (isPausedRef.current) return
      setMessages((prev) => [...prev, message].slice(-MAX_MESSAGES))
    })

    return () => {
      unsubscribe()
      activitySimulator.stop()
    }
  }, [])

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Log Stream</h1>
          <p className="mt-1 text-sm text-muted">
            Aliran pesan real-time dari message broker (simulasi RabbitMQ) untuk aktivitas absensi.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsPaused((p) => !p)}>
            {isPaused ? 'Lanjutkan' : 'Jeda'}
          </Button>
          <Button variant="outline" onClick={() => setMessages([])}>
            Bersihkan
          </Button>
        </div>
      </div>

      <Card className="!p-0 overflow-hidden">
        <LogStreamViewer messages={messages} connectionState={connectionState} isPaused={isPaused} />
      </Card>

      <p className="text-xs text-muted">
        Pesan disimulasikan secara berkala untuk keperluan demo, ditambah event nyata setiap ada absen masuk/pulang.
        Total pesan ditampilkan: <span className="font-mono">{messages.length}</span>
      </p>
    </div>
  )
}
