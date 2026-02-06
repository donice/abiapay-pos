"use client";
import Empty from "@/src/components/common/empty";
import Loader from "@/src/components/common/loader";
import { fetchMarketEnumerationDetails } from "@/src/services/ticketsServices";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const ViewReceiptComponent = ({ id }: { id: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["receipt", id],
    queryFn: () => {
      return fetchMarketEnumerationDetails({ enumeration_id: id });
    },
  });

  // console.log(data.response_data.response_data);

  return (
    <section>
      {isLoading && (
        <p>
          {" "}
          <Loader />
        </p>
      )}
      {!data && (
        <p>
          <Empty text="Receipt not found" />{" "}
        </p>
      )}

      {data && (
        <div className="grid gap-3 border px-3 rounded-xl">
          <p className="flex justify-between py-2 border-b border-dashed text-sm">
            <strong>Name:</strong> {data.response_data.taxpayer_name}
          </p>
          <p className="flex justify-between py-2 border-b border-dashed text-sm">
            <strong>Phone:</strong> {data.response_data.taxpayer_phone}
          </p>
          <p className="flex justify-between py-2 border-b border-dashed text-sm">
            <strong>ABSSIN:</strong> {data.response_data.taxpayer_id}
          </p>
          <p className="flex justify-between py-2 border-b border-dashed text-sm">
            <strong>Enumeration ID:</strong> {data.response_data.enumeration_id}
          </p>
          <p className="flex justify-between py-2 border-b border-dashed text-sm">
            <strong>Date:</strong>{" "}
            {new Date(data.response_data.created_at).toLocaleString()}
          </p>
          <p className="flex justify-between py-2 border-b border-dashed text-sm">
            <strong>Total Amount:</strong> ₦
            {data.response_data.total_amount.toLocaleString()}
          </p>
          <p className="flex justify-between py-2 border-b border-dashed text-sm">
            <strong>Shop Number:</strong> {data.response_data.shop_number}
          </p>
          <p className="flex justify-between py-2 border-b border-dashed text-sm">
            <strong>Zone Line:</strong> {data.response_data.zone_line}
          </p>
          <p className="flex justify-between py-2 border-b border-dashed text-sm">
            <strong>Market Name:</strong> {data.response_data.market_name}
          </p>
          <p className="flex justify-between py-2 border-b border-dashed text-sm">
            <strong>Merchant Reference:</strong>{" "}
            {data.response_data.merchant_reference}
          </p>

          <h2>Items</h2>
          <ul>
            {data.response_data.items.map(
              (item: any, index: React.Key | null | undefined) => (
                <li key={index} className="flex justify-between py-2 border-b border-dashed text-sm">
                  <div className="flex flex-col justify-start items-start">
                    {" "}
                    <p><strong>{item.revenue_item || "-"}</strong> </p>{" "}
                    <p className={`${item.status === "Paid" ? "text-green-500 bg-green-50 px-4 border border-green-300 rounded-xl " : "text-yellow-500 bg-yellow-50 px-4 border border-yellow-300 rounded-xl "}`}>{item.status || "-"}</p>
                  </div>
                  <p>₦{parseFloat(item.amount).toLocaleString() || "-"}</p>
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </section>
  );
};

export default ViewReceiptComponent;
