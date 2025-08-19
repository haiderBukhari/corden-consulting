import { BsThreeDotsVertical } from 'react-icons/bs';
import { RiTeamLine } from "react-icons/ri";
import { useRouter } from 'next/router';

function TotalTeamMembersCard({ allMembersStats, role, totalStaffCount }) {
  const router = useRouter();

  return (
    <div className='w-full bg-white p-4 border rounded-lg shadow-sm shadow-primary'>
      <div className="flex justify-between mb-14">
        <h6 className="text-base font-semibold text-default_text">
          {
            role === "manager" ? "Total Employees" :
              allMembersStats.uniqueRoles ?
                "Total Staff"
                :
                "Total Team Members"
          }
        </h6>
        {
          allMembersStats.uniqueRoles ?
            null
            :
            <div
              className="flex items-center"
              onClick={() => { router.push(role === "manager" ? `/workforce/people/list` : `/${role}/team/members_list`) }}
            >
              <BsThreeDotsVertical className="text-gray-500 cursor-pointer" />
            </div>
        }
      </div>
      <div className="flex justify-between items-center">
        <p className="text-3xl font-bold text-gray-700" style={{ lineHeight: "1.5rem" }}>{role === "manager" ? totalStaffCount : allMembersStats.totalMembers}</p>
        <div className={`flex items-center ${allMembersStats.uniqueRoles ? "text-xs text-gray-500" : "bg-purple-100 rounded-full p-3"}`}>
          {
            allMembersStats.uniqueRoles ?
              <span>{allMembersStats.uniqueRoles} roles</span>
              :
              <RiTeamLine className="text-violet-500 cursor-pointer text-xl" />
          }
        </div>
      </div>
    </div>
  );
};

export default TotalTeamMembersCard;