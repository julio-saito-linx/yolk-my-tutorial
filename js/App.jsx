import { h, render } from 'yolk'


// Yolk components inject a single object as an argument. The object has three
// keys: props, children, and createEventHandler.
// more info: https://github.com/garbles/yolk
function Counter ({props, children, createEventHandler}) {

  // FIXME: this is not the right way to do this, I feel that
  let min = 0
  let max = 10

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
	  	if (total >= min && total <= max) {
	  		return total
	  	} else {
	  		console.log('total was limited to', x)
	  		return x
	  	}
	  }, 0)
	  .startWith(0)

  // prop keys are always cast as observables
  const title$ = props.title.map(title => `Hello ${title}`)

  const handleInputMinChange = createEventHandler(ev => {
  	min = parseInt(ev.target.value)
  	return ev.target.value
  })
  const handleInputMaxChange = createEventHandler(ev => {
  	max = parseInt(ev.target.value)
  	return ev.target.value
  })

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
      <div>
      	<span>min:</span>
      	<input type='text' onChange={handleInputMinChange} value='0' />
      	<br />
      	<span>max:</span>
      	<input type='text' onChange={handleInputMaxChange} value='10' />
      </div>
    </div>
  )
}

render(<Counter title="World" />, document.getElementById('container'))
