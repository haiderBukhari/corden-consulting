import { useQuery } from "react-query";
import axios from "axios";

const fetchUserLoanList = async (id) => {
  try {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      throw new Error("No authentication token found.");
    }

    const response = await axios.get(
      `https://hr-backend-talo.com/api/getUserLoanList`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data.response;
    } else {
      throw new Error("Failed to fetch user loan list.");
    }
  } catch (error) {
    console.log("Failed to fetch user loan list.", error);
  }
};

export const getUserLoansList = (id) => {
  return useQuery("UserLoanList", () => fetchUserLoanList(id));
};
