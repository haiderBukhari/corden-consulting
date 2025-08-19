import React from 'react';

export default function MemberCardSkeleton() {
  return (
    <div className='p-4 mb-6 bg-white border rounded-3xl mx-2 animate-pulse'>
      <div className="flex justify-between items-center mb-8 mt-8">
        <div className="flex items-center">
          <div className="bg-slate-300 rounded-lg w-14 h-14 mr-4"></div>
          <div className="ml-4">
            <div className="bg-slate-300 h-4 w-32 mb-8 rounded"></div>
            <div className="bg-slate-300 h-4 w-24 rounded"></div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-8 mt-8">
        <div className="bg-slate-300 h-4 w-full rounded"></div>
        <div className="bg-slate-300 h-4 w-full rounded"></div>
      </div>
      <div className="mt-6 grid grid-cols-4 gap-4 mb-8 mt-8">
        <div className="bg-slate-300 h-6 w-full rounded"></div>
        <div className="bg-slate-300 h-6 w-full rounded"></div>
        <div className="bg-slate-300 h-6 w-full rounded"></div>
        <div className="bg-slate-300 h-6 w-full rounded"></div>
      </div>
      <div className="flex justify-between items-center mt-8 mb-10">
        <div className="bg-slate-300 h-4 w-1/2 rounded"></div>
        <div className="bg-slate-300 h-4 w-1/4 rounded"></div>
      </div>
    </div>
  )
}