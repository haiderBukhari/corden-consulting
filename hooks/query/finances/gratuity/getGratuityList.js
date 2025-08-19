import { useQuery } from "react-query";
import axios from "axios";

const fetchLoanDetails = async (id) => {
  try {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      throw new Error("No authentication token found.");
    }

    const response = await axios.get(
      `https://hr-backend-talo.com/api/getLoanDetails/${id}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data.response;
    } else {
      throw new Error("Failed to fetch gratuity  details.");
    }
  } catch (error) {
    console.log("Failed to fetch user gratuity details.", error);
  }
};

export const getGratuityList = (id) => {
  return useQuery(["Gratuity"], () => fetchLoanDetails(id), {
    enabled: !!id, 
  });
};
