import Immutable from 'immutable'

export function State () {
  const initial = {
    current: 0,
    min: 0,
    max: 10,
  }

  this.updates = new Rx.BehaviorSubject(Immutable.fromJS(initial))
  this.asObservable = this.updates.scan((state, operation) => operation(0)).shareReplay(1)
}
