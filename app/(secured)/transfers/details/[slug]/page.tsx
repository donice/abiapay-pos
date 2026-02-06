"use client";
import React, { useEffect, useState } from "react";
import { SelectInput } from "@/src/components/common/input";
import { BackButton, Button } from "@/src/components/common/button";
import "./style.scss";
import { formatAmount } from "@/src/utils/formatAmount";
import { InformationModal, SuccessModal } from "@/src/components/common/modal";
import { fetchTransferHistory } from "@/src/services/transactions";
import { useQuery } from "@tanstack/react-query";
import { Loading } from "@/src/components/common/loader/redirecting";
import { useRouter } from "next/navigation";
import Empty from "@/src/components/common/empty";

const Dynamic = ({ params }: { params: { slug: string } }) => {
  const router = useRouter();
  const [ticket, setTicket] = useState<any>();

  const { data, isLoading } = useQuery({
    queryKey: ["transfer_history"],
    queryFn: () => {
      return fetchTransferHistory();
    },
  });
  const filtereddata = data?.response_data?.filter(
    (item: any) => item?.id == params?.slug
  )[0];

  useEffect(() => {
    setTicket(filtereddata);
  }, [data, params?.slug]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {data?.response_data.length > 0 ? (
            <div className="ticket-details">
              <h1>More Transaction Details</h1>
              <div className="ticket-details_comp">
                <div>
                  <p>Status</p>
                  <p>{ticket?.paymentStatus}</p>
                </div>

                <div>
                  <p>Amount</p>
                  <p>₦ {formatAmount(ticket?.payer_amountPaid)}</p>
                </div>
                <div>
                  <p>Bank</p>
                  <p>{ticket?.merchant_bankName}</p>
                </div>

                <div>
                  <p>Payer Name</p>
                  <p>{ticket?.payer_accountName}</p>
                </div>

                <div>
                  <p>Payer Account</p>
                  <p>{ticket?.payer_accountNumber}</p>
                </div>

                <div>
                  <p>Transaction Ref</p>
                  <p>{ticket?.sessionId}</p>
                </div>
                <div>
                  <p>Transaction Date</p>
                  <p>{ticket?.createTime}</p>
                </div>
              </div>

              <Button
                text="Go Back"
                onClick={() => {
                  router.push("/transfers");
                }}
              />
              
            </div>
          ) : (
            <div>
              <Empty text="No data" />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Dynamic;
