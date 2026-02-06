"use client";
import { CustomHeader } from "@/src/components/common/header";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FlyingRevenue } from "@/src/components/common/modal";
import FlyingRevenueForm from "./form";
import { haulages } from "./lib/haulages";
import { GoBackButton } from "@/src/components/common/button";

const FlyingRevenueComponent = ({ slug }: { slug: string }) => {
  const router = useRouter();
  const [show, setShow] = useState({
    mode: false,
    message: "",
    expiry_date: "",
    payment_ref: "",
  });

  const haulageItem = haulages.find(item => item.name.includes(slug));

  return (
    <div>
      <GoBackButton />
      <CustomHeader
        title={haulageItem ? `${haulageItem.title} Flying Revenue`  : ""}
        desc="Haulage Tickets"
      />

      <FlyingRevenueForm slug={slug} setShow={setShow} />
      {show.mode && (
        <FlyingRevenue
          maintext={show.message}
          payment_ref={show.payment_ref}
          button_text="Completed"
          onClick={() => {
            router.push("/tickets/transport/flying-revenue");
          }}
        />
      )}
    </div>
  );
};

export default FlyingRevenueComponent;
