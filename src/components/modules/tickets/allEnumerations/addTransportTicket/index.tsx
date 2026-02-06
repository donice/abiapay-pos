"use client";
import React, { useState } from "react";
import { CustomHeader } from "@/src/components/common/header";
import "./style.scss";
import { GoBackButton } from "@/src/components/common/button";
import AddTransportTicketForm from "./form";
import { SuccessModal } from "@/src/components/common/modal";

const AddTransportTicketComponent = () => {
  const [show, setShow] = useState(false);
  const [paymentRef, setPaymentRef] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  return (
    <section className="transport_add">
      <GoBackButton />
      <div className="transport-comp">
        <header className="transport_add-comp_header">
          <CustomHeader
            title="Add Transport Ticket"
            desc="Create Transport Ticket"
          />
        </header>

        <div className="transport-comp_form">
          <AddTransportTicketForm
            show={show}
            setShow={setShow}
            paymentRef={paymentRef}
            setPaymentRef={setPaymentRef}
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={setSelectedPeriod}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
          />
        </div>
      </div>

      {show && (
        <SuccessModal
          text="View Receipt"
          link="/tickets/transport/add/summary"
          id={`Ref: ${paymentRef}, Valid for: ${selectedPeriod}, Payment for: ${selectedProduct}`}
          buttonText="Done"
        />
      )}
    </section>
  );
};

export default AddTransportTicketComponent;
