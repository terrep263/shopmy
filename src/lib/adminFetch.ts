export function getAdminToken(): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(/(?:^|;\s*)admin_token=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : null
}

export function getAdminFetchOpts(extra?: HeadersInit): RequestInit {
  const token = getAdminToken()
  return {
    credentials: "include",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(extra || {})
    }
  }
}

export function getAdminPostOpts(body: object): RequestInit {
  return {
    ...getAdminFetchOpts({ "Content-Type": "application/json" }),
    method: "POST",
    body: JSON.stringify(body)
  }
}
