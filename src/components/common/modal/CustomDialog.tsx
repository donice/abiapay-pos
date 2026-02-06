import React from "react";
import { GrClose } from "react-icons/gr";

type PropsType = {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
};
const CustomDialog = (props: PropsType) => {
  return (
    <dialog id={props.id} className="relative p-8 rounded-lg shadow-lg w-[500px]">
      <div className="flex justify-end items-center">
        <span
          onClick={props.onClose}
          className="absolute right-3 bg-gray-100 text-gray-500 p-3 rounded-full cursor-pointer"
        >
          <GrClose />
        </span>
      </div>
      {props.children}
    </dialog>
  );
};

export default CustomDialog;
