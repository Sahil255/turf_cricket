import { ApplicationVerifier } from 'firebase/auth';

declare global {
  interface Window {
    recaptchaVerifier: ApplicationVerifier;
    // The recaptchaWidgetId is often also added to the window object.
    recaptchaWidgetId: string | number;
  }
}