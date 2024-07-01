import { useState } from 'react'
import './App.css'
import Node from './Node'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Tree View</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <Node />
      </div>
      
    </>
  )
}

export default App
