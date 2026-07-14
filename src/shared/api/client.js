/**
 * Simulasi lapisan network untuk "dummy backend".
 * Semua pemanggilan API di aplikasi ini melewati fungsi ini supaya
 * mudah diganti dengan REST/GraphQL client sungguhan di kemudian hari.
 */
export function mockRequest(handler, { delay = 500, failRate = 0 } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        if (failRate > 0 && Math.random() < failRate) {
          reject(new ApiError('Terjadi kesalahan pada server. Coba lagi.', 500))
          return
        }
        const result = handler()
        resolve(result)
      } catch (err) {
        reject(err)
      }
    }, delay)
  })
}

export class ApiError extends Error {
  constructor(message, status = 400) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}
