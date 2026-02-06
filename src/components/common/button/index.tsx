"use client";
import React from "react";
import { MdOutlineAdd, MdOutlineArrowBackIos } from "react-icons/md";
import { useRouter } from "next/navigation";
import Loader from "../loader";
import "./style.scss";

interface prop {
  text: string;
  link?: string;
  disabled?: boolean;
  addIcon?: boolean;
  onClick?: any;
}

export const FormButton = ({
  text,
  disabled,
  loading,
}: {
  text: string;
  disabled: true | false;
  loading: true | false;
}) => {
  const router = useRouter();

  return (
    <button
      className={`button ${disabled ? "disabled" : "primary"}`}
      disabled={disabled}
    >
      {text}
      {loading && <Loader />}
    </button>
  );
};

export const DefaultButton = ({ text, link, disabled }: prop) => {
  const router = useRouter();

  const handleClick = (route: string) => {
    if (!disabled) {
      router.push(route);
    }
  };

  return (
    <button
      className={`button ${disabled ? "disabled" : "primary"}`}
      disabled={disabled}
      onClick={() => link && handleClick(link)}
    >
      {text}
    </button>
  );
};

interface ButtonProps {
  text: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children?: JSX.Element | JSX.Element[];
}

export const Button = ({
  text,
  disabled,
  onClick,
  loading,
  children,
}: ButtonProps) => {
  const router = useRouter();


  return (
    <button
      className={`button ${disabled ? "disabled" : "primary"}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children} {text}
      {loading && <Loader />}
    </button>
  );
};
export const CancelButton = ({ link }: { link: string }) => {
  const router = useRouter();

  const handleClick = (route: string) => {
    return router.push(route);
  };

  return (
    <div className="button secondary" onClick={() => handleClick(link)}>
      Cancel
    </div>
  );
};

export const BackButton = ({ link }: { link: string }) => {
  const router = useRouter();

  const handleClick = (route: string) => {
    return router.push(route);
  };

  return (
    <div className="button secondary" onClick={() => handleClick(link)}>
      Go Back
    </div>
  );
};

export const PrimaryButton = ({ text, link, addIcon }: prop) => {
  const router = useRouter();

  const handleClick = (route: string) => {
    return router.push(route);
  };

  return (
    <button className="button primary" onClick={() => link && handleClick(link)}>
      {addIcon && <MdOutlineAdd className="icon" />}
      {text}
    </button>
  );
};

export const SecondaryButton = ({ text, link, onClick }: prop) => {
  const router = useRouter();

  const handleClick = (route: string) => {
    return router.push(route);
  };

  return (
    <button
      type="button"
      className="button secondary"
      onClick={() => {
        if (onClick) {
          onClick();
        } else if (link) {
          handleClick(link);
        }
      }}
    >
      <MdOutlineAdd className="icon" />
      {text}
    </button>
  );
};


export const GoBackButton = () => {
  const router = useRouter();
  const handleClick = () => {
    return router.back();
  };
  return (
    <button className="go_back" onClick={() => handleClick()}>
      <MdOutlineArrowBackIos className="icon" />
      Go Back
    </button>
  );
};
