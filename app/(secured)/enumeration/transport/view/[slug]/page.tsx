"use client";
import { SecondaryButton, PrimaryButton, GoBackButton } from "@/src/components/common/button";
import { AbiaEnumerationLarge } from "@/src/components/common/Images";
import QRCode from "react-qr-code";
import { fetchCompletedTransportEnumeration } from "@/src/services/transportEnumerationService";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/app/(secured)/loading";
import { useEffect, useState } from "react";
import "./style.scss";

interface EnumData {
  EnumerationID: string;
  assetCode: string;
  TaxpayerName: string;
  PlateNumber: string;
  Category: string;
  QrLink?: string; // Optional since it might not always be present
}

const ViewEnumeration = ({ params }: { params: { slug: string } }) => {
  const [enumData, setEnumData] = useState<EnumData | null>(null);
  const { data, isLoading, error } = useQuery({
    queryKey: ["fetchedCompletedTransportEnumeration", params.slug],
    queryFn: fetchCompletedTransportEnumeration,
  });

  useEffect(() => {
    if (data) {
      console.log("Full data object:", data);
      const filteredData = data?.data?.find(
        (item: any) => item?.EnumerationID === params?.slug
      );
      console.log("Filtered Data:", filteredData);
      setEnumData(filteredData || null);
    }
  }, [data, params.slug]);

  if (isLoading) {
    return (
      <div className="loading">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  if (!enumData) {
    return <div>No data found</div>;
  }

  return (
    <div className="">
      <GoBackButton  />
      <div className="modal" id="enumeration_modal">
        <AbiaEnumerationLarge />
        <div className="modalHeader">
          <h1>ABIA STATE GOVERNMENT</h1>
          <h2>MINISTRY OF TRANSPORT</h2>
          <h3>ENUMERATION</h3>
        </div>
        <div className="modalContentEnum"></div>
        <div className="modalContentEnumContent">
          <p className="assetCode">{enumData.assetCode}</p>
          {/* <p className="taxpayer_name">{enumData.TaxpayerName}</p> */}
          <div className="custom_vehicle_details">
            <p className="vehicle_cat">{enumData.Category}</p>

            <div className="qr_container">
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={enumData.QrLink || "No QR data available"}
                viewBox={`0 0 256 256`}
              />
            </div>
<p className="vehicle_type">{enumData.Category}</p>

          </div>

          <div>
          <p className="abssin_no">{enumData.EnumerationID}</p>
            <span className="plate_number_title">PLATE NUMBER</span>
            <p className="plate_number">{enumData.PlateNumber}</p>
          </div>
        </div>
        <div className="btn-container">
          <SecondaryButton text="Create New" link="/enumeration" />
          <PrimaryButton text="Done" link="/dashboard" />
        </div>
      </div>
    </div>
  );
};

export default ViewEnumeration;
