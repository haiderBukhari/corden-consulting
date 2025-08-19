import React, { useState, useEffect } from 'react';
import { FaCaretRight, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { DownloadIcon } from 'lucide-react';
import { UseGetUserPayrollHistory } from '../../../hooks/query/payroll/getUserPayrollHistory';
import DataLoader from '../../ui/dataLoader';
import Image from 'next/image';
import { useGetIndividualPayslip } from '../../../hooks/query/payroll/getIndividualPayslip';
import { convertMonthToNumber } from '../../../utils/functions';
import { UseGetProfile } from '../../../hooks/query/getProfile';
import IndiviualPayrollTable from './IndiviualPayrollTable';
import { getGratuityDetails } from '../../../hooks/query/finances/gratuity/getGratuityDetail';

export default function PersonalPayrollComponent({ userId }) {

  const [showPayout, setShowPayout] = useState(false);
  const [showSalary, setShowSalary] = useState(false)
  const [showGruity, setShowGruity] = useState(false)
  const [payslipParams, setPayslipParams] = useState(null);
  const { data: profile, isLoading: isProfileLoading } = UseGetProfile(userId)

  const router = useRouter();
  const { data: individualPayslipData, isLoading: isLoadingIndividualPayslipData } = useGetIndividualPayslip(payslipParams);
  const { data: userPayrollHistory, isLoading: isLoadingUserPayrollHistory } = UseGetUserPayrollHistory(userId);
  const payrolls = userPayrollHistory?.payroll_history || [];

  // First, sort the payrolls in descending order by date (assuming year and month are provided)
  const sortedPayrolls = payrolls.length > 0
    ? [...payrolls].sort((a, b) => {
      // Convert month and year to a date object for comparison.
      // Note: Ensure that month is in a proper numeric format (e.g., "02" for February) if necessary.
      const dateA = new Date(`${a.year}-${a.month}-01`);
      const dateB = new Date(`${b.year}-${b.month}-01`);
      return dateB - dateA;
    })
    : [];

  // Determine lastPayout: If the latest payroll is approved, use it;
  // otherwise, search the sorted payrolls for the first approved entry.
  let lastPayout = null;
  if (sortedPayrolls.length > 0) {
    if (sortedPayrolls[0].payroll.status === "approved") {
      lastPayout = sortedPayrolls[0].payroll;
    } else {
      // Find the first payroll in the sorted list that is approved.
      const approvedPayroll = sortedPayrolls.find(item => item.payroll.status === "approved");
      lastPayout = approvedPayroll ? approvedPayroll.payroll : null;
    }
  }


  const displayText =
    payrolls.length === 1 && sortedPayrolls[0].payroll.status === "pending"
      ? "Pending"
      : lastPayout
        ? `$${lastPayout.net_payout}`
        : "No Last Payout";


  const handleSavePayslip = (month, year) => {
    setPayslipParams({ id: userId, month: convertMonthToNumber(month), year });
  };

  useEffect(() => {
    if (individualPayslipData) {
      const url = window.URL.createObjectURL(individualPayslipData);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Payslip_${payslipParams.month}_${payslipParams.year}.pdf`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url); // Clean up the URL after download
      document.body.removeChild(link); // Remove the link element after download

      // Clean up the params
      setPayslipParams(null);
    }
  }, [individualPayslipData]);

  return (
    <div>
      {
        isLoadingIndividualPayslipData || isLoadingUserPayrollHistory || isProfileLoading ?
          <DataLoader />
          :
          <div className='px-4 min-h-screen'>
            <div className={`gap-4 mb-4 grid ${profile?.gratuity_enabled === 1 ? 'grid-cols-10' : 'grid-cols-7'}`}>

              {/* Last Payout Card */}
              <div className="border rounded-xl px-4 py-3 col-span-3 hover:shadow-md hover:border-primary">
                <div className='flex items-center'>
                  <Image
                    src='/assets/payout.svg'
                    alt="Payout Icon"
                    className='h-12 w-12 mr-3'
                    height={200}
                    width={400}
                  />
                  <h3 className="text-lg mr-4">Last Payout</h3>
                  <button onClick={() => setShowPayout(!showPayout)}>
                    {showPayout ? <FaEye className="text-primary h-5 w-5 mt-1" /> : <FaEyeSlash className="text-primary h-5 w-5 mt-1" />}
                  </button>
                </div>
                <div className='flex justify-between items-center mt-5'>
                  <div className="flex items-center gap-2 mt-2">
                    {showPayout ? (
                      <span className="text-2xl text-primary">{displayText}</span>
                    ) : (
                      <span className="text-4xl text-primary">****</span>
                    )}
                  </div>
                  <button
                    className={`py-2 px-4 bg-[#F1ECFF] flex items-center text-primary rounded-lg 
      ${lastPayout ? "cursor-pointer" : "cursor-not-allowed opacity-40"}`}
                    onClick={() => lastPayout && handleSavePayslip(lastPayout.month, lastPayout.year)}
                    disabled={!lastPayout}
                  >
                    <DownloadIcon className='h-4 w-4 mr-1' />
                    Save
                  </button>
                </div>

              </div>
              {profile?.gratuity_enabled == 1 &&
                <div className="border rounded-xl px-4 py-3 col-span-3 hover:shadow-md hover:border-primary">
                  <div className='flex items-center'>

                    <h3 className="text-lg mr-4">Grutuity</h3>
                    <button onClick={() => setShowGruity(!showGruity)}>
                      {showGruity ? <FaEye className="text-primary h-5 w-5 mt-1" /> : <FaEyeSlash className="text-primary h-5 w-5 mt-1" />}
                    </button>
                  </div>
                  <div className='flex justify-between items-center mt-9'>
                    <div className="flex items-center gap-2 mt-2">
                      {showGruity ? (
                        <span className="text-2xl text-primary">${profile ? profile?.gratuity_fund : 'N/A'}</span>
                      ) : (
                        <span className="text-4xl text-primary">****</span>
                      )}
                    </div>
                    <button
                      className={`py-2 px-4 bg-primary shadow-md flex items-center text-white rounded-lg cursor-pointer`}
                      onClick={() => router.push(`/finances/payroll/${userId}`)}
                      disabled={!lastPayout}
                    >

                      View History
                    </button>
                  </div>

                </div>
              }

              {/* Request Advance Salary Card */}
              <div className="border rounded-xl px-4 py-2  col-span-2 hover:shadow-md hover:border-primary">

                <div className='flex  space-x-2'>
                  <h3 className="text-lg mr-4">Basic Salary </h3>
                  <button onClick={() => setShowSalary(!showSalary)}>
                    {showSalary ? <FaEye className="text-primary h-5 w-5 mt-1" /> : <FaEyeSlash className="text-primary h-5 w-5 mt-1" />}
                  </button>
                </div>

                <div className='flex justify-between items-center mt-9'>
                  <div className="flex items-center gap-2 mt-2">
                    {showSalary ? (
                      <span className="text-2xl text-primary">${profile ? profile?.current_salary : 'N/A'}</span>
                    ) : (
                      <span className="text-4xl mt-3 text-primary">****</span>
                    )}
                  </div>
                </div>
              </div>


              {/* Pending Payroll Card */}
              <div className="border rounded-xl px-4 py-2 col-span-2 shadow-md border-primary">
                <h3 className="text-lg">Upcoming Payroll</h3>
                <div className="mt-12 flex justify-between items-center">
                  {userPayrollHistory?.payroll_history?.length > 0 ? (
                    (() => {
                      const sortedPayrolls = [...userPayrollHistory.payroll_history].sort(
                        (a, b) =>
                          new Date(`${b.payroll.year}-${b.payroll.month}-01`) -
                          new Date(`${a.payroll.year}-${a.payroll.month}-01`)
                      );
                      const latestPayroll = sortedPayrolls[0]?.payroll;

                      return (
                        <>
                          <span className="text-2xl text-gray-400 capitalize">
                            {latestPayroll?.status || "Pending"}
                          </span>
                          <p className="text-xs mt-2 text-gray-500">
                            {latestPayroll?.month || "N/A"} {latestPayroll?.year || ""}
                          </p>
                        </>
                      );
                    })()
                  ) : (
                    <span className="text-2xl text-gray-400 capitalize">Not Initiated</span>
                  )}
                </div>
              </div>


            </div>
            <IndiviualPayrollTable
              title={`${profile?.fname + " " + profile?.lname}'s Payroll History`}
              userData={userPayrollHistory}
              height="550px"
              gratuity={profile?.gratuity_enabled === 1}
              id={userId}
              isTableDisabled={false}
              detailPage={true}

            />



          </div>
      }
    </div>
  );
}
