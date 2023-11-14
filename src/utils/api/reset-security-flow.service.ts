import axios from '@lib/axios';
import env from '@env';

import { RESET_SECURITY_FLOW_TYPE } from '@enums/reset-security-flow-type';

import type {
  CreateResetPasswordData,
  UpdateResetPasswordData,
  CreateResetDeviceData,
  UpdateResetDeviceData,
} from '@type';

/**
 * Service for handling reset password and reset device flows.
 *
 * This is the service that is used by the reset password and reset device pages.
 * This service is oriented on the server side `ResetSecurityFlowService`.
 */
class ResetSecurityFlowService {
  appUrl = env.appUrl;

  /**
   * Starts the reset password flow.
   * This is mostly used if the user has clicked on the forgot password the link on the login page.
   * @param email The email of the user.
   */
  public async resetPasswordBegin(email: string): Promise<void> {
    const data: CreateResetPasswordData = {
      email,
      resetUrl: this.appUrl + '/auth/reset-password',
    };
    await axios.post('reset-password', data);
  }

  /**
   * Completes the reset password flow.
   * This is mostly used if the user has clicked the link in the email.
   * @param password The new password.
   * @param resetPasswordFlowId The id of the reset password flow.
   */
  public async resetPasswordComplete(
    resetPasswordFlowId: string,
    password: string,
    token?: string
  ): Promise<void> {
    const data: UpdateResetPasswordData = {
      password,
      token,
    };
    await axios.put(`reset-password/${resetPasswordFlowId}`, data);
  }

  /**
   * Starts the reset device flow.
   * This is mostly used if the user has clicked on the lost device the link on the login page.
   * @param email The email of the user.
   */
  public async resetDeviceBegin(email: string): Promise<void> {
    const data: CreateResetDeviceData = {
      email,
      resetUrl: this.appUrl + '/auth/reset-device',
      type: RESET_SECURITY_FLOW_TYPE.TOTP,
    };
    await axios.post('reset-device', data);
  }

  /**
   * Completes the reset device flow.
   * This is mostly used if the user has clicked the link in the email.
   * @param resetMfaFlowId The id of the reset device flow.
   * @param password The old password of the user for verification.
   */
  public async resetDeviceComplete(
    resetMfaFlowId: string,
    password: string
  ): Promise<void> {
    const data: UpdateResetDeviceData = {
      password,
      type: RESET_SECURITY_FLOW_TYPE.TOTP,
    };
    await axios.put(`reset-device/${resetMfaFlowId}`, data);
  }
}

export default new ResetSecurityFlowService();
