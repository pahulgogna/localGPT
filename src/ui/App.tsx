import './App.css'
import RightSide from './components/RightSide'

function App() {

  return (
    <div className='grid grid-cols-4 h-screen'>
      <div className='col-span-4 overflow-hidden'>
        <RightSide/>
      </div>
    </div>
  )
}

export default App
