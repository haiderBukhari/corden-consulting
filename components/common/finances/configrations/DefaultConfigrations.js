import React, { useState } from 'react';
import LoanConfigrationForm from './LoanConfigration';
import RegionsConfigurations from './RegionsConfigurations';
import AdvanceSalaryConfigrationForm from './AdvanceSalaryConfigrations';
import PayrollConfigrationForm from './PayrollConfigrations';
import GratuityConfigrationForm from './GratuityConfigurations';

const DefaultConfigurations = ({ role }) => {
  const [activeTab, setActiveTab] = useState('payroll');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="p-3">
        {/* Tab navigation */}
        {
          role === "manager" &&
          <div className="grid grid-cols-5 gap-4 mb-4">
             <button
              className={`border-2 rounded-lg py-2 ${activeTab === 'regions' ? 'bg-primary text-white' : 'border-primary text-primary'}`}
              onClick={() => handleTabChange('regions')}
            >
              Regions Configuration
            </button>
            <button
              className={`border-2 rounded-lg py-2 ${activeTab === 'payroll' ? 'bg-primary text-white' : 'border-primary text-primary'}`}
              onClick={() => handleTabChange('payroll')}
            >
              Payroll Configuration
            </button>
           
            <button
              className={`border-2 rounded-lg py-2 ${activeTab === 'loan_requests' ? 'bg-primary text-white' : 'border-primary text-primary'}`}
              onClick={() => handleTabChange('loan_requests')}
            >
              Loan Configuration
            </button>
            <button
              className={`border-2 rounded-lg py-2 ${activeTab === 'advance_salary_requests' ? 'bg-primary text-white' : 'border-primary text-primary'}`}
              onClick={() => handleTabChange('advance_salary_requests')}
            >
              Advance Salary Configuration
            </button>
            <button
              className={`border-2 rounded-lg py-2 ${activeTab === 'gratuity' ? 'bg-primary text-white' : 'border-primary text-primary'}`}
              onClick={() => handleTabChange('gratuity')}
            >
             Gratuity Configuration
            </button>
          </div>
        }

        {/* Content based on active tab */}
        {activeTab === 'payroll' && <PayrollConfigrationForm role={role}/>}
        {activeTab === 'regions' && <RegionsConfigurations role={role}/>}
        {activeTab === 'advance_salary_requests' && <AdvanceSalaryConfigrationForm role={role}/>}
        {activeTab === 'loan_requests' && <LoanConfigrationForm role={role}/>}
        {activeTab === 'gratuity' && <GratuityConfigrationForm role={role}/>}
      </div>
    </>
  );
};

export default DefaultConfigurations;