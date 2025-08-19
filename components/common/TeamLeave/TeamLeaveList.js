import React from "react";
import GeneralListComponent from "../GeneralListComponent";
import DataLoader from "../../ui/dataLoader";
import { getAllLeaveList } from "../../../hooks/query/getALLLeaveList";

export default function TeamLeaveList({role}) {
  const { data: TeamLeaveList, isLoading: isLoadingTeamLeaveList } = getAllLeaveList();

  return (
    <>
      {
        isLoadingTeamLeaveList ?
          <DataLoader />
          :
          <div>
            <GeneralListComponent data={TeamLeaveList} role={role} listType={"leave_requests"}/>
          </div>
      }
    </>
  );
}
