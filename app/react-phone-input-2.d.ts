declare module 'react-phone-input-2' {
  import React from 'react';

  interface CountryData {
    name: string;
    dialCode: string;
    countryCode: string;
    format: string;
  }

  interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    country?: string;
    value?: string;
    placeholder?: string;
    onChange?: (
      value: string,
      data: CountryData,
      event: React.ChangeEvent<HTMLInputElement>,
      formattedValue: string,
    ) => void;
    onFocus?: (
      event: React.FocusEvent<HTMLInputElement>,
      data: CountryData,
    ) => void;
    onBlur?: (
      event: React.FocusEvent<HTMLInputElement>,
      data: CountryData,
    ) => void;
    // Add other props as needed based on the library's documentation
    inputProps?: object;
    containerClass?: string;
    inputClass?: string;
     onlyCountries?: string[]; // Add this line
     disableCountryCode?:boolean;
     disableDropdown?:boolean;
  }

  const PhoneInput: React.FC<PhoneInputProps>;
  export default PhoneInput;
}
