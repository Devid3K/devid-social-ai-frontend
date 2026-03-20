export function getToken(): string | null {
  return JSON.parse(localStorage.getItem('token') || 'null')
}

export function getUser(): any {
  return JSON.parse(localStorage.getItem('user') || 'null')
}

export function clearAuth(): void {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}
