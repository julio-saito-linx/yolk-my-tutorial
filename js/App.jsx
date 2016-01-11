import { h, render } from 'yolk'

// Yolk components inject a single object as an argument. The object has three
// keys: props, children, and createEventHandler.
// more info: https://github.com/garbles/yolk
function Counter ({props, children, createEventHandler}) {
  let mutable_state = {
    current: 0,
    min: 0,
    max: 5,
  }

  // createEventHandler
  // ------------------
  // Creates an exotic function that can also be used as an observable. If the
  // function is called, the input value is pushed to the observable as it's
  // latest value. In other words, when this function is used as an event
  // handler, the result is an observable stream of events from that handler.

  // map all plus button click events to 1
  const handlePlus = createEventHandler()
  const plusOne = handlePlus.map(() => 1)

  // map all minus button click events to -1
  const handleMinus = createEventHandler()
  const minusOne = handleMinus.map(() => -1)

  // keyDown events
  const keyDown = createEventHandler(ev => ev.which)
  // keyDown.map((x) => console.log(x)).subscribe()
  // KEY === "-"
  const keyDownMinus = keyDown
    .filter((x) => x === 59)
    .map(() => -1)

  // KEY === "+"
  const keyDownPlus = keyDown
    .filter((x) => x === 57)
    .map(() => +1)

  // 81
  // 87
  // 65
  // 83

  // const keyDownMaxMinus = keyDown
  //   .filter((x) => x === 54)
  //   .map(() => +1)

  // const keyDownMaxPlus = keyDown
  //   .filter((x) => x === 55)
  //   .map(() => +1)

  // merge both event streams together and keep a running count of the result
  const count = plusOne
    .merge(minusOne)
    .merge(keyDownMinus)
    .merge(keyDownPlus)
    .map((x) => {
      return x
    })
    .scan((x, y) => {
      let sum = x + y
      if (sum >= mutable_state.min && sum <= mutable_state.max) {
        mutable_state.current = sum
      } else {
        mutable_state.current = x
      }

      return mutable_state.current
    }, 0)
    .startWith(0)

  // prop keys are always cast as observables
  const title = props.title.map(title => `Hello {title}`)

  // min
  const keyDownMinMinus = keyDown
    .filter((x) => x === 81)
    .map(() => {
      mutable_state.min -= 1
      return mutable_state.min
    })

  const keyDownMinPlus = keyDown
    .filter((x) => x === 87)
    .map(() => {
      mutable_state.min += 1
      return mutable_state.min
    })

  const min = keyDownMinMinus
    .merge(keyDownMinPlus)
    .startWith(0)

  // max range slider
  const handleInputMaxChange = createEventHandler(ev => ev.target.value)
  const handleInputMaxMouseMove = createEventHandler(ev => ev.target.value)
  const max = handleInputMaxChange
    .merge(handleInputMaxMouseMove)
      .distinctUntilChanged()
    .map((x) => {
      if (x >= mutable_state.current) {
        mutable_state.max = x
      } else {
        mutable_state.max = mutable_state.current
      }
      return mutable_state.max
    })
    .startWith(5)

  return (
    <div onKeyDown={keyDown}>
      <h1>{title}</h1>
      <div>
        <button onClick={handleMinus}>-</button>
        <button onClick={handlePlus}>+</button>
      </div>
      <div>
        <p>Count: {count}</p>
      </div>
      {children}
      <div>
        <span>min:</span>
        <span>{min}</span>
        <br />
        <span>max:</span>
        <span>{max}</span>
      </div>
    </div>
  )
}

render(<Counter title='World' />, document.getElementById('container'))
