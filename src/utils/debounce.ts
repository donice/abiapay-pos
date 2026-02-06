function debounce(func: (...args: any[]) => void, delay = 500) {
  let timeoutId: NodeJS.Timeout

  return function(this: void, ...args: any[]) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}