import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useFormik } from 'formik';
import FormSubmitted from '../../ui/formSubmitted';
import { useRouter } from 'next/router';

export default function PerformanceComponent({ role, id }) {
    const router = useRouter()
    const [formSubmitedd, setFormsubmitted] = useState(false)
    const sections = {
        'Better Me': [
            'Wellbeing - Is mindful and fully present; maintains personal wellbeing to sustain positive energy and fuel resilience',
            'Curiosity - Is a continuous learner, leads with questions, reflects and listens for the art of the possible to spark bold new insights',
            'Agility - Embraces change and through self-awareness, adapts behavior in diverse contexts'
        ],
        'Better Team': [
            'Collaboration - Works effectively with others to achieve common goals and share success',
            'Communication - Clearly conveys information and ideas to others; actively listens and responds appropriately',
            'Belonging - Supports the establishment of an inclusive, open and safe environment where people are aligned around a shared purpose, feel free to be themselves and are valued for their differing identities, perspectives and talents'
        ],
        'Better Company': [
            'Innovation - Encourages creativity and experimentation to drive continuous improvement',
            'Integrity - Acts with honesty and integrity; ensures actions are consistent with words'
        ]
    };

    const options = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'];

    const formik = useFormik({
        initialValues: {
            responses: {}
        },
        onSubmit: values => {
            setFormsubmitted(true)
        }
    });

    const handleOptionSelect = (section, questionIndex, option) => {
        formik.setFieldValue(`responses.${section}.${questionIndex}`, option);
    };

    return (
        <form onSubmit={formik.handleSubmit} className='mx-3'>
            {!formSubmitedd ?
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
                            <span> Performance Review</span>
                        </div>
                    </div>

                    <div>
                        <div>
                            {Object.keys(sections).map(section => (
                                <div key={section} className='my-5'>
                                    <h2 className='text-xl mb-3 px-4'>{section}</h2>
                                    <div className='border rounded-lg shadow-sm p-2 px-4'>
                                        <p>Demonstrates the following behaviors:</p>
                                        {sections[section].map((question, questionIndex) => (
                                            <div key={questionIndex} className='my-3 xl:grid grid-cols-5 gap-3'>
                                                <div className='bg-[#F6F6F6] col-span-3 rounded-lg p-2'>
                                                    <p className='text-sm font-semibold'>{question}</p>
                                                </div>
                                                <div className='bg-white col-span-2 mt-3 xl:mt-0 rounded-lg border'>
                                                    <div className='grid grid-cols-5 text-sm'>
                                                        {options.map(option => (
                                                            <button
                                                                key={option}
                                                                type='button'
                                                                className={`px-4 py-2 my-2 ${formik.values.responses?.[section]?.[questionIndex] === option ? 'bg-[#F1ECFF] rounded-full border border-primary' : ''}`}
                                                                onClick={() => handleOptionSelect(section, questionIndex, option)}>
                                                                {option}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className='flex justify-end my-3'>
                            <button type='submit' className='px-4 py-2 w-60 bg-primary text-white rounded-lg'>
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
                :
                <FormSubmitted setFormsubmitted={setFormsubmitted} />
            }
        </form>
    );
}
