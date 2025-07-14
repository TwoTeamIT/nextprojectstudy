import { API_URL } from "@/configs";
import { ApiInterceptor } from "./apiInterceptor";

const api = new ApiInterceptor(API_URL);

export default api;
