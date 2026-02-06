"use client";
import { usePathname, useRouter } from "next/navigation";
import { getLastPathSegment } from "@/src/utils/getLastPathSegment";
import React, { useEffect, useState } from "react";
import { Button } from "@/src/components/common/button";
import "./style.scss";
import { fetchLGAData } from "@/src/services/common";

const Dynamic = () => {
  const router = useRouter();
  const path = usePathname();
  const segment = getLastPathSegment(path);

  
  const fetchedData = sessionStorage.getItem("TICKETS_DATA");
  const data = fetchedData ? JSON.parse(fetchedData) : [];
  const ticket = data?.find((ticket: any) => ticket.PlateNumber == segment);
  const [lga, setLga] = useState<{ lgaID: number; lgaName: string }[]>([]);
  const [matchedLga, setMatchedLga] = useState<string>();

  
  useEffect(() => {
    const getLgas = async () => {
      try {
        const response = await fetchLGAData();
        const formattedLga = response.data.map((ia: any) => ({
          lgaID: ia.lgaID,
          lgaName: ia.lgaName,
        }));
        setLga(formattedLga);
      } catch (error: any) {
        console.error("Error fetching LGA data:", error);
      }
    };
  
    getLgas();
  }, []); 
  
  useEffect(() => {
   
      const matchedLGA = lga.find((ia) => ia.lgaID.toString() === ticket?.Location);
      if (matchedLGA) {
        console.log("matchedLGA", matchedLGA.lgaName);
        setMatchedLga(matchedLGA.lgaName);
      } else {
        console.log("No matching LGA found");
      }
      
  }, [lga, ticket]); 

  return (
    <div className="ticket-details">
      <h1>Enumeration Details</h1>
      <div className="ticket-details_comp">
        <div>
          <p>Enumeration ID</p>
          <p>{ticket?.EnumerationID || "N/A"}</p>
        </div>
        <div>
          <p>Taxpayer ID</p>
          <p>{ticket?.TaxpayerID || "N/A"}</p>
        </div>
        <div>
          <p>Taxpayer Name</p>
          <p>{ticket?.TaxpayerName || "N/A"}</p>
        </div>
        <div>
          <p>Plate Number</p>
          <p>{ticket?.PlateNumber?.toUpperCase() || "N/A"}</p>
        </div>
        <div>
          <p>Revenue Year</p>
          <p>{ticket?.RevenueYear || "N/A"}</p>
        </div>
        <div>
          <p>Location</p>
          <p>{matchedLga}</p>
        </div>
        <div>
          <p>Income Category</p>
          <p>{ticket?.IncomeCategory || "N/A"}</p>
        </div>
        <div>
          <p>Monthly Income</p>
          <p>{ticket?.MonthlyIncome || "N/A"}</p>
        </div>
        <div>
          <p>Daily Levy</p>
          <p>{ticket?.IncomeAmount || "N/A"}</p>
        </div>
        <div>
          <p>Status</p>
          <p>{ticket?.Status || "N/A"}</p>
        </div>
        <div>
          <p>Created By</p>
          <p>{ticket?.CreatedBy || "N/A"}</p>
        </div>
        <div>
          <p>Creation Time</p>
          <p>{ticket?.CreateTime ? new Date(ticket.CreateTime).toLocaleString() : "N/A"}</p>
        </div>
      </div>
      <Button text={"Back"} onClick={() => router.back()} />
    </div>
  );
};

export default Dynamic;
