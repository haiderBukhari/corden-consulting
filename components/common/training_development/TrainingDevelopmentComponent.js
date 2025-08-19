import React from 'react';
import { ArrowLeft, Calendar, StarIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function TrainingDevelopmentDetailComponent({ role, id }) {
  const router = useRouter()
  const trainings = [
    {
      name: 'UNHCR Skill Program',
      subHeading: 'Recognition of Prior Learning Pvt. Ltd',
      date: '1 April - 5 April, 2024',
      listItems: [
        'Hi-Tech Skills Trainings',
        'Conventional Skills Training',
        'Accreditation of TVET Institutes',
        'National Employment Exchange Tool'
      ]
    },
    {
      name: 'Advanced IT Training',
      subHeading: 'Tech Education Center',
      date: '10 April - 15 April, 2024',
      listItems: [
        'Software Development',
        'Data Science Basics',
        'Cybersecurity Essentials',
        'Cloud Computing Introduction'
      ]
    },
    {
      name: 'Leadership Development Program',
      subHeading: 'Global Leadership Academy',
      date: '20 April - 25 April, 2024',
      listItems: [
        'Effective Communication Skills',
        'Team Management Strategies',
        'Conflict Resolution Techniques',
        'Strategic Planning and Execution'
      ]
    },
    {
      name: 'Marketing Skills Workshop',
      subHeading: 'Creative Marketing Solutions',
      date: '1 May - 5 May, 2024',
      listItems: [
        'Digital Marketing Fundamentals',

        'SEO Best Practices',
        'Social Media Marketing'
      ]
    },
    {
      name: 'Financial Literacy Program',
      subHeading: 'Money Management Institute',
      date: '10 May - 15 May, 2024',
      listItems: [
        'Budgeting and Saving',
        'Investment Basics',

        'Retirement Planning'
      ]
    },
    {
      name: 'Entrepreneurship Training',
      subHeading: 'Startup Incubator Hub',
      date: '20 May - 25 May, 2024',
      listItems: [
        'Business Idea Validation',
        'Fundraising Techniques',
        'Startup Growth Strategies',
        'Networking and Mentorship'
      ]
    }
  ];

  return (
    <div className='mx-3'>
      <div className='flex space-x-3 items-center p-3'>
        {id &&
          <button onClick={() => { router.push(role == 'team_lead' ? `/${role}/team/${id}/detail-page` : `/workforce/people/${id}/detail-page`) }} type='button' className='flex space-x-2 items-center px-2 py-1 text-white bg-primary rounded-xl '>
            <ArrowLeft className='text-white h-5 w-5' />
            <span>Back</span>
          </button>
        }

        <div>
          <span className='font-semibold text-lg'>Devon James</span>
          <span> April 2024 Q1 - Review #1</span>
        </div>
      </div>
      <div className='grid grid-cols-2 gap-4 '>
        {trainings.map((training, index) => (
          <div key={index} className='border rounded-xl p-4 bg-white shadow-sm'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 border rounded-sm w-9'>
                <Image
                  src='../../../assets/training_icon.svg'
                  alt='Training Icon'
                  className='h-32 w-32 object-contain rounded-full'
                  height={200}
                  width={400}
                />
              </div>
              <div>
                <h2 className='font-semibold text-lg'>{training.name}</h2>
                <p className='text-gray-600'>{training.subHeading}</p>

              </div>
            </div>
            <div className='flex items-center mt-2 text-sm text-default_text'>
              <Calendar className='w-9 h-5 mr-3' />
              <span className='font-semibold'>{training.date}</span>
            </div>
            <ul className='my-4 space-y-2'>
              {training.listItems.map((item, idx) => (
                <li key={idx} className='flex items-start'>
                  <Image
                    src='../../../assets/list.svg'
                    alt='List Icon'
                    className='w-9 h-5 mr-2'
                    height={200}
                    width={400}
                  />
                  <span className='text-gray-500'>{item}</span>
                </li>
              ))}
            </ul>
            <div className='flex space-x-2 items-center text-sm'>
              <StarIcon className='w-9 h-5 mr-2' /> <span> Cleared</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
