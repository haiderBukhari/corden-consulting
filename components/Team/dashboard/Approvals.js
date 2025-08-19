import { useState, useEffect } from 'react';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import { FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { useRouter } from 'next/router';
import useUpdateLeaveStatus from '../../../hooks/mutations/updateLeaveStatus';
import Link from 'next/link';
import useGetActiveUser from '../../../hooks/query/getUserFromLocalStorage';

function Approvals({ allMemberPendingLeaves, maxLeavesToShow = 10, height }) {
  const [approvals, setApprovals] = useState([]);
  const router = useRouter();
  const { id } = router.query;
  const { data: user } = useGetActiveUser();
  const updateLeaveStatus = useUpdateLeaveStatus();

  const approveLeave = (id) => {
    const formData = new FormData();
    formData.append('leave_id', id);
    formData.append('status', 'approved');

    updateLeaveStatus.mutate(formData, {
      onSuccess: () => {
        setApprovals(prevApprovals => prevApprovals.map(approval =>
          approval.leave_id === id ? { ...approval, approved: true, rejected: false } : approval
        ));
      }
    });
  };

  const rejectLeave = (id) => {
    const formData = new FormData();
    formData.append('leave_id', id);
    formData.append('status', 'rejected');

    updateLeaveStatus.mutate(formData, {
      onSuccess: () => {
        setApprovals(prevApprovals => prevApprovals.map(approval =>
          approval.leave_id === id ? { ...approval, approved: false, rejected: true } : approval
        ));
      }
    });
  };

  useEffect(() => {
    if (allMemberPendingLeaves && allMemberPendingLeaves.length > 0) {
      const filteredApprovals = allMemberPendingLeaves.filter(approval => {
        if (user.role === 'team_lead') {
          return approval.team_lead_status === 'pending';
        } else if (user.role === 'hr') {
          return approval.hr_status === 'pending';
        } else if (user.role === 'manager') {
          return approval.manager_status === 'pending';
        }
        return false;
      });

      const sortedApprovals = filteredApprovals
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, maxLeavesToShow)
        .map(approval => ({
          ...approval,
          isOpen: false,
          isNew: (new Date() - new Date(convertDateFormat(approval.created_at))) / 60000 <= 5
        }));
      setApprovals(sortedApprovals);
    } else {
      setApprovals([]);
    }
  }, [allMemberPendingLeaves, maxLeavesToShow, user.role]);

  const convertDateFormat = (dateStr) => {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return dateStr;
  };

  const toggleDetails = (id) => {
    const updatedApprovals = approvals.map(approval => {
      if (approval.leave_id === id) {
        approval.isOpen = !approval.isOpen;
      }
      return approval;
    });
    setApprovals(updatedApprovals);
  };

  return (
    <>
      {approvals && approvals.length > 0 ? (
        <div className='w-full bg-grey border shadow-sm rounded-lg p-4'>
          <div className="flex justify-between items-center mb-4">
            <span className="flex items-center">
              <span className="text-base font-semibold text-gray-700 mr-2">Pending Approvals</span>
              <span className="inline-flex text-base items-center justify-center h-6 w-6 rounded-full bg-primary text-white">{approvals.length}</span>
            </span>
            <div className="p-2 text-primary underline text-sm">
              <Link href={id ? (user.role === 'team_lead' ? `/${user.role}/team/${id}/approvals` : `/workforce/people/${id}/approvals`) : (user.role === "manager" ? `/workforce/approvals` : `/${user.role}/team/approval`)}>
                View All
              </Link>

            </div>
          </div>
          <div className='overflow-y-auto pr-2' style={{ height: height }}>
            {approvals && approvals.map(approval => (
              <div key={approval.leave_id}>
                <div className={` ${approval.is_new == 'NEW' ? 'border-primary' : 'hover:border-primary hover:shadow hover:shadow-primary'} w-full bg-white border shadow-sm rounded-2xl p-4  mb-4`}>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs text-default_text font-bold mb-4">
                        <span className='text-primary capitalize'>
                          {approval.user_name + ' '}
                        </span>
                        {approval.leave_description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-default_text mr-2">{approval.time_ago}</span>
                        <span className={`text-xs px-2 py-1 ${approval.is_new == 'NEW' ? 'bg-primary' : ''} rounded-2xl text-white`}>{approval.is_new == 'NEW' ? "New" : null}</span>
                      </div>
                      {/* <div onClick={() => toggleDetails(approval.leave_id)} className="cursor-pointer text-primary flex justify-center">
                        {approval.isOpen ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                      </div> */}
                    </div>
                  </div>
                </div>
                {/* {approval.isOpen && (
                  <div className="flex justify-around items-center text-center gap-2 mt-2 mb-4">
                    <div>
                      <button
                        onClick={() => rejectLeave(approval.leave_id)}
                        className="bg-white py-3 px-10 rounded-full mb-2"
                      >
                        <MdCancel className="text-darkred cursor-pointer text-xl" />
                      </button>
                      <p className='text-xs'>
                        Reject
                      </p>
                    </div>

                    <div>
                      <button
                        onClick={() => approveLeave(approval.leave_id)}
                        className="bg-white py-3 px-10 rounded-full mb-2"
                      >
                        <FaCheckCircle className="text-green-500 cursor-pointer text-xl" />
                      </button>
                      <p className='text-xs'>
                        Approve
                      </p>
                    </div>
                  </div>
                )} */}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500 text-center bg-grey border shadow-sm rounded-lg p-4" >
          No Pending Approvals!
        </div>
      )}
    </>
  );
};

export default Approvals;
