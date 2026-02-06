"use client";
import { useRouter } from "next/navigation";
import { FcBinoculars } from "react-icons/fc";
import "./style.scss";
import React from "react";

const Unauthorized = ({ text, link }: { text?: string; link?: string }) => {
  const router = useRouter();
  return (
    <div className="unauthorized">
      <div className="unauthorized-comp">
        <div className="unauthorized-comp_icon">
          <FcBinoculars />
        </div>
        <div className="unauthorized-comp_text">{text ? text : "No data"}</div>
      </div>
      {link && <div className="unauthorized-comp_button">
        <button
          className="secondary button"
          onClick={() => router.push(link)}
        >
          Create
        </button>
      </div>}
    </div>
  );
};

export default Unauthorized;
