import axiosClient from "./axiosClient";
import { ENDPOINTS } from "./endpoints";

// Thin request functions matching AuthController exactly:
//   POST /api/auth/signup -> SignupRequest { email, password } -> AuthResponse { token, email }
//   POST /api/auth/login  -> LoginRequest  { email, password } -> AuthResponse { token, email }
// These return the raw axios response; AuthContext is responsible for
// persisting the session and updating app state.
export function signupRequest({ email, password }) {
    return axiosClient.post(ENDPOINTS.AUTH.SIGNUP, { email, password });
}

export function loginRequest({ email, password }) {
    return axiosClient.post(ENDPOINTS.AUTH.LOGIN, { email, password });
}