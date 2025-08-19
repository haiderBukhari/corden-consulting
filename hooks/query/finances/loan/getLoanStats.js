import { useQuery } from "react-query";
import axios from "axios";

const fetchLoanDetails = async (id) => {
  try {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      throw new Error("No authentication token found.");
    }

    const response = await axios.get(
      `https://hr-backend-talo.com/api/get-loan-stats`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data.stats;
    } else {
      throw new Error("Failed to fetch user loan details.");
    }
  } catch (error) {
    console.log("Failed to fetch user loan details.", error);
  }
};

export const getLoanStats = () => {
    return useQuery("LoanStats", () => fetchLoanDetails());
};
