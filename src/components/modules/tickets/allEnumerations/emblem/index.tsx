"use client";
import { CustomHeader } from "@/src/components/common/header";
import React, { useState } from "react";
import CreateEmblemForm from "./form";
import { useRouter } from "next/navigation";
import { EmblemModal } from "@/src/components/common/modal";

const TransportEmblemComponent = () => {
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
        title="Transport Emblem"
        desc="Create Transport Emblem"
      />

      <CreateEmblemForm setShow={setShow} />
      {show.mode && (
        <EmblemModal
          maintext={show.message}
          exp_date={show.expiry_date}
          payment_ref={show.payment_ref}
          button_text="Done"
          onClick={() => {
            router.push("/tickets");
          }}
        />
      )}
    </div>
  );
};

export default TransportEmblemComponent;
