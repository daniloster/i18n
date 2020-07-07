class Subject {
  constructor() {
    this.subscribers = []
  }

  next(value) {
    this.subscribers.forEach((subscriber) => {
      subscriber.next(value)
    })
  }

  subscribe(subscriber) {
    const self = this
    self.subscribers.push(subscriber)

    return {
      unsubscribe: () => {
        self.subscribers = self.subscribers.filter((s) => s !== subscriber)
      },
    }
  }
}

export default {
  /**
   * @param {T} initialValue
   * @returns {import('@daniloster/i18n/lib/types').ObservableState<T>}
   * @template T
   */
  create: (initialValue) => {
    let value = initialValue
    const subject = new Subject()

    return {
      get: () => value,
      set: (transformer) => {
        const newValue = transformer(value)
        if (value !== newValue) {
          value = newValue
          subject.next(value)
        }
      },
      subscribe: (subscriber) => subject.subscribe(subscriber),
    }
  },
}
