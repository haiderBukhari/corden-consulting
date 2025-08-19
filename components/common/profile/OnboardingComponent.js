import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { ArrowLeft, Check } from 'lucide-react';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';

export default function OnboardingComponent({ role, id }) {
    const router = useRouter()
    const sections = {
        'Phase 1': [
            'Wellbeing - Is mindful and fully present; maintains personal wellbeing to sustain positive energy and fuel resilience',
            'Curiosity - Is a continuous learner, leads with questions, reflects and listens for the art of the possible to spark bold new insights',
            'Agility - Embraces change and through self-awareness, adapts behavior in diverse contexts'
        ],
        'Phase 2': [
            'Collaboration - Works effectively with others to achieve common goals and share success',
            'Communication - Clearly conveys information and ideas to others; actively listens and responds appropriately',
            'Belonging - Supports the establishment of an inclusive, open and safe environment where people are aligned around a shared purpose, feel free to be themselves and are valued for their differing identities, perspectives and talents'
        ],
        'Phase 3': [
            'Innovation - Encourages creativity and experimentation to drive continuous improvement',
            'Integrity - Acts with honesty and integrity; ensures actions are consistent with words'
        ]
    };

    const formik = useFormik({
        initialValues: {
            responses: {}
        },
        onSubmit: values => {
            console.log('Form data', values.responses);
        }
    });

    const handleToggle = (section, questionIndex) => {
        const currentStatus = formik.values.responses[section]?.[questionIndex] || 'Incomplete';
        const newStatus = currentStatus === 'Incomplete' ? 'Complete' : 'Incomplete';
        formik.setFieldValue(`responses.${section}.${questionIndex}`, newStatus);

        // Here you can make an API call to update the status
    };

    return (
        <form onSubmit={formik.handleSubmit} className='mx-3'>
            <div>
                <div className='flex space-x-3 items-center p-3'>
                    {id &&
                        <button onClick={() => { router.push(role=='team_lead' ? `/${role}/team/${id}/detail-page` : `/workforce/people/${id}/detail-page`) }} type='button' className='flex space-x-2 items-center px-2 py-1 text-white bg-primary rounded-xl'>
                            <ArrowLeft className='text-white h-5 w-5' />
                            <span>Back</span>
                        </button>
                    }

                    <div>
                        <span className='font-semibold text-lg'>Devon James - </span>
                        <span> Onboarding Checklist</span>
                    </div>
                </div>

                <div>
                    {Object.keys(sections).map(section => (
                        <div key={section} className='my-5'>
                            <h2 className='text-xl mb-3 px-4'>{section}</h2>
                            <div className='border rounded-lg shadow-sm p-2 px-4'>
                                <p>Basic</p>
                                {sections[section].map((question, questionIndex) => (
                                    <div key={questionIndex} className='my-3 xl:grid grid-cols-5 gap-3'>
                                        <div className={`bg-[#F6F6F6] col-span-4 rounded-lg p-2  ${formik.values.responses[section]?.[questionIndex] === 'Complete' ? 'border border-primary' : ''}`}>
                                            <p className='text-sm font-semibold'>{question}</p>
                                        </div>
                                        <div className={`bg-white col-span-1 flex justify-center mt-3 xl:mt-0 rounded-2xl  border
                                        ${formik.values.responses[section]?.[questionIndex] === 'Complete' ? 'text-primary border-primary' : 'text-darkred '}`}>

                                            <button
                                                type='button'
                                                className={`bg-white flex items-center  py-2 px-4 my-2
                                                    }`}
                                                onClick={() => handleToggle(section, questionIndex)}>
                                                {formik.values.responses[section]?.[questionIndex] === 'Complete' ? (
                                                    <>
                                                        <p>Complete</p>
                                                        <Check className='h-5 w-5 ml-2 bg-primary text-white rounded-full p-1' />
                                                    </>
                                                ) : (
                                                    <>
                                                        <p>Incomplete</p>

                                                    </>
                                                )}
                                            </button>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </form>
    );
}
