import axiosClient from "./axiosClient";
import { ENDPOINTS } from "./endpoints";

// Thin request function matching ProfileController exactly:
//   POST /api/profile/link -> LinkProfileRequest { leetcodeUsername } -> ProfileSnapshotResponse
// Returns the raw axios response; callers unwrap .data as needed.
export function linkProfileRequest({ leetcodeUsername }) {
  return axiosClient.post(ENDPOINTS.PROFILE.LINK, { leetcodeUsername });
}