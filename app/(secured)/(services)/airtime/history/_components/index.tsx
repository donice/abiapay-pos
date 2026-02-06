"use client";
import { CustomHeader } from "@/src/components/common/header";
import axiosInstance from "@/src/lib/axiosInstance";
import { formatDate } from "@/src/utils/formatDate";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { RiFileListLine } from "react-icons/ri";

const AirtimeHistoryModule = () => {
  const { data } = useQuery({
    queryKey: ["airtimeHistory"],
    queryFn: async () => {
      const res = await axiosInstance.post(
        `/topup/purchase-history?limit=10&page=1&type=airtime`
      );
      return res.data?.response_data;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  console.log(data);

  return (
    <div>
      <CustomHeader title={"Airtime History"} desc={"View all history for airtime"} />
      <div className="mt-4">
        {data?.record?.map((item: any) => (
          <div key={item.id} className="border-b py-3 flex justify-between items-center">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100/70 flex items-center justify-center">
             <RiFileListLine className="text-green-500" /></div>
              <div>
                <p className="capitalize text-gray-500">{item?.network}</p>
                <p className="text-sm text-gray-400">
                  {formatDate(item?.created_at)}
                </p>
              </div>
            </div>

            <div>
              <p className="font-semibold text-lg text-gray-400">-₦{item?.amount_purchased} </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AirtimeHistoryModule;
