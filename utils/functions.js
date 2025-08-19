

export const formatDateToAmPm = (input) => {
  if (!input) return null;

  let hours, minutes;

  if (typeof input === 'string') {
    [hours, minutes] = input.split(':').map(Number);
  } else if (input instanceof Date) {
    hours = input.getHours();
    minutes = input.getMinutes();
  } else {
    return null; // Invalid input
  }

  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedTime = `${formattedHours}:${formattedMinutes} ${period}`;

  return formattedTime;
};

export const calculateWorkingHours = (startTime, endTime) => {
  if (!startTime || !endTime) return null;

  const milliseconds = endTime - startTime;
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const remainingSeconds = totalSeconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);

  return { hours, minutes };
};

export function formatDateToDdMmYy(date) {
  if (!date) return '';
  // Extract day, month, and year components from the date object
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0, so we add 1
  const year = String(date.getFullYear())

  // Concatenate components with hyphens to form the formatted date string
  return `${day}-${month}-${year}`;
}

export function convertTo24HourFormat(time) {
  const [timePart, modifier] = time.split(' ');
  let [hours, minutes] = timePart.split(':');

  if (hours === '12') {
    hours = '00';
  }

  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }

  return `${hours}:${minutes}`;
};
// convert image to 64Base
export const getBase64ImageFromUrl = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // To avoid CORS issues
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/png');
      resolve(dataURL);
    };
    img.onerror = (error) => reject(error);
  });
};
// utils.js
export default function exportToCSV(data, filename) {
  const csvContent = 'data:text/csv;charset=utf-8,' +
    data.map(row => Object.values(row).join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
};


export function formatDateToDay(dateString) {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  let inputDate;

  // Helper function to check if the date is valid
  function isValidDate(date) {
    return date instanceof Date && !isNaN(date);
  }

  // Try parsing as ISO or other native JS date format first
  inputDate = new Date(dateString);

  // If the input date is invalid, attempt to parse known common formats (e.g., DD-MM-YYYY, MM-DD-YYYY)
  if (!isValidDate(inputDate)) {
    // Check for DD-MM-YYYY format
    if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
      const [day, month, year] = dateString.split('-');
      inputDate = new Date(`${year}-${month}-${day}`);
    }
    // Check for MM-DD-YYYY format
    else if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      const [month, day, year] = dateString.split('/');
      inputDate = new Date(`${year}-${month}-${day}`);
    }
    // Add more format handling as needed
  }

  // If date is still invalid, return an error message
  if (!isValidDate(inputDate)) {
    return 'Invalid date format';
  }

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const dayOfWeek = daysOfWeek[inputDate.getDay()];
  const dayOfMonth = inputDate.getDate();
  const monthName = monthsOfYear[inputDate.getMonth()];
  const yearNumber = inputDate.getFullYear();

  let prefix = `${dayOfWeek}, `;
  if (inputDate.toDateString() === today.toDateString()) {
    prefix = 'Today, ';
  } else if (inputDate.toDateString() === yesterday.toDateString()) {
    prefix = 'Yesterday, ';
  }

  return `${prefix}${dayOfMonth} ${monthName}, ${yearNumber}`;
}

// Function to export payroll table data as CSV
export const handleExportCSV = (tableType, filteredData) => {
  let csvRows = [];

  if (tableType === 'overview') {
    csvRows = [
      ['Month', 'Payroll Amount', 'Status'],
      ...filteredData?.map(dataItem => [
        dataItem?.date || "",
        dataItem?.total_amount || "0.00",
        dataItem?.status || "",
      ]),
    ];
  } else if (tableType === 'staff_directory_upcoming_payroll') {
    const allVariables = new Set();

    // Collect all unique variable keys
    filteredData?.forEach(dataItem => {
      if (dataItem?.variables) {
        Object.keys(dataItem?.variables).forEach(key => allVariables.add(key));
      }
    });

    const variableHeaders = [...allVariables];
    const headers = [
      'Employee',
      'Position',
      'Department',
      'Branch',
      'Basic Salary',
      'Bonuses',
      'Penalties',
      'Loan',
      'Advance Salary',
      ...variableHeaders,
      'Total Additions',
      'Total Deductions',
      'Net Payout',
      'Grutiuty'
    ];

    csvRows = [
      headers,
      ...filteredData?.map(dataItem => {
        const variablesData = variableHeaders.map(key => dataItem?.variables?.[key] || "0.00");
        return [
          `${dataItem?.user?.fname || ""} ${dataItem?.user?.middle_name || ""} ${dataItem?.user?.lname || ""}`.trim() || "N/A",
          dataItem?.user?.position?.name || "",
          dataItem?.user?.department?.departments_name || "",
          dataItem?.branch?.name || "",
          dataItem?.basic_salary || "0.00",
          dataItem?.bonus || "0.00",
          dataItem?.penalties || "0.00",
          dataItem?.loan || "0.00",
          dataItem?.advance_salary || "0.00",
          ...variablesData,
          dataItem?.addition || "0.00",
          dataItem?.deduction || "0.00",
          dataItem?.net_payout || "0.00",
          dataItem?.monthly_gratuity || "0.00",
        ];
      }),
    ];
  } else {
    filteredData?.forEach(({ month, columns, payroll }) => {
      const parsedColumns = JSON.parse(columns || "[]");
      const variableKeys = payroll?.variables ? Object.keys(payroll.variables) : [];

      if (csvRows.length === 0) {
        csvRows.push([
          'Month',

          ...parsedColumns,
          'Total Additions',
          'Total Deductions',
          'Net Payout',
          'Gratuity',
          'Status'
        ]);
      }

      const rowData = [
        month || "",
        payroll?.basic_salary ?? "0.00",
        payroll?.bonus ?? "0.00",
        payroll?.penalties ?? "0.00",
        payroll?.loan ?? "0.00",
        payroll?.early_salary ?? "0.00",
        ...variableKeys.map(key => payroll.variables[key] ?? "0.00"),
        payroll?.addition ?? "0.00",
        payroll?.deduction ?? "0.00",
        payroll?.net_payout ?? "0.00",
        payroll?.graduity_fund ?? "0.00",
        payroll?.status || "",
      ];

      csvRows.push(rowData);
    });
  }

  // **Generate CSV Content & Trigger Download**
  if (csvRows.length > 0) {
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(row => row.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${tableType}_payroll_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    console.error("No data available for CSV export.");
  }
};


export const convertMonthToNumber = (monthName) => {
  const monthMap = {
    january: '01',
    february: '02',
    march: '03',
    april: '04',
    may: '05',
    june: '06',
    july: '07',
    august: '08',
    september: '09',
    october: '10',
    november: '11',
    december: '12',
  };

  return monthMap[monthName?.toLowerCase()] || '00'; // Return '00' if month name is not found
};


export const handleDownloadDocument = (file_path, document_name , downloadDocument) => {

  const formData = new FormData()
  formData.append('file_path', file_path)
  downloadDocument.mutate(formData, {
    onSuccess: (data) => {
      if (!(data instanceof Blob)) {
        console.error('Invalid blob data received');
        return;
      }


      // Download the file
      const blobUrl = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = document_name;
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(link);
      }, 100);
    },


  });
};
