import routes from 'src/router/routes.js'

describe('Router config - Unit', () => {
  it('sadrži početnu ("/") rutu s MainLayout komponentom', () => {
    const mainRoute = routes.find((r) => r.path === '/')
    expect(mainRoute).toBeTruthy()
    expect(mainRoute?.component).toBeInstanceOf(Function)
  })

  it('sadrži children rutu za LogIn s meta: guestOnly', () => {
    const loginRoute = routes.find((r) => r.path === '/')?.children?.find((c) => c.path === 'LogIn')
    expect(loginRoute).toBeTruthy()
    expect(loginRoute?.meta?.guestOnly).toBe(true)
  })

  it('ima catchAll rutu za 404', () => {
    const catchAll = routes.find((r) => r.path.includes(':catchAll'))
    expect(catchAll).toBeTruthy()
  })

  it('AdminPanel ruta ima requiresAdmin meta flag', () => {
    const admin = routes.find((r) => r.path === '/')?.children?.find((c) => c.path === 'AdminPanel')
    expect(admin?.meta?.requiresAdmin).toBe(true)
  })

  it('PredajNarudzbu ruta zahtijeva autentifikaciju', () => {
    const order = routes
      .find((r) => r.path === '/')
      ?.children?.find((c) => c.path === 'PredajNarudzbu')
    expect(order?.meta?.requiresAuth).toBe(true)
  })
})
