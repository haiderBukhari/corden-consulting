import { useQuery } from "react-query";
import axios from "axios";

const getUpcomingPayroll = async (id) => {
  try {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      throw new Error("No authentication token found.");
    }

    const response = await axios.get(
      `https://hr-backend-talo.com/api/upcoming/payroll/history/${id}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data.upcoming_payroll_history;
    } else {
      throw new Error("Failed to fetch upcoming payroll.");
    }
  } catch (error) {
    console.log("Failed to fetch fetch upcoming payroll.", error);
  }
};

export const UseGetUpcomingPayroll = (id) => {
  return useQuery(["UpcomingPayroll", id], () => getUpcomingPayroll(id), {
    enabled: !!id,
  });
};
