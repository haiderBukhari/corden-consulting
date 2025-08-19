import { useQuery } from "react-query";
import axios from "axios";

const fetchManagerLoanList = async () => {
  try {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      throw new Error("No authentication token found.");
    }

    const response = await axios.get(
      `https://hr-backend-talo.com/api/getManagerLoanList`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data.response;
    } else {
      throw new Error("Failed to fetch manager loan list.");
    }
  } catch (error) {
    console.log("Failed to fetch manager loan list.", error);
  }
};

export const getAllManagerLoansList = () => {
  return useQuery("AllManagerLoanList", () =>
    fetchManagerLoanList()
  );
};
