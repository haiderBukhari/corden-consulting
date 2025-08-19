import {  CheckCircleIcon } from '@heroicons/react/24/solid'
import { ArrowLeft } from 'lucide-react';
import React from 'react'

export default function FormSubmitted({setFormsubmitted}) {
    return (
        <div className='min-h-screen'>
              <div className='flex space-x-3 items-center p-3'>
                <button onClick={()=> setFormsubmitted(false)} type='button' className='flex space-x-2 items-center px-2 py-1 text-white bg-primary rounded-xl'>
                    <ArrowLeft className='text-white h-5 w-5' />
                    <span>Back</span>
                </button>
                <div>
                    <span className='font-semibold text-lg'>Devon James - </span>
                    <span> Performance Review</span>
                </div>
            </div>
        <div className=' bg-[#F6F6F6] border rounded-md p-2 h-[400px]  my-4 w-full flex items-center justify-center'>
            <div className='flex flex-col items-center'>
                <CheckCircleIcon className='text-green-500 h-24 w-24' />
                <h2 className='text-center font-semibold'>
                Submitted Successfully
                </h2>
            </div>
        </div>
        </div>
    )
}
