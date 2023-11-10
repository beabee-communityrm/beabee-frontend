import { AppStepperStep } from './app-stepper-step';

export interface SetMfaSteps {
  qrCode: AppStepperStep;
  enterCode: AppStepperStep;
  result: AppStepperStep;
}
