import React from "react";

const ActivityLog = ({ data }) => {
    return (
        <div className="p-4 bg-white shadow-md my-5 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Activity Log</h2>
            <div className="overflow-x-auto border rounded-lg ">
                <table className="min-w-full border-collapse bg-white">
                    <thead className="bg-grey sticky top-0 z-20">
                        <tr>
                            <th className="px-2 py-2 border-b text-left text-default_text text-sm">User Name</th>
                            <th className="px-2 py-2 border-b text-left text-default_text text-sm">Role</th>
                            <th className="px-2 py-2 border-b text-left text-default_text text-sm">Action</th>
                            <th className="px-2 py-2 border-b text-left text-default_text text-sm">Date</th>
                            <th className="px-2 py-2 border-b text-left text-default_text text-sm">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.length > 0 ? (
                            data.map((log, index) => {
                                // Split the created_at field into date and time
                                const [date, time,zone] = log?.created_at.split(" ");
                                return (
                                    <tr
                                        key={log.id}
                                    >
                                        <td className="px-2 py-3 border-b text-default_text">{log.user_name}</td>
                                        <td className="px-2 py-3 border-b text-default_text">Manager</td>
                                        <td className="px-2 py-3 border-b text-default_text capitalize">{log.action}</td>
                                        <td className="px-2 py-3 border-b text-default_text">{date}</td>
                                        <td className="px-2 py-3 border-b text-default_text">{time + zone}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="px-6 py-3 text-center text-gray-500"
                                >
                                    No activity logs available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActivityLog;
