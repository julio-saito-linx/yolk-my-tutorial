import { h, render } from 'yolk'

// Yolk components inject a single object as an argument. The object has three
// keys: props, children, and createEventHandler.
// more info: https://github.com/garbles/yolk
function Counter ({props, children, createEventHandler}) {

  let mutable_state = {
    current: 0,
    min: 0,
    max: 10,
  }

  // createEventHandler
  // ------------------
  // Creates an exotic function that can also be used as an observable. If the
  // function is called, the input value is pushed to the observable as it's
  // latest value. In other words, when this function is used as an event
  // handler, the result is an observable stream of events from that handler.

  // map all plus button click events to 1
  const handlePlus = createEventHandler()
  const plusOne$ = handlePlus.map(() => 1)

  // map all minus button click events to -1
  const handleMinus = createEventHandler()
  const minusOne$ = handleMinus.map(() => -1)

  // keyDown events
  const keyDown = createEventHandler(ev => ev.which)
  // LOG: keyDown.map((x) => console.log(x)).subscribe()
  // KEY === "-"
  const keyDownMinus$ = keyDown
    .filter((x) => x === 109)
    .map(() => -1)

  // KEY === "+"
  const keyDownPlus$ = keyDown
    .filter((x) => x === 107)
    .map(() => +1)

  // const keyDownMinMinus$ = keyDown
  //   .filter((x) => x === 111)
  //   .map(() => -1)

  // const keyDownMinPlus$ = keyDown
  //   .filter((x) => x === 106)
  //   .map(() => +1)

  // const keyDownMaxMinus$ = keyDown
  //   .filter((x) => x === 104)
  //   .map(() => +1)

  // const keyDownMaxPlus$ = keyDown
  //   .filter((x) => x === 105)
  //   .map(() => +1)


  // merge both event streams together and keep a running count of the result
  const count$ = plusOne$
    .merge(minusOne$)
    .merge(keyDownMinus$)
    .merge(keyDownPlus$)
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
  const title$ = props.title.map(title => `Hello ${title}`)

  // min range slider
  const handleInputMinChange = createEventHandler(ev => ev.target.value)
  const handleInputMinMouseMove = createEventHandler(ev => ev.target.value)
  const min$ = handleInputMinChange
    .merge(handleInputMinMouseMove)
      .distinctUntilChanged()
    .map((x) => {
      mutable_state.min = x
      return x
    })
    .startWith(0)

  // max range slider
  const handleInputMaxChange = createEventHandler(ev => ev.target.value)
  const handleInputMaxMouseMove = createEventHandler(ev => ev.target.value)
  const max$ = handleInputMaxChange
    .merge(handleInputMaxMouseMove)
      .distinctUntilChanged()
    .map((x) => {
      mutable_state.max = x
      return x
    })
    .startWith(10)

  return (
    <div onKeyDown={keyDown}>
      <h1>{title$}</h1>
      <div>
        <button onClick={handleMinus}>-</button>
        <button onClick={handlePlus}>+</button>
      </div>
      <div>
        <p>Count: {count$}</p>
      </div>
      {children}
      <div>
        <span>min:</span>
        <input min='0' max='10' type='range' onMouseMove={handleInputMinMouseMove} onChange={handleInputMinChange} value={min$} />
        <span>{min$}</span>
        <br />
        <span>max:</span>
        <input min='0' max='10' type='range' onMouseMove={handleInputMaxMouseMove} onChange={handleInputMaxChange} value={max$} />
        <span>{max$}</span>
      </div>
    </div>
  )
}

render(<Counter title='World' />, document.getElementById('container'))
