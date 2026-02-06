"use client";
import ViewTransportEmblemReceipt from "@/src/components/modules/tickets/transport/emblem/view";
import { redirect, useSearchParams } from "next/navigation";
import React from "react";

const EmblemReceiptPage = ({ params }: { params: { id: string } }) => {
  if(params.id == "view") {
    redirect("/tickets/transport/emblem/view");
  }
  const querySearch = useSearchParams();
  const payment_ref = querySearch.get("payment_ref") || "";

  return (
    <div>
      <ViewTransportEmblemReceipt
        plate_no={params.id}
        payment_ref={payment_ref}
      />
    </div>
  );
};

export default EmblemReceiptPage;
