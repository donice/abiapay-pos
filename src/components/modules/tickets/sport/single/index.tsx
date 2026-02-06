"use client";
import { CustomHeader } from "@/src/components/common/header";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SportModal } from "@/src/components/common/modal";
import Form from "./form";


const SingleSportTicketsComponent = ({category}: {category: string}) => {
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
        title={`${category === "abian" ? "Abian" : "Guest"} Sport Tickets`}
        desc="Create Sport Tickets"
      />

      <Form setShow={setShow} category={category}/>
      {show.mode && (
        <SportModal
          maintext={show.message}
          payment_ref={show.payment_ref}
          button_text="Completed"
          onClick={() => {
            router.push("/tickets/sport");
          }}
        />
      )}
    </div>
  );
};

export default SingleSportTicketsComponent;
