import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ButtonLoader from '../../ui/buttonLoader';
import { formatDateToDdMmYy } from '../../../utils/functions';

const UpdateIndividualLeaveForm = ({ isOpen, onClose, leaveStatsData, onSave, isSaving, member }) => {
	// Define form validation schema using Yup
	const validationSchema = Yup.object().shape({
		total_annual_leaves: Yup.number().required('Annual leaves are required').min(0, 'Must be a positive number'),
		total_sick_leaves: Yup.number().required('Sick leaves are required').min(0, 'Must be a positive number'),
		total_maternity_leaves: Yup.number().required('Sick leaves are required').min(0, 'Must be a positive number'),
		total_paternity_leaves: Yup.number().required('Sick leaves are required').min(0, 'Must be a positive number'),
		total_compassionate_leaves: Yup.number().required('Sick leaves are required').min(0, 'Must be a positive number'),
	});

	// Use Formik hook to manage form state
	const formik = useFormik({
		initialValues: {
			total_annual_leaves: leaveStatsData?.total_annual_leaves,
			total_sick_leaves: leaveStatsData?.total_sick_leaves,
			total_maternity_leaves: leaveStatsData?.total_maternity_leaves,
			total_paternity_leaves: leaveStatsData?.total_paternity_leaves,
			total_compassionate_leaves: leaveStatsData?.total_compassionate_leaves,
		},
		validationSchema,
		onSubmit: (values) => {
			onSave(values);
		},
	});

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-medium">Update Leave Stats</h2>
					<p className="text-base font-medium text-gray-500">DOJ: {formatDateToDdMmYy(new Date(member?.date_of_joining))}</p>
				</div>
				<form onSubmit={formik.handleSubmit}>
					<div className="grid grid-cols-2 gap-5">
						<div className="mb-4">
							<label className="block text-base font-medium text-gray-500 mb-2">Total Annual Leaves</label>
							<input
								type="number"
								name="total_annual_leaves"
								className={`w-full px-3 py-2 border rounded ${formik.errors.total_annual_leaves && formik.touched.total_annual_leaves ? 'border-secondary' : ''}`}
								value={formik.values.total_annual_leaves}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
							{formik.errors.total_annual_leaves && formik.touched.total_annual_leaves && (
								<p className="text-darkred text-sm">{formik.errors.total_annual_leaves}</p>
							)}
						</div>

						<div className="mb-4">
							<label className="block text-base font-medium text-gray-500 mb-2">Total Sick Leaves</label>
							<input
								type="number"
								name="total_sick_leaves"
								className={`w-full px-3 py-2 border rounded ${formik.errors.total_sick_leaves && formik.touched.total_sick_leaves ? 'border-secondary' : ''}`}
								value={formik.values.total_sick_leaves}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
							{formik.errors.total_sick_leaves && formik.touched.total_sick_leaves && (
								<p className="text-darkred text-sm">{formik.errors.total_sick_leaves}</p>
							)}
						</div>

						<div className="mb-4">
							<label className="block text-base font-medium text-gray-500 mb-2">Total Maternity Leaves</label>
							<input
								type="number"
								name="total_maternity_leaves"
								className={`w-full px-3 py-2 border rounded ${formik.errors.total_maternity_leaves && formik.touched.total_maternity_leaves ? 'border-secondary' : ''}`}
								value={formik.values.total_maternity_leaves}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
							{formik.errors.total_maternity_leaves && formik.touched.total_maternity_leaves && (
								<p className="text-darkred text-sm">{formik.errors.total_maternity_leaves}</p>
							)}
						</div>

						<div className="mb-4">
							<label className="block text-base font-medium text-gray-500 mb-2">Total Paternity Leaves</label>
							<input
								type="number"
								name="total_paternity_leaves"
								className={`w-full px-3 py-2 border rounded ${formik.errors.total_paternity_leaves && formik.touched.total_paternity_leaves ? 'border-secondary' : ''}`}
								value={formik.values.total_paternity_leaves}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
							{formik.errors.total_paternity_leaves && formik.touched.total_paternity_leaves && (
								<p className="text-darkred text-sm">{formik.errors.total_paternity_leaves}</p>
							)}
						</div>

						<div className="mb-4">
							<label className="block text-base font-medium text-gray-500 mb-2">Total Compassionate Leaves</label>
							<input
								type="number"
								name="total_compassionate_leaves"
								className={`w-full px-3 py-2 border rounded ${formik.errors.total_compassionate_leaves && formik.touched.total_compassionate_leaves ? 'border-secondary' : ''}`}
								value={formik.values.total_compassionate_leaves}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
							{formik.errors.total_compassionate_leaves && formik.touched.total_compassionate_leaves && (
								<p className="text-darkred text-sm">{formik.errors.total_compassionate_leaves}</p>
							)}
						</div>
					</div>

					<div className="flex justify-end">
						<button
							type="button"
							className="px-4 py-2 mr-2 bg-secondary text-white rounded"
							onClick={onClose}
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-6 py-2 bg-primary text-white rounded"
							disabled={isSaving}
						>
							{isSaving ? <ButtonLoader text={"Saving..."} /> : "Save"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default UpdateIndividualLeaveForm;
