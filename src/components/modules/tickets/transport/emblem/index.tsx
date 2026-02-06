"use client";
import { CustomHeader } from "@/src/components/common/header";
import React, { useState } from "react";
import CreateEmblemForm from "./form";
import { useRouter } from "next/navigation";
import { EmblemModal } from "@/src/components/common/modal";
import { GoBackButton } from "@/src/components/common/button";

const TransportEmblemComponent = () => {
  const router = useRouter();
  const [show, setShow] = useState({
    mode: false,
    message: "",
    expiry_date: "",
    payment_ref: "",
    plate_no: "",
  });

  return (
    <div>
      <GoBackButton />
      <CustomHeader
        title="Transport Emblem"
        desc="Create Transport Emblem"
      />

      <CreateEmblemForm setShow={setShow}show={show} />
      {show.mode && (
        <EmblemModal
          maintext={show.message}
          exp_date={show.expiry_date}
          payment_ref={show.payment_ref}
          button_text="View Receipt"
          onClick={() => {
            router.push(`/tickets/transport/emblem/summary?payment_ref=${show.payment_ref}`);
          }}
        />
      )}
    </div>
  );
};

export default TransportEmblemComponent;
