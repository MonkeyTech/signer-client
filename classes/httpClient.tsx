import axios from "axios";

class HttpClient {
  axios = axios.create({});

  constructor() {
    this.axios.defaults.baseURL = "http://localhost:3000/api/v1";
  }

  GetPDF = async () => {
    const res = await this.axios.post(`/signature`);
    return res;
  };

//   rateExpert = async (id: string, rating: string) => {
//     try {
//       const res = await this.axios.post(`/experts/${id}/reviews`, { rating });
//       return res;
//     } catch (err) {
//       console.log("err:", err);
//     }
//   };
}

const httpClient = new HttpClient();
export default httpClient;
