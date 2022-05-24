import axios from "axios";

class HttpClient {
  axios = axios.create({});

  constructor() {
    this.axios.defaults.baseURL =
      "https://madlanx-signer-server.herokuapp.com/api/v1";
  }

  GetPDF = async (token: string) => {
    const res = await this.axios.get(`/signatures`,{
      headers: {
        'x-token': token,
      },
    });
    return res.data.data;
  };

  // presignedURL  = async () => {
  //   const res = await this.axios.post(`/signatures/presigned_urls`)
  //   return res.data.data;
  // };
}

const httpClient = new HttpClient();
export default httpClient;
