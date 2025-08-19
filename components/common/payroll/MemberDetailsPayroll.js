
import React, { useState } from 'react'
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';
import DataLoader from '../../ui/dataLoader';
import { UseGetUserPayrollHistory } from '../../../hooks/query/payroll/getUserPayrollHistory';
import IndiviualPayrollTable from './IndiviualPayrollTable';
import { getPayrollMemberStats } from '../../../hooks/query/finances/payroll/getPayrollMemberDetailStats';
export default function MemberDetailsPayroll({ userId, currentManager }) {
  const router = useRouter();
  const { allManagersApproved } = router.query;

  const isAllManagersApproved = allManagersApproved === 'true';

  const { data: userData, isLoading: isLoadingUserData } = getPayrollMemberStats(userId);
  const { data: userPayrollHistory, isLoading: isLoadingUserPayrollHistory } = UseGetUserPayrollHistory(userId);

  const handleBackClick = () => {
    router.push({
      pathname: '/finances/workforce/payroll/overview',
      query: { view: 'request' }
    });
  };


  return (
    <div>
      {
        isLoadingUserData || isLoadingUserPayrollHistory ?
          <DataLoader />
          :
          (
            <div className='px-4 min-h-screen'>
              <button onClick={handleBackClick} type='button' className='flex space-x-2 items-center px-2 py-1 text-white bg-primary rounded-xl mb-3'>
                <ArrowLeft className='text-white h-5 w-5' />
                <span>Back</span>
              </button>
              <div className="grid grid-cols-5 gap-4 mb-5">
                <div className="border rounded-lg p-4 capitalize hover:border-primary hover:shadow hover:shadow-primary">
                  <p className="font-semibold">Full Name</p>
                  <p>{userData?.name}</p>
                </div>

                <div className="border rounded-lg p-4 capitalize hover:border-primary hover:shadow hover:shadow-primary">
                  <p className="font-semibold">Employee ID</p>
                  <p>{userData?.employee_id}</p>
                </div>

                <div className="border rounded-lg p-4 capitalize hover:border-primary hover:shadow hover:shadow-primary">
                  <p className="font-semibold">Joining Date</p>
                  <p>{userData?.joining_date}</p>
                </div>

                <div className="border rounded-lg p-4 capitalize hover:border-primary hover:shadow hover:shadow-primary">
                  <p className="font-semibold">Department</p>
                  <p>{userData?.department}</p>
                </div>
                <div className="border rounded-lg p-4 capitalize hover:border-primary hover:shadow hover:shadow-primary">
                  <p className="font-semibold">Location</p>
                  <p>{userData?.location?.name}</p>
                </div>
              </div>
              <IndiviualPayrollTable
                title={`${userData?.fname + " " + userData?.lname}'s Payroll History`}
                userData={userPayrollHistory}
                height="550px"
                id={userId}
                gratuity={userData?.gratuity_enabled === 1}
                isTableDisabled={false}
                detailPage={true}
                shouldHideEditColumn={isAllManagersApproved || currentManager?.manager_one !== "1"}
              />


            </div>
          )
      }
    </div>
  )
}
