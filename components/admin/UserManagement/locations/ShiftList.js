import React, { useState } from "react";
import AddShiftModal from "./AddShift";
import EditShiftModal from "./updateShift";
import { useRouter } from "next/router";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import DeleteItemModal from "../../../ui/deleteItemModal";
import { useGetShiftList } from "../../../../hooks/query/getShiftList";
import DataLoader from "../../../ui/dataLoader";
import UseDeleteShift from "../../../../hooks/mutations/deleteShift";

const ShiftListComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editShift, setEditShift] = useState(null);
  const router = useRouter();
  const deleteShift=UseDeleteShift()
  const { id } = router.query;
  const [modalVisible, setModalVisible] = useState(false);
  const [shiftToDelete, setShiftIdToDelete] = useState(null);
  
  const { data: ShiftList, isLoading } = useGetShiftList(id);

  const handleEdit = (shift) => {
    setEditShift(shift);
  };

  const handleDelete = () => {
    if (shiftToDelete) {
			deleteShift.mutate(shiftToDelete, {
				onSettled: () => {
					closeModal();
				},
			});
		}
    
  };
  const openModal = (id) => {
		setShiftIdToDelete(id);
		setModalVisible(true);
	};

	const closeModal = () => {
		setShiftIdToDelete(null);
		setModalVisible(false);
	};


  return (
    <div className="p-6 min-h-screen bg-gray-100">
      {/* Back Button */}
      <button
        onClick={() => router.push('/user_management/locations/list')}
        className="flex space-x-2 items-center px-3 py-2 text-white bg-primary rounded-lg shadow mb-5"
      >
        <ArrowLeft className="h-5 w-5 text-white" />
        <span>Back</span>
      </button>

      {/* Header and Add Shift Button */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-default_text">Shift List</h2>
        <button
          className="bg-primary text-white px-4 py-2 rounded-lg transition"
          onClick={() => setIsModalOpen(true)}
        >
          Add Shift
        </button>
      </div>


      {isLoading ? (
        <DataLoader />
      ) : ShiftList?.length === 0 ? (
        <p className="text-center mt-6 text-gray-600">No shifts available.</p>
      ) : (
        <div className="my-6 ">
          {ShiftList?.map((shift) => (
            <div key={shift.id} className="mb-6 p-4 border rounded-md shadow-md bg-white">

              <div className="flex justify-between items-center  p-3 rounded-lg">
                <h3 className="text-xl font-semibold text-default_text capitalize">{shift.shift_name}</h3>
                <div className="flex space-x-3">
                  <button onClick={() => handleEdit(shift)} className="text-primary border rounded-lg px-2 py-1 border-primary flex justify-center items-center hover:underline">
                    <Pencil className="h-4 w-4 mr-2" />Edit
                  </button>
                  {shift.is_default !== 1 &&
                    <button onClick={() => openModal(shift.id)} className="text-red-500  border rounded-lg px-2 py-1 border-red-500 flex justify-center items-center hover:underline">
                      <Trash2 className="h-5 w-5" /> Delete
                    </button>
                  }
                </div>
              </div>
              {/* Show First Day of the Week */}
              <div className="m-3 text-gray-700">
                <span className="font-semibold">First Day of the Week: </span>
                <span className="capitalize">{shift.first_day_of_week}</span>
              </div>

              {/* Shift Timings Table */}
              <table className="w-full border-collapse mt-3">
                <thead className="bg-grey text-gray-700 text-left">
                  <tr>
                    <th className="p-3 border">Day</th>
                    <th className="p-3 border">Start Time</th>
                    <th className="p-3 border">End Time</th>
                    <th className="p-3 border">Day Type</th>
                  </tr>
                </thead>
                <tbody>
                  {shift.timings.length > 0 ? (
                    shift.timings.map((t, index) => (
                      <tr key={index} className="border">
                        <td className="p-3 border">{t.day}</td>
                        <td className="p-3 border">{t.start_time}</td>
                        <td className="p-3 border">{t.end_time}</td>
                        <td className="p-3 border">{t.day_type}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="p-3 border text-gray-600 italic text-center" colSpan={4}>
                        No timings available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label htmlFor="weeklycontractedHours">Total Contracted Weekly Hours</label>
                  <div className="relative mt-2">
                    <input
                      id="weeklycontractedHours"
                      name="weeklycontractedHours"
                      type="number"
                      readOnly
                      disabled
                      value={(shift.location.contract_hours / 4)}

                      className="w-full p-2.5 bg-grey rounded-lg focus:outline-none text-sm border pr-16"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 bg-gray-100 border-gray-300 rounded-r-lg">
                      <span className="text-gray-500">Hrs</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="contractedHours">Total Contracted Monthly Hours</label>
                  <div className="relative mt-2">
                    <input
                      id="contractedHours"
                      name="contractedHours"
                      type="number"
                      readOnly
                      disabled
                      value={shift.location.contract_hours}
                      className="w-full p-2.5 bg-grey rounded-lg focus:outline-none text-sm border pr-16"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 bg-gray-100 border-gray-300 rounded-r-lg">
                      <span className="text-gray-500">Hrs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <DeleteItemModal
				modalVisible={modalVisible}
				closeModal={closeModal}
				handleDeleteItem={handleDelete}
				item="Shift"
				action="delete"
			/>
      {isModalOpen && <AddShiftModal onClose={() => setIsModalOpen(false)} id={id} />}
      {editShift && <EditShiftModal id={id} shiftData={editShift} onClose={() => setEditShift(null)} isIndividual={false} />}
    </div>
  );
};

export default ShiftListComponent;