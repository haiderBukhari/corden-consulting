import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useGetIndividualPayroll } from '../../../../hooks/query/payroll/getIndiviualPayroll';

const PayrollGraph = ({ id }) => {
    const [showSalary, setShowSalary] = useState(false);

    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();

    const { data: payrollData } = useGetIndividualPayroll(id);

    const toggleSalaryVisibility = () => {
        setShowSalary(!showSalary);
    };

    const getTitle = (data) => {
        const monthMap = {
            January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
            July: 7, August: 8, September: 9, October: 10, November: 11, December: 12
        };

        const payrollMonthName = data.month;  // e.g., "September"
        const payrollYear = parseInt(data.year);

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // getMonth is 0-based, so add 1
        const currentYear = currentDate.getFullYear();

        const payrollMonth = monthMap[payrollMonthName];  // Get numeric month from name
        const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
        const previousMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

        if (payrollMonth === currentMonth && payrollYear === currentYear) {
            return "Current Payout";
        } else if (payrollMonth === previousMonth && payrollYear === previousMonthYear) {
            return "Last Payout";
        } else {
            return `${payrollMonthName} Payout`;
        }
    };

    const renderSalaryDetail = (value) => showSalary ? `$${value}` : '****';  // Helper function to toggle display



    return (
        <div>
            <div className="bg-grey rounded-lg py-2 px-3 border shadow-md mb-4">
                <div className='flex justify-between'>
                    <div className='flex space-x-5 items-center'>
                        <span className="text-lg text-default_text">Payroll</span>
                        <div className=''>
                            <button onClick={toggleSalaryVisibility} className='focus:outline-none text-primary mt-2'>
                                {!showSalary ? <FaEyeSlash className='h-5 w-5' /> : <FaEye className='h-5 w-5' />}
                            </button>
                        </div>
                    </div>
                    <p className="flex text-primary cursor-pointer">
                        {currentMonth} {currentYear}
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-3 p-2">
                    {payrollData && (
                        <div
                            className={`space-y-3 text-sm ${getTitle(payrollData) === "Current Payout" ? "bg-white" : "bg-gray-100"
                                } p-2 rounded-lg`}
                        >
                            <div className="text-start flex">
                                <div className="bg-primary w-2 h-12 rounded-lg mr-2"></div>
                                <div>
                                    <h6>{getTitle(payrollData)}</h6>
                                    <p>
                                        <span className="mr-2 text-2xl">$</span>
                                        {renderSalaryDetail(payrollData.net_payout)}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <h6>Deductions</h6>
                                <p className="text-red-600">{renderSalaryDetail(payrollData.deduction)}</p>
                            </div>
                            <div>
                                <h6>Bonus</h6>
                                <p className="text-green-600">{renderSalaryDetail(payrollData.bonus)}</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default PayrollGraph;
