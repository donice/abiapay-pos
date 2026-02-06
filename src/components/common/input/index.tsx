// components/common/Input.tsx
import React, { ReactNode, useState } from "react";
import "./style.scss";
import "./SearchableDropdown.scss";
import { TbCreditCard, TbEye, TbEyeOff, TbLockCheck } from "react-icons/tb";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { Controller, FieldError } from "react-hook-form";
import { LuAsterisk } from "react-icons/lu";

interface InputProps {
  disabled?: boolean;
  input_icon?: ReactNode;
  label: string;
  type?: "text" | "password" | "email" | "number" | "date" | "file";
  name: string;
  placeholder?: string;
  value?: string | number;
  onChange?: any;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  readOnly?: boolean;
  register?: any;
  validation?: any;
  error?: FieldError | undefined; // FieldError type from React Hook Form
}

export const TextInput: React.FC<InputProps> = ({
  input_icon,
  label,
  type = "text",
  name,
  placeholder = "",
  value,
  onChange,
  register,
  error,
  validation,
  ...rest
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const getErrorMessage = (error: FieldError | undefined): string => {
    if (!error) return "";

    switch (error.type) {
      case "required":
        return `${label} Field Required`;
      case "minLength":
        return "Length must be more";
      case "maxLength":
        return "Length must be less";
      default:
        return "";
    }
  };

  const errorMessage = error ? getErrorMessage(error) : "";

  return (
    <div className="input-container">
      <label htmlFor={name}>{label}</label>
      <span>
        <span className="input_icon">
          {input_icon ? (
            input_icon
          ) : type === "password" ? (
            <TbLockCheck />
          ) : type === "email" ? (
            <MdOutlineAlternateEmail />
          ) : (
            <TbCreditCard />
          )}
        </span>
      </span>
      <input
        type={type === "password" && showPassword ? "text" : type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...(register && register(name, validation))}
        {...rest}
      />
      {type === "password" && (
        <span onClick={handleTogglePassword} className="input_toggle_icon">
          {showPassword ? <TbEyeOff /> : <TbEye />}
        </span>
      )}
      {errorMessage && <span className="error">{errorMessage}</span>}
    </div>
  );
};

export const FormTextInput: React.FC<InputProps> = ({
  disabled,
  label,
  type,
  name,
  placeholder = "",
  value,
  onChange,
  onKeyDown,
  readOnly,
  register,
  error,
  validation,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const getErrorMessage = (error: FieldError | undefined): string => {
    if (!error) return "";

    if (error.message) {
      return error.message;
    }

    switch (error.type) {
      case "required":
        return `${label} Field Required`;
      case "minLength":
        return "Length must be more";
      case "maxLength":
        return "Length must be less";
      case "validate":
        return "Invalid value";
      default:
        return "";
    }
  };

  const errorMessage = error ? getErrorMessage(error) : "";
  return (
    <div className="form-input-container">
      <span>
        <label className="form-input_icon flex">
          {label}{" "}
          {validation?.required && <LuAsterisk className="text-red-600" />}
        </label>
      </span>
      <input
        type={type === "password" && showPassword ? "text" : type}
        name={name}
        placeholder={placeholder}
        value={value}
        readOnly={readOnly}
        disabled={disabled}
        onChange={onChange}
        className={`${error ? "errorinput" : ""}`}
        {...(register && register(name, validation))}
        {...rest}
      />
      <span></span>
      {type === "password" && (
        <span onClick={handleTogglePassword} className="form-input_toggle_icon">
          {showPassword ? <TbEyeOff /> : <TbEye />}
        </span>
      )}
      {errorMessage && <span className="error">{errorMessage}</span>}
    </div>
  );
};

interface Option {
  value: string;
  label: string;
}

interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectComponentProps {
  label: string;
  name: string;
  id: string;
  className?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  register?: any; // Add this line
  validation?: any; // Add this line
  error?: boolean;
  errorMessage?: string;
}

export const SelectInput: React.FC<SelectComponentProps> = ({
  label,
  name,
  id,
  className,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  disabled,
  register,
  validation,
  error,
  errorMessage = "Field Required",
}) => {
  return (
    <div className="select-container">
      <label htmlFor={id}>{label}</label>
      <select
        name={name}
        id={id}
        className={`${className} minimal`}
        value={value}
        disabled={disabled}
        onChange={onChange}
        {...(register && register(name, validation))}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options &&
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
      </select>
      {error && <span className="error">{errorMessage}</span>}
    </div>
  );
};



type SearchableDropdownProps = {
  name: string;
  label: string;
  options: Option[];
  control: any;
  placeholder?: string;
};

export const SelectSearchInput: React.FC<SearchableDropdownProps> = ({
  name,
  label,
  options,
  control,
  placeholder = "Search...",
}) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions =
    search.length > 0
      ? options.filter((option) =>
          option.label.toLowerCase().includes(search.toLowerCase())
        )
      : options; // Show all initially

  return (
    <div className="SearchableDropdown selectsearch-container">
      <label htmlFor={name} className="SearchableDropdown-label">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="SearchableDropdown-container">
            {/* Input Field (Mimics the Dropdown) */}
            <input
              type="text"
              placeholder={placeholder}
              value={search}
              onFocus={() => setIsOpen(true)}
              onChange={(e) => setSearch(e.target.value)}
              className="SearchableDropdown-input"
            />

            {/* Dropdown Menu */}
            {isOpen && (
              <ul className="SearchableDropdown-menu">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <li
                      key={option.value}
                      onClick={() => {
                        field.onChange(option.value);
                        setSearch(option.label); // Display selected value in input
                        setIsOpen(false); // Close dropdown
                      }}
                      className="SearchableDropdown-option"
                    >
                      {option.label}
                    </li>
                  ))
                ) : (
                  <li className="SearchableDropdown-option disabled">
                    No results found
                  </li>
                )}
              </ul>
            )}
          </div>
        )}
      />
    </div>
  );
};
