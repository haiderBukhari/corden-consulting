import React, { useState } from "react";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { UseGetRegionsList } from "../../../../hooks/query/payroll/regions/getRegionsList";
import DataLoader from "../../../ui/dataLoader";
import ActivityLog from "../common/ActivityLog";
import { TbEdit } from "react-icons/tb";
import EditRegion from "../common/EditRegion";
import ModifyRegionVariable from "../common/ModifyRegionVariable";

export default function RegionsConfigurations({ role }) {
  const { data: regionsList, isLoading: isLoadingRegions } = UseGetRegionsList();
  const [editingRegion, setEditingRegion] = useState(null);
  const [addingRegion, setAddingRegion] = useState(null);

  if (isLoadingRegions) {
    return <DataLoader />;
  }

  return (
    <div className="min-h-screen">
      {
        editingRegion ? 
          <EditRegion
            region={editingRegion}
            onDiscard={() => setEditingRegion(null)}
          />
          : addingRegion ?
            <ModifyRegionVariable
              region={addingRegion}
              onDiscard={() => setAddingRegion(null)}
            />
          :
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Regions</h2>
          <div className="overflow-y-auto max-h-screen">
            {regionsList?.regions?.map((region) => (
              <div
                key={region?.id}
                className="bg-white rounded-lg p-4 mb-6 border border-gray-200 flex mr-1"
              >
                <div className="w-[60%] pr-4">
                  <div className="text-lg font-medium flex items-center mb-5">
                    <div className="w-8 h-8 flex justify-center items-center rounded-lg mr-3 border border-gray-300 px-1">
                      <MapPinIcon className="text-primary" />
                    </div>
                    <span className="text-xl">{region?.name}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {region.locations.map((location) => (
                      <div
                        key={location?.id}
                        className="px-4 py-1 border border-gray-300 rounded-lg"
                      >
                        {location?.name}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-[30%] px-4 h-auto flex flex-col">
                  <div className="bg-grey rounded-xl p-4 h-full">
                    {region?.variables.length === 0 ? (
                      <div className="text-gray-500 text-sm italic">
                        No variables set for this region.
                      </div>
                    ) : region?.variables.every(
                        (variable) => variable.status === "Inactive"
                      ) ? (
                      <div className="text-gray-500 text-sm italic">
                        No variables are active.
                      </div>
                    ) : (
                      region?.variables.map(
                        (variable) =>
                          variable?.status === "Active" && (
                            <div
                              key={variable?.id}
                              className="flex justify-between mb-2"
                            >
                              <span>{variable?.title}</span>
                              <span
                                className={`font-semibold ${
                                  variable?.variable_type === "Addition"
                                    ? "text-green-500"
                                    : "text-red-500"
                                }`}
                              >
                                {variable?.variable_type === "Addition" ? "+" : "-"}
                                {variable?.mode_of_calculation === "Percentage"
                                  ? `${variable?.value}%`
                                  : `$${variable?.value}`}
                              </span>
                            </div>
                          )
                      )
                    )}
                    <button
                      className="mt-3 text-primary border border-primary rounded-xl px-2 py-1 text-sm"
                      onClick={() => setAddingRegion(region)}
                    >
                      Add Variable
                    </button>
                  </div>
                </div>

                {region?.variables.length !== 0 && (
                  <div className="w-[10%] flex items-center justify-center">
                    <button
                      className="flex items-center justify-center rounded-lg px-4 py-1 border border-primary text-primary text-sm"
                      onClick={() => setEditingRegion(region)}
                    >
                      <TbEdit className="h-4 w-4" />
                      Edit
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      }
      {/* <ActivityLog data={ConfigrationData?.activities} /> */}
    </div>
  );
}
