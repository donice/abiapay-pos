"use client";
import { CustomHeader } from "@/src/components/common/header";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { OffloadingModal } from "@/src/components/common/modal";
import LoadingOffLoadingForm from "./form";

const LoadingOffLoadingPageComponent = () => {
  const router = useRouter();
  const [show, setShow] = useState({
    mode: false,
    message: "",
    expiry_date: "",
    payment_ref: "",
  });
  return (
    <div>
      <CustomHeader
        title="Transport Loading & Offloading"
        desc="Register Loading & Offloading Vehicles"
      />

      <LoadingOffLoadingForm setShow={setShow} />
      {show.mode && (
        <OffloadingModal
          maintext={show.message}
          payment_ref={show.payment_ref}
          button_text="Completed"
          onClick={() => {
            router.push("/tickets");
          }}
        />
      )}
    </div>
  );
};

export default LoadingOffLoadingPageComponent;
