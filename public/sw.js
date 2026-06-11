self.addEventListener('push', (event) => {
  let data = { title: 'Эко-навигатор', body: '', url: '/' }
  try {
    if (event.data) {
      const parsed = event.data.json()
      data = { ...data, ...parsed }
    }
  } catch {
    if (event.data) {
      data.body = event.data.text()
    }
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      data: { url: data.url || '/' },
      icon: '/favicon.ico',
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification?.data?.url || '/'
  event.waitUntil(self.clients.openWindow(url))
})
