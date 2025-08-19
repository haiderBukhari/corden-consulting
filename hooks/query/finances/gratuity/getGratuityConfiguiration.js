import { useQuery } from "react-query";
import axios from "axios";

const fetchLoanDetails = async (id) => {
  try {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      throw new Error("No authentication token found.");
    }

    const response = await axios.get(
      `https://hr-backend-talo.com/api/gratuity-configurations/1`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data.gratuity;
    } else {
      throw new Error("Failed to fetch gratuity  details.");
    }
  } catch (error) {
    console.log("Failed to fetch user gratuity details.", error);
  }
};

export const getGratuityConfiguration = (id) => {
  return useQuery(["GratuityConfiguration"], () => fetchLoanDetails(), {
   
  });
};
