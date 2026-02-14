"use client";
import { CustomFormHeader } from "@/src/components/common/header";
import LargeLoader from "@/src/components/common/loader";
import { getIndividualABSSINs } from "@/src/services/identityService";
import { transformStringWithUnderscores } from "@/src/utils/transformStringWithUnderscores";
import { useQuery } from "react-query";
import React, { useEffect, useState } from "react";
import { TbUser } from "react-icons/tb";
import "./style.scss";
import { isBrowser } from "@/src/utils/isBrowser";

const DyamicView = ({ id }: { id: string }) => {
  const [abssinView, setAbssinView] = useState<Record<string, any> | null>(
    null
  );
  const [usersData, setUsersData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("profile");

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toISOString().split("T")[0];
  };
  const { data, isLoading } = useQuery({
    queryKey: ["ticketsWalletData"],
    queryFn: getIndividualABSSINs,
  });

   const [userData, setUserData] = useState<{
    name?: string;
    user_cat?: string;
    mda_name?: string;
    mda?: string;
  } | null>(null);

  useEffect(() => {
    if (isBrowser) {
      const data = window.sessionStorage.getItem("USER_DATA");
      if (data) {
        try {
          setUserData(JSON.parse(data));
        } catch (e) {
          console.error("Error parsing JSON data:", e);
          setUserData({});
        }
      }
    }
  }, []);

  useEffect(() => {
    if (data) {
      console.log("user data:", data);
      const res = data?.data;
      setUsersData(res);
      const abssin = res.find((item: any) => item.state_id === id);
      if (abssin) {
        const nonNullFields = Object.entries(abssin)
          .filter(([_, value]) => value !== null)
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
        setAbssinView(nonNullFields);
      }
    }
  }, [data, id]);

 const tabs = [
  { label: "Profile", key: "profile" },
  { label: "Demand Notices", key: "demandNotices" },
  ...(userData?.user_cat === "MdaUser"
    ? [{ label: "Bills", key: "bills" }]
    : []),
];

  return isLoading ? (
    <div className="flex justify-center items-center h-screen">
      <LargeLoader />
    </div>
  ) : abssinView ? (
    <div className="rounded-lg items-center flex flex-col">
      {/* Page Header */}
      <CustomFormHeader
        title="Individual ABSSIN Details"
        desc={`View all details associated with ${id}`}
      />

      {/* Card Section - Displays User Data */}
      <div className="card">
        <div className="overlay" />
        <div className="content">
          <div className="header">
            <div></div>
            <div className="title">
              <p>
                {abssinView?.surname}
                {" "}
                {abssinView?.first_name}
              </p>
              <p className="abssin">ABSSIN: {abssinView?.state_id || "N/A"}</p>
            </div>
            <img
              className="logo"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Seal_of_the_Senate_of_Nigeria.svg/900px-Seal_of_the_Senate_of_Nigeria.svg.png"
              alt="Seal"
            />
          </div>
          <div className="body">
            <p style={{ fontSize: 18 }}>Basic Information</p>
            <hr />
            <table>
              <tbody>
                <tr>
                  <td>
                    <p style={{ fontWeight: 500, color: "black" }}>Status</p>
                    <p>{abssinView?.status || "N/A"}</p>

                    <p style={{ fontWeight: 500, color: "black" }}>Birth Date</p>
                    <p >{abssinView?.birth_date || "N/A"}</p>

                    <p style={{ fontWeight: 500, color: "black" }}>Email</p>
                    <p>{abssinView?.email || "N/A"}</p>
                  </td>

                  <td>
                    <p style={{ fontWeight: 500, color: "black" }}>Mobile</p>
                    <p>{abssinView?.mobile || "N/A"}</p>

                    <p style={{ fontWeight: 500, color: "black" }}>Marital Status</p>
                    <p>{abssinView?.marital_status || "N/A"}</p>
                  </td>

                  <td>
                    <p style={{ fontWeight: 500, color: "black" }}>Gender</p>
                    <p>{abssinView?.gender || "N/A"}</p>

                    <p style={{ fontWeight: 500, color: "black" }}>Birth Place</p>
                    <p>{abssinView?.birth_place || "N/A"}</p>

                    <p style={{ fontWeight: 500, color: "black" }}>Date Created</p>
                    <p>{formatDate(abssinView?.createtime || "N/A")}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
     {/* Tab Content */}
<div className="tab-content">
  {activeTab === "profile" && (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(abssinView).map(([key, value]) => (
        <div
          key={key}
          className="py-4 bg-white rounded-lg shadow-sm flex items-center justify-between border-b-2 border-dashed border-gray-100 p-4"
        >
          <p className="text-sm font-medium text-gray-600">
            {transformStringWithUnderscores(key)}
          </p>
          <p className="text-sm font-semibold text-gray-800">{value}</p>
        </div>
      ))}
    </div>
  )}

  {activeTab === "demandNotices" && (
    <div className="text-gray-600 p-4">
      <p>Coming Soon.....</p>
    </div>
  )}

  {activeTab === "bills" && userData?.user_cat === "MdaUser" && (
    <div className="text-gray-600 p-4">
      <p>No bills available....</p>
    </div>
  )}
</div>

    </div>
  ) : (
    <div className="text-center mt-10 text-gray-600">
      <p>No data found for the provided ID.</p>
    </div>
  );
};

export default DyamicView;
