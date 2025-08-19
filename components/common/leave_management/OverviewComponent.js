import LeaveStats from './LeaveStats';
import LeaveTrend from './LeaveTrend';
import { ArrowLeft } from 'lucide-react';
import UpcomingLeaves from './UpcomingLeaves';
import PendingApprovals from './PendingApprovals';
import { useRouter } from 'next/router';
import DataLoader from '../../ui/dataLoader';
import { UseGetProfile } from '../../../hooks/query/getProfile';

function OverviewComponent({ role, id, isShowBackButton, member, isWorkforce, isTeamLead }) {
  const router = useRouter(); 
  const { data: user } = UseGetProfile(id)
  if (!id) {
    return <DataLoader />;
  }
  
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="w-full mx-auto px-3">
            {isShowBackButton && id &&
              <button onClick={() => { router.push(role == 'team_lead' ? `/${role}/team/${id}/detail-page` : `/workforce/people/${id}/detail-page`) }} type='button' className='flex space-x-2 items-center px-2 py-1 text-white bg-primary rounded-xl my-3' >
                <ArrowLeft className='text-white h-5 w-5' />
                <span>Back</span>
              </button>
            }
            <LeaveStats id={id ? id : null} role={role} member={member} isShowBackButton={isShowBackButton} user={user} />
            <div className="flex mt-6">
              <div className="w-1/2 mr-2">
                <div className="w-full h-full border rounded-lg p-4">
                  <LeaveTrend id={id ? id : null} />
                </div>
              </div>
              <div className="w-1/2 ml-2">
                <div className="w-full h-full border rounded-lg p-4">
                  <UpcomingLeaves id={id ? id : null} isWorkforce={isWorkforce} isTeamLead={isTeamLead} />
                </div>
              </div>
            </div>
            <br />
            <div>
              <div className="w-full border rounded-lg p-4">
                <PendingApprovals id={id} role={role} member={member} isWorkforce={isWorkforce} isTeamLead={isTeamLead} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverviewComponent;
