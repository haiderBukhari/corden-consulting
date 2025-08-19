import React from 'react'

import { CheckCircle, } from 'lucide-react';
import { useRouter } from 'next/router';
export default function TrainingAndDevelopmentComponent({ upcomingEvents, pastEvents, role, id ,height }) {
    const router = useRouter()
    const handleViewAllClick = () => {
        if (id) {
            role == 'team_lead' ? router.push(`/${role}/team/${id}/training`) : router.push(`/workforce/people/${id}/training`)

        } else {
            console.error("ID is not provided");
            // Optionally, you can show a message to the user or handle this case differently
        }
    };
    return (

        <div className=' bg-grey rounded-xl border p-3 overflow-y-auto relative' style={{ height: height }}>
            <h3 className='text-default_text text-base  text-center left-28 top-1/2 absolute'>Comming Soon...</h3>
           
            <div className='flex justify-between'>
                <h3 className='text-default_text text-lg'>Training & Development</h3>
                {/* <p className={`flex underline text-primary cursor-pointer`} onClick={handleViewAllClick}>
                    View All
                </p> */}
            </div>
            <div className='bg-[#EBEBFF] p-2 rounded-xl m-2 opacity-10 '>
                <h3 className='text-default_text text-base font-semibold '>Upcoming</h3>
                <div>
                    {/* Map through the upcoming events array and display each event */}
                    {upcomingEvents.map((event, index) => (
                        <div key={index} className="flex justify-between items-center bg-white rounded-full my-2 py-2 px-4">
                            <span className="text-base text-primary">{event.title}</span>
                            <span className="text-sm ">{event.time} | {event.date}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Past */}
            <div className='bg-white p-2 rounded-xl m-2  opacity-10 '>
                <h3 className='text-default_text text-base font-semibold'>Past</h3>
                <div className=''>

                    {pastEvents.map((event, index) => (
                        <div key={index} className='flex items-center'>
                            <div className="flex justify-between items-center w-full bg-grey border rounded-full my-2 py-2 px-4">
                                <span className="text-base text-primary">{event.title}</span>
                                <span className="text-sm ">{event.time} | {event.date}</span>
                            </div>

                            <CheckCircle className='text-primary h-4 w-4 ml-2' />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
