"use client";

import { Button, GoBackButton } from "@/src/components/common/button";
import Empty from "@/src/components/common/empty";
import { CustomHeader } from "@/src/components/common/header";
import { FormTextInput, SelectInput } from "@/src/components/common/input";
import {
  createDemandNotice,
  createDemandNoticePayload,
  fetchBusinessAbssin,
  fetchBusinessAbssinPayload,
  generateDemandNoticePayload,
} from "@/src/services/demandNotice";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import "./style.scss";
import { SuccessModal } from "@/src/components/common/modal";

const CreateDemandNoticeComponent = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<fetchBusinessAbssinPayload>({
    defaultValues: {
      state_id: "",
    },
  });

  const router = useRouter();

 
  const [displayDetails, setDisplayDetails] = React.useState<any | null>(null);
   const [show, setShow] = useState(false);
   const [loading, setLoading] = useState(false);
   const [noticeNumber, setNoticeNumber] = useState("");


  const onSubmit = async (formData: any) => {
    setLoading(true);
    console.log("formData", formData);
    const requestBody = {
      state_id: formData.stateID,
    };

    try {
      const response = await fetchBusinessAbssin(requestBody);
      console.log("response", response.data);
      setDisplayDetails(response.data);
      toast.success("Business ABSSIN fetched successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch Business ABSSIN");
    }
    finally {
      setLoading(false); 
    }
  };

  const handleGenerateDemandNotice = async () => {
    if (!displayDetails || !displayDetails.length) {
      toast.error("No ABSSIN details available.");
      return;
    }
  
    const payload: createDemandNoticePayload = {
        taxpayer_id: [
          {
            id: displayDetails[0].state_id,
          },
        ],
        cdn_category_id: displayDetails[0].cdn_category_id,
        fiscal_year: "2025",
        createdby: displayDetails[0].createtime,
      };
      
  
    try {
      const response = await createDemandNotice(payload);
      console.log("response", response.data.notice_number);
      setNoticeNumber(response.data.notice_number);
      toast.success(response.message || "Demand notice generated successfully");
      setShow(true)
    //   router.push("/notices");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate demand notice");
    }
  };
  
  return (
    <div>
      <GoBackButton />
      <section>
        <div className="">
          <header className="verify-tickets-comp_header">
            <CustomHeader title="Generate New Notice" desc="" />
          </header>
        </div>

       
        <div className="find-comp-form ">
        <form onSubmit={handleSubmit(onSubmit)} className="verify-tickets-form mb-4" >
          <FormTextInput
            label="ABSSIN"
            type="text"
            name="stateID" 
            placeholder="Enter Corporate ABSSIN"
            register={register}
            validation={{
              required: true,
              minLength: {
                value: 7,
                message: "Length must be above 7 characters",
              },
            }}
            error={errors.state_id} 
          />
          <div className="mt-4"> 
          <Button
            text="Verify ABSSIN"
            loading={loading}
          />
          </div>
         
        </form>

               <div className="main-table">
               {displayDetails && displayDetails.length ? (
                <div className="">
            <div className="main-table_form_tickets_container">
              <div className="tickets">
                {displayDetails.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="ticket"
                    
                  >
                    <div>
                    <p>{item.coy_name}</p>
                    <p>{item.phone_no}</p>
                      <p>{item.street}</p>
                    </div>
                    <div>
                    <p>{item.type_of_organisation}</p>
                    <p>{item.sector}</p>
                    <p>{item.tax_office}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

<div className="generate-notice-button" style={{ marginTop: "1rem" }}>
<Button
  text="Generate Demand Notice"
  onClick={handleGenerateDemandNotice}
/>
</div>
</div>
          ) : displayDetails ? (
            <Empty text="No Plate Number Found" />
          ) : null}


               </div>

             
            </div>

            {show && (
                    <SuccessModal
                    text="Demand Notice Generated"
                    maintext="Demand Notice Generated Successfully"
                      // link="/demand-notices/create"
                      id={`Notice Number: ${noticeNumber}`}
                      onClick={() => {
                        setShow(false); 
                        router.push("/demand-notices/create"); 
                      }}
                    />
                  )}
      </section>
    </div>
  );
};

export default CreateDemandNoticeComponent;
