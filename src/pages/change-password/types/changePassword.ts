export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface VerifyPasswordOtpRequest {
  otp: string;
}
