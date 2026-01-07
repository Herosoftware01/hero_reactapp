import React from 'react'
import { useNavigate } from 'react-router-dom'
import backgroundImage from '../assets/RollCHecking.jpg'; 

export default function EntryPage() {
  const navigate = useNavigate();

  return (
    <div 
      className='relative flex flex-col text-center h-screen justify-center items-center p-4' // Added p-4 here for edge padding
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className='absolute inset-0 bg-black opacity-60'></div>

      <div className='relative z-10 flex flex-col items-center gap-8 md:gap-12 w-full'> {/* Adjusted vertical gap */}
        
        {/* Responsive Title Scaling */}
        <span className="text-4xl xs:text-5xl md:text-6xl lg:text-7xl font-sans text-white font-bold max-w-4xl leading-tight">
          Roll Checking <br/> Ready To Allocate
        </span>
 
        {/* Responsive Button Group */}
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center w-full max-w-sm sm:max-w-none">
            
            {/* Machine 1 Button */}
            <button 
              className='bg-blue-600 text-white w-full sm:w-auto px-8 py-4 rounded font-semibold hover:bg-blue-700 transition duration-300 shadow-xl'
              onClick={()=>{navigate("/grey-app/machine/1")}}
            >
              <span className='text-lg md:text-2xl'>Machine 1</span>
            </button>
            
            {/* Machine 2 Button */}
            <button 
              className='bg-blue-600 text-white w-full sm:w-auto px-8 py-4 rounded font-semibold hover:bg-blue-700 transition duration-300 shadow-xl'
              onClick={()=>{navigate("/grey-app/machine/2")}}
            >
             <span className='text-lg md:text-2xl'>Machine 2</span>
            </button>
        </div>
      </div>
    </div>
  )
}