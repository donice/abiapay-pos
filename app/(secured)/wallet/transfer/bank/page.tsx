"use client";
import React from "react";
import { Button } from "@/src/components/common/button";
import "./style.scss";
import { CustomHeader } from "@/src/components/common/header";
import { useRouter } from "next/navigation";

const Dynamic = () => {
  const router = useRouter();

  return (
    <>
      {" "}
      <CustomHeader
        title={"Transfer to other banks"}
        desc={"Select your preferred bank"}
      />

        <div className="bank">

          <div className="bank_cta">
            {/* <div className="bank_cta_info">
              <p>
                Payout requests will be activated when your current earnings are
                N100, and above
              </p>
            </div> */}
            <Button
              text={"Fidelity Bank Transfer"}
              onClick={() => {
                router.push("/wallet/transfer/bank/fidelity");
              }}
            />
            <Button
              text={"Access Bank Transfer"}
              onClick={() => {
                router.push("/wallet/transfer/bank/access");
              }}
            />
          </div>
        </div>
    </>
  );
};

export default Dynamic;
