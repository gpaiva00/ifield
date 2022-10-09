export const timeMask = (value: string) => {
  const time = value.replace(/\D/g, '')
  const timeLength = time.length

  if (timeLength > 4) {
    return `${time.slice(0, 2)}:${time.slice(2, 4)}`
  }

  if (timeLength > 2) {
    return `${time.slice(0, 2)}:${time.slice(2)}`
  }

  return time
}
