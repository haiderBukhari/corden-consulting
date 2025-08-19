import React from 'react';
import { BsFillTelephoneFill } from 'react-icons/bs';
import { MdAlternateEmail } from "react-icons/md";
import { LiaUserLockSolid } from "react-icons/lia";
import { CiClock2 } from "react-icons/ci";
import { PiPauseCircleThin } from "react-icons/pi";
import Link from 'next/link';
import useGetActiveUser from '../../../hooks/query/getUserFromLocalStorage';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Tooltip } from 'react-tooltip';

export default function MemberCard({ member }) {
  const router = useRouter();
  const { data: user } = useGetActiveUser();

  return (
    <div
      className={`p-6 mb-6 bg-white border rounded-3xl ${member.leavesCount > 0 ? ' border border-primary' : ''} mx-2 grid grid-cols-1 gap-4`}
    >
      <div className="flex justify-between">
        <div className="flex">
          <div className="relative mr-4">
            <Image src={member.avatar} className="w-16 h-16 rounded-lg" height={200} width={400} alt="Profile" />
            {member.leavesCount > 0 && (
              <div className="absolute -top-2 -left-2 text-white text-base font-bold bg-secondary rounded-full px-2">
                {member.leavesCount}
              </div>
            )}
          </div>
          <span className="text-left">
            <p className="text-base text-gray-700 font-semibold capitalize">{member.name}</p>
            <p className="text-gray-400 text-sm capitalize">ID: {member.employee_id}</p>
            <p className="text-gray-400 text-sm capitalize">{member.position?.name}</p>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 ">
        <div className="flex flex-col items-center">
          <div className="bg-gray-100 py-2 rounded-full flex justify-center items-center w-full mb-2" data-tip="Phone">
            <BsFillTelephoneFill className="text-primary text-sm" />
          </div>
          <p className='text-xs'>{member.phone_number}</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-gray-100 py-2 rounded-full flex justify-center items-center w-full mb-2" data-tip="Email">
            <MdAlternateEmail className="text-primary text-sm" />
          </div>
          <span className='text-xs break-all'>{member.email || "test@gmail.com"}</span>
        </div>
      </div>

      <hr />

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="flex flex-col items-center">
          <div className="rounded-full p-3 bg-purple-100 mb-1 flex justify-center items-center" data-tip="Working Hours">
            <LiaUserLockSolid className="text-purple-500 text-lg" data-tooltip-id="my-tooltip" data-tooltip-content="Working Hours" />
          </div>
          <p className='text-sm'>{member.working_hours}</p>
        </div>
        <div className="flex flex-col items-center">
          <div className='rounded-full p-3 bg-accent mb-1 flex justify-center items-center' data-tip="Clock In Time">
            <CiClock2 className="text-primary text-lg" data-tooltip-id="my-tooltip" data-tooltip-content="Clock In Time"/>
          </div>
          <p className='text-sm'>{member.clock_in_time || 0}</p>
        </div>
        <div className="flex flex-col items-center">
          <div className='rounded-full p-3 bg-green-100 mb-1 flex justify-center items-center' data-tip="Clock Out Time">
            <PiPauseCircleThin className="text-green-500 text-lg" data-tooltip-id="my-tooltip" data-tooltip-content="Clock Out Time"/>
          </div>
          <p className='text-sm'>{member.clock_out_time || 0}</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className={`px-6 py-1 text-sm rounded-full capitalize ${member.attendance < 75 ? 'bg-red-100 text-darkred border-red-400' : member.attendance > 90 ? 'bg-green-100 text-green-500 border-green-400' : 'bg-orange-100 text-orange-400 border-orange-300'}`}>
          {member.attendance_percentage || 0}%
        </div>
        <Link href={`/${user.role}/team/${member.id}/detail-page`} className="flex items-center justify-center text-sm underline text-primary cursor-pointer">
          View Details
        </Link>
      </div>
      <Tooltip id="my-tooltip" place="top" type="light" effect="float" />
    </div>
  );
}
