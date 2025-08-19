import React from "react";
import { UseGetAdminPayrollConfigration } from "../../../../hooks/query/admin/getAdminPayroll";
import { UseGetUsers } from "../../../../hooks/query/admin/getUserList";
import { formatDateToDdMmYy } from "../../../../utils/functions";
import DataLoader from "../../../ui/dataLoader";

export default function DefaultAdminConfigration() {
  const { data: UserList } = UseGetUsers();
  const { data: ConfigrationData, isLoading } = UseGetAdminPayrollConfigration();

  return (
    <div>
      {isLoading ? (
        <DataLoader />
      ) : (
        <div className=" my-5  p-4 rounded-lg shadow-md">
          <h2 className="font-semibold">Default Configurations</h2>
          <div className="grid grid-cols-2 gap-x-4 mt-3">
            <div className="">
              <label className="block mb-1">Cut-off Period</label>
              <input
                type="text"
                className="p-2 border bg-grey cursor-not-allowed rounded-lg w-full"
                name="cut_off_period"
                value={formatDateToDdMmYy(
                  new Date(
                    ConfigrationData && ConfigrationData[0]?.cut_off_period
                  )
                )}
                readOnly
              />
            </div>

            <div className="">
              <h2 className=" ">Approval Manager For  Configurations</h2>
              <p className="p-2 border bg-grey cursor-not-allowed rounded-lg w-full">
                {UserList?.find(
                  (user) =>
                    user.id === ConfigrationData[0]?.configuration_approver
                )?.name || "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
