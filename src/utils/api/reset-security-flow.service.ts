import axios from '@lib/axios';
import env from '../../env';

import { RESET_SECURITY_FLOW_TYPE } from '@enums/reset-security-flow-type';

/**
 * Service for handling reset password and reset device flows.
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
    await axios.post('reset-password', {
      email,
      resetUrl: this.appUrl + '/auth/reset-password',
    });
  }

  /**
   * Completes the reset password flow.
   * This is mostly used if the user has clicked the link in the email.
   * @param password
   * @param resetPasswordFlowId
   */
  public async resetPasswordComplete(
    password: string,
    resetPasswordFlowId: string
  ): Promise<void> {
    await axios.put(`reset-password/${resetPasswordFlowId}`, {
      password,
    });
  }

  async resetDeviceBegin(email: string): Promise<void> {
    await axios.post('reset-device', {
      email,
      resetUrl: this.appUrl + '/auth/reset-device',
      type: RESET_SECURITY_FLOW_TYPE.TOTP,
    });
  }

  async resetDeviceComplete(
    password: string,
    resetMfaFlowId: string
  ): Promise<void> {
    await axios.put(`reset-device/${resetMfaFlowId}`, { password });
  }
}

export default new ResetSecurityFlowService();
