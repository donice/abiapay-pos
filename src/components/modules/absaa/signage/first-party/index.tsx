"use client";
import React, { useState } from "react";
import { CustomHeader } from "@/src/components/common/header";
import "./style.scss";
import { GoBackButton } from "@/src/components/common/button";
import CreateFirstPartySignageForm from "./form";
import { SuccessModal } from "@/src/components/common/modal";

const FirsPartySignageComponent = () => {
  const [show, setShow] = useState(false);
  const [paymentRef, setPaymentRef] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  return (
    <section className="firstparty_add">
      <GoBackButton />
      <div className="firstparty-comp">
        <header className="firstparty_add-comp_header">
          <CustomHeader
            title="First Party Signage"
            desc="Create first party signage"
          />
        </header>

        <div className="firstparty-comp_form">
          <CreateFirstPartySignageForm
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

export default FirsPartySignageComponent;
