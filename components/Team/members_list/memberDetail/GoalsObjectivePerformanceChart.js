import { useRouter } from 'next/router';
import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const GoalsObjectivesPerformanceChart = ({role,id}) => {
    // Data for the three donut charts (example)
    const router = useRouter()
    const data = [
        {

            datasets: [
                {
                    label: 'Goal 1',
                    data: [70, 30], // Example data for Goal 1
                    backgroundColor: ['#FF6384', '#D3D3D3'], // Example colors for Goal 1
                    borderWidth: 1,
                },
            ],
        },
        {

            datasets: [
                {
                    label: 'Goal 2',
                    data: [50, 50], // Example data for Goal 2
                    backgroundColor: ['#36A2EB', '#D3D3D3'], // Example colors for Goal 2
                    borderWidth: 1,
                },
            ],
        },
        {

            datasets: [
                {
                    label: 'Goal 3',
                    data: [80, 20], // Example data for Goal 3
                    backgroundColor: ['#FFCE56', '#D3D3D3'], // Example colors for Goal 3
                    borderWidth: 1,
                },
            ],
        },
    ];

    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return context.dataset.data[context.dataIndex] + '%';
                    }
                }
            }
        }
    };
    return (
        <div className=" bg-grey rounded-lg p-2 border">
            <div className='flex justify-between'>
            <h2 className='ml-2 text-lg text-default_text'>
                Goals & Objectives
            </h2>
            <p  className='text-primary underline cursor-pointer  ' onClick={()=>{ role=='team_lead' ? router.push(`/${role}/team/${id}/performance`): router.push(`/workforce/people/${id}/performance`) }}>
                View All
            </p>
            </div>
         
            <div className='flex justify-around mt-3'>
                {data.map((item, index) => (
                    <div key={index} className="w-1/4 mx-2">

                        <Doughnut data={item} options={options} />
                        <p className="text-center mt-2">{item.datasets[0].data[0]}%</p>
                        <h3 className="text-center text-sm font-semibold">Goal {index + 1}</h3>
                    </div>

                ))}
                
            </div>
            <div className='my-2'>
                    Coming soon...
                </div>
            {/* <div>
                <h2 className='my-3 text-lg text-default_text'>
                    Performance Review
                </h2>
                <div className='my-6'>
                    Coming soon...
                </div>
            </div> */}
        </div>
    );
};

export default GoalsObjectivesPerformanceChart;
