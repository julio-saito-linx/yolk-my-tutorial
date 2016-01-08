import { h, render } from 'yolk'

function Counter ({props, children, createEventHandler}) {

  // map all plus button click events to 1
  const handlePlus = createEventHandler()
  const plusOne$ = handlePlus.map(() => 1)

  // map all minus button click events to -1
  const handleMinus = createEventHandler()
  const minusOne$ = handleMinus.map(() => -1)

  // merge both event streams together and keep a running count of the result
  const count$ = plusOne$.merge(minusOne$).scan((x, y) => x + y, 0).startWith(0)

  // prop keys are always cast as observables
  const title$ = props.title.map(title => `Awesome ${title}`)

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

render(<Counter title="Example" />, document.getElementById('container'))
