import React, { useState } from "react";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { Check } from "lucide-react";
import { IoCalendarOutline, IoInformationCircleOutline } from "react-icons/io5";
import { MdFilterList } from 'react-icons/md';
import DataLoader from "../../ui/dataLoader";
import { BsSearch } from "react-icons/bs";
import { formatDateToDay, formatDateToDdMmYy } from "../../../utils/functions";
import { Tooltip } from 'react-tooltip';

export default function RequestManagementComponent({
	role,
	data,
	isLoading,
	manageRequestApi,
}) {
	const manageRequest = manageRequestApi();

	const [searchQuery, setSearchQuery] = useState("");
	const [selectedMonth, setSelectedMonth] = useState("");
	const [selectedYear, setSelectedYear] = useState("");
	const [requestReasons, setRequestReasons] = useState({});
	const [errors, setErrors] = useState({});
	const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
	const [filters, setFilters] = useState({
		pending: true,
		approved: false,
		rejected: false,
	});

	const approveRequest = (requestedId) => {
		const data = {
			"action": "approved",
			"comment": requestReasons[requestedId]
		}

		manageRequest.mutate(
			{ id: requestedId, data },
			{
				onSuccess: () => {
					// Reset the reason field for this request
					setRequestReasons((prevReasons) => ({ ...prevReasons, [requestedId]: "" }));
					setErrors((prevErrors) => ({ ...prevErrors, [requestedId]: "" }));
				},
			}

		);
	};

	const rejectRequest = (requestId) => {
		const data = {
			"action": "rejected",
			"comment": requestReasons[requestId]
		}

		manageRequest.mutate(
			{ id: requestId, data },
			{
				onSuccess: () => {
					// Reset the reason field for this request
					setRequestReasons((prevReasons) => ({ ...prevReasons, [requestId]: "" }));
					setErrors((prevErrors) => ({ ...prevErrors, [requestId]: "" }));
				},
			}
		);
	};

	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
	};

	const handleMonthChange = (event) => {
		setSelectedMonth(event.target.value);
	};

	const handleYearChange = (event) => {
		setSelectedYear(event.target.value);
	};

	const handleFilterChange = (filterType) => {
		setFilters((prevFilters) => ({
			...prevFilters,
			[filterType]: !prevFilters[filterType],
		}));
	};

	const handleReasonChange = (event, id) => {
		setRequestReasons((prevReasons) => ({
			...prevReasons,
			[id]: event.target.value, // Associate reason with specific request id
		}));
		setErrors((prevErrors) => ({
			...prevErrors,
			[id]: "", // Clear any existing error for this specific request id
		}));
	};

	const isTextareaEnabled = (request) => {
		// Your logic to enable or disable the textarea
		return true; // Replace with actual logic
	};

	const isButtonEnabled = (request) => {
		return true; // Replace with actual logic
	};

	const filteredRequests = data?.filter((request) => {
		const requestDate = new Date(request.date.split("-").reverse().join("-")); // Convert 'dd-MM-yyyy' to 'yyyy-MM-dd'
		const requestMonth = requestDate.getMonth(); // Get the month (0-indexed)
		const requestYear = requestDate.getFullYear(); // Get the year

		return (
			(!searchQuery || request.user.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
			filters[request.status] &&
			(selectedMonth === "" || requestMonth === parseInt(selectedMonth)) && // Compare with 0-indexed month
			(selectedYear === "" || requestYear.toString() === selectedYear) // Compare year as a string
		);
	});

	if (isLoading) {
		return <DataLoader />;
	}

	return (
		<div className="min-h-screen">
			<div className="relative w-full mb-3 flex items-center">
				<BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
				<input
					type="text"
					placeholder="Search..."
					value={searchQuery}
					onChange={handleSearchChange}
					className="border rounded-2xl w-full pl-12 px-4 py-2"
				/>
				<div className="ml-4 relative">
					<button
						onClick={() => setFilterDropdownVisible(!filterDropdownVisible)}
						className="px-4 py-2 border rounded-2xl flex items-center gap-2 whitespace-nowrap"
					>
						<MdFilterList />
						<span>Filter</span>
					</button>
					{filterDropdownVisible && (
						<div className="absolute right-0 mt-2 w-48 bg-white border rounded-2xl p-3 z-50">
							<label className="flex items-center gap-2">
								<input
									type="checkbox"
									checked={filters.pending}
									onChange={() => handleFilterChange("pending")}
								/>
								Pending
							</label>
							<label className="flex items-center gap-2">
								<input
									type="checkbox"
									checked={filters.approved}
									onChange={() => handleFilterChange("approved")}
								/>
								Approved
							</label>
							<label className="flex items-center gap-2">
								<input
									type="checkbox"
									checked={filters.rejected}
									onChange={() => handleFilterChange("rejected")}
								/>
								Rejected
							</label>
						</div>
					)}
				</div>
				<div className="flex items-center ml-4 border rounded-2xl bg-white px-4 py-2">
					<IoCalendarOutline className="text-gray-500 mr-2" />
					<select
						value={selectedMonth}
						onChange={handleMonthChange}
					>
						<option value="">All Months</option>
						<option value="0">January</option>
						<option value="1">February</option>
						<option value="2">March</option>
						<option value="3">April</option>
						<option value="4">May</option>
						<option value="5">June</option>
						<option value="6">July</option>
						<option value="7">August</option>
						<option value="8">September</option>
						<option value="9">October</option>
						<option value="10">November</option>
						<option value="11">December</option>

					</select>
				</div>
				<div className="flex items-center ml-4 border rounded-2xl bg-white px-4 py-2">
					<IoCalendarOutline className="text-gray-500 mr-2" />
					<select
						value={selectedYear}
						onChange={handleYearChange}
					>
						<option value="">All Years</option>
						{[2022, 2023, 2024, 2025].map((year) => (
							<option key={year} value={year}>
								{year}
							</option>
						))}
					</select>
				</div>
			</div>
			{filteredRequests && filteredRequests.length > 0 ?
				<div className="max-h-screen overflow-y-auto border rounded-2xl p-3">
					{filteredRequests
						.sort((a, b) => (a.is_new === "NEW" || a.status == 'pending' ? -1 : 1)) // Sort to bring "NEW" items on top
						.map((request) => (
							<div key={request.leave_id} className="mb-4">
								<h2 className="p-2 text-lg">
									{formatDateToDay(request.date)}
								</h2>
								<div className={`grid grid-cols-12 gap-3 ${request.status !== 'pending' ? 'opacity-70' : ''}`}>
									<div className={`border rounded-2xl col-span-5 p-4 relative ${request.is_new === "NEW" ? "border-primary" : ""}`}>
										<div className="flex justify-between items-center pb-3">
											<div>
												<h2 className="text-base text-default_text font-semibold mr-2">
													<span className="capitalize text-primary">
														{request.description}
													</span>
												</h2>
												{/* <p className="text-sm"> {formatDateToDdMmYy(new Date(request.date))}</p> */}
											</div>
											{request.is_new === "NEW" && (
												<span className="bg-primary text-white text-xs rounded-full px-3 py-2 self-start">New</span>
											)}
										</div>
										<hr />
										<div className="mt-2 mb-4">
											<div className="flex justify-between items-center mt-2 mb-2">
												<span className="text-sm font-semibold">Details</span>
												{request.loan_request_reason && (
													<>
														<IoInformationCircleOutline
															data-tooltip-id="my-tooltip"
															data-tooltip-content={"Reason: " + request.loan_request_reason}
															className="cursor-pointer h-5 w-5 bg-primary text-white rounded-full"
														/>
														<Tooltip
															id="my-tooltip"
															place="right"
															type="light"
															effect="float"
															style={{ maxWidth: "300px", whiteSpace: "normal", wordWrap: "break-word" }}
														/>
													</>
												)}
											</div>

											<div className="flex justify-between pt-2">
												<div>Amount</div>
												<div className="font-semibold">${request?.amount ? request.amount : request.loan_amount}</div>
											</div>
											{request?.tenure_month &&
												<>
													<div className="flex justify-between pt-2">
														<div>Term</div>
														<div className="font-semibold">{request.tenure_month}</div>
													</div>
													<div className="flex justify-between pt-2">
														<div>Monthly Installments</div>
														<div className="font-semibold">${request.monthly_installment}</div>
													</div>
												</>
											}
										</div>
									</div>

									<div className="flex col-span-7 bg-[#F6F6F6] rounded-2xl">
										{request.status === "pending" && (
											<div className="flex flex-col w-full p-4">
												<div className="flex-grow">
													<textarea
														name="reason"
														className={`p-4 text-base text-default_text w-full rounded-2xl border focus:outline-none focus:border-primary ${isTextareaEnabled(request) ? "cursor-text bg-white" : "cursor-not-allowed bg-[#E4E4E4]"}`}
														placeholder="Write note here"
														style={{ height: "6em", resize: "none" }}
														value={requestReasons[request.id] || ""}
														onChange={(e) => handleReasonChange(e, request.id)}
														disabled={!isTextareaEnabled(request)}
													/>
													{errors[request.id] && <div className="text-darkred">{errors[request.id]}</div>}
												</div>
												<div className="flex space-x-4 justify-end">
													{
														request.status === "approved" ? (<>
															<button className="cursor-default bg-white flex items-center text-green-500 py-6 px-14 justify-center border rounded-2xl">
																<p>Approved</p>
																<Check className="h-5 w-5 ml-2 bg-green-400 text-white rounded-full p-1" />
															</button>
														</>)
															: (
																<div className="flex justify-end items-center w-full">
																	<div className="flex space-x-4">
																		<button className={`${isButtonEnabled(request) ? "cursor-pointer" : "cursor-not-allowed text-gray-400"}`} onClick={() => rejectRequest(request.id)} disabled={!isButtonEnabled(request)}>
																			<div className={`${isButtonEnabled(request) ? "bg-white" : "bg-[#E4E4E4]"} shadow-sm px-10 py-3 text-xs my-2 rounded-full`}>
																				<XMarkIcon className="h-5 w-5 bg-red-400 text-white rounded-full p-1" />
																			</div>
																			<p>Reject</p>
																		</button>
																		<button className={`${isButtonEnabled(request) ? "cursor-pointer" : "cursor-not-allowed text-gray-400"}`} onClick={() => approveRequest(request.id)} disabled={!isButtonEnabled(request)}>
																			<div className={`${isButtonEnabled(request) ? "bg-white" : "bg-[#E4E4E4]"} shadow-sm px-10 py-3 text-xs my-2 rounded-full`}>
																				<Check className="h-5 w-5 bg-green-400 text-white rounded-full p-1" />
																			</div>
																			<p>Approve</p>
																		</button>
																	</div>
																</div>
															)}
												</div>
											</div>
										)}
										{(request.status === "approved" || request.status === "rejected") && (
											<div className="flex flex-col w-full p-4">
												<div className="flex-grow">
													<textarea
														name="reason"
														className="p-4 text-base text-default_text w-full bg-[#E4E4E4] rounded-2xl border focus:outline-none focus:border-primary"
														placeholder={
															request.comment
														}
														style={{ height: "6em", resize: "none" }}
														value={
															request.comment
														}
														disabled
													/>
												</div>
												<div className="flex space-x-4 justify-end">
													<button className={`cursor-default bg-white flex items-center ${request.status === "approved" ? "text-green-500" : "text-darkred"} py-6 px-14 justify-center border rounded-2xl`}>
														<p>{request.status === "approved" ? "Approved" : "Rejected"}</p>
														{request.status === "approved" ? (
															<Check className="h-5 w-5 ml-2 bg-green-400 text-white rounded-full p-1" />
														) : (
															<XMarkIcon className="h-5 w-5 ml-2 bg-red-400 text-white rounded-full p-1" />
														)}
													</button>
												</div>
											</div>
										)}
									</div>
								</div>
							</div>
						))}
				</div>
				: (
					<div className="text-gray-500 text-center flex my-48 justify-center text-xl">No Pending Request!</div>
				)}
		</div>
	);
}

