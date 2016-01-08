import { h, render } from 'yolk'


// Yolk components inject a single object as an argument. The object has three
// keys: props, children, and createEventHandler.
// more info: https://github.com/garbles/yolk
function Counter ({props, children, createEventHandler}) {

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

  // merge both event streams together and keep a running count of the result
  const count$ = plusOne$
  	.merge(minusOne$)
	  .scan((x, y) => {
	  	let total = x + y
	  	if (total >= 0 && total <= 10) {
	  		return total
	  	} else {
	  		return x
	  	}
	  }, 0)
	  .startWith(0)

  // prop keys are always cast as observables
  const title$ = props.title.map(title => `Hello ${title}`)

  return (
    <div>
      <h1>{title$}</h1>
      <div>
        <button onClick={handleMinus}>-</button>
        <button onClick={handlePlus}>+</button>
      </div>
      <div>
        <p>Count: {count$}</p>
      </div>
      {children}
    </div>
  )
}

render(<Counter title="World" />, document.getElementById('container'))
