export async function fetchJson(
  input: RequestInfo,
  init?: RequestInit | undefined,
) {
  const response = await fetch(input, init)

  // if the server replies, there's always some data in json
  // if there's a network error, it will throw at the previous line
  const data = await response.json()

  if (response.ok) {
    return data
  }

  const error = new Error(response.statusText)
  error.stack = data
  throw error
}
