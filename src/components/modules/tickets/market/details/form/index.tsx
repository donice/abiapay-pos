"use client";
import React, { useEffect } from "react";
import { FormButton } from "@/src/components/common/button";
import { FormTextInput, SelectInput } from "@/src/components/common/input";
import "./style.scss";
import { set, useForm } from "react-hook-form";
import {
  fetchMarketEnumerationDetails,
  fetchMarkets,
  MarketLevyType,
  postPayForMarketLevy,
} from "@/src/services/ticketsServices";
import { useMutation } from "react-query";
import { formatAmount } from "@/src/utils/formatAmount";
import { PiSealCheckDuotone } from "react-icons/pi";
import { BiLoaderCircle } from "react-icons/bi";
import { getErrorMessages } from "@/src/utils/helper";
import toast from "react-hot-toast";
import { MarketTicketModal } from "@/src/components/common/modal";
import { FcApproval } from "react-icons/fc";
import { getCurrentYear } from "@/src/utils/getCurrentYear";

const AddMarketTicketForm = (id: any) => {
  const [markets, setMarkets] = React.useState([]);
  const [details, setDetails] = React.useState<any>(null);

  const [status, setStatus] = React.useState({
    openModal: false,
    mode: "success",
  });

  const [modalDetails, setModalDetails] = React.useState({
    enumeration_id: "",
    payment_status: "",
    response_message: "",
    payment_ref: "",
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      taxpayer_name: "",
      abssin: "",
      taxpayer_phone: "",
      zone_line: "",
      market_id: "",
      shop_number: "",
      payment_period: getCurrentYear(),
      merchant_key: process.env.NEXT_PUBLIC_MERCHANT_KEY || "",
      wallet_type: "fidelity",
    },
  });

  const getMarkets = async () => {
    try {
      const data = await fetchMarkets();
      setMarkets(
        data?.data.map((item: any) => ({ label: item.market, value: item.id }))
      );
      return data;
    } catch (error: any) {
      throw new Error(`Error fetching transactions: ${error?.message}`);
    }
  };

  const mutateFetchMarketLevyDetails = useMutation({
    mutationKey: ["fetchMarketEnumerationDetails"],
    mutationFn: () => {
      return fetchMarketEnumerationDetails({
        enumeration_id: id?.id,
      });
    },
    onSuccess: (data) => {
      setDetails(data?.response_data);

      if (data?.response_code == "00") {
        setValue("abssin", data?.response_data?.taxpayer_id);
        setValue("taxpayer_name", data?.response_data?.taxpayer_name);
        setValue("taxpayer_phone", data?.response_data?.taxpayer_phone);
      }
      console.log(data);
    },
  });

  const mutatePayForMarketLevy = useMutation({
    mutationKey: ["payForMarketLevy"],
    mutationFn: (data: MarketLevyType) => {
      return postPayForMarketLevy(data);
    },
    onSuccess: (data) => {
      console.log(data);
      if (data?.response_code == "00" || data?.response_code == "12") {
        setStatus({ openModal: true, mode: "success" });
        console.log(data);
        setModalDetails({
          enumeration_id: data?.enumeration_id,
          payment_status: data?.payment_status,
          response_message: data?.response_message,
          payment_ref: data?.payment_ref,
        });
        toast.success(data?.response_message);
      } else {
        toast.error("Cannot pay for market levy");
      }
    },
    onError: (error: any) => {
      toast.error("Cannot pay for market levy");
    }
  });

  const onsubmit = (data: any) => mutatePayForMarketLevy.mutate(data);

  useEffect(() => {
    if (id) {
      mutateFetchMarketLevyDetails.mutate();
    }
  }, [id]);

  useEffect(() => {
    getMarkets();
  }, []);

  return (
    <div className="add-market-ticket">
      <section className="grid gap-4">
        <div>
          <div className="border-b-2 border-dashed py-3 flex justify-between">
            <p className="text-sm text-gray-400">Enumeration ID:</p>
            <p className="text-sm font-semibold text-gray-600">
              {details?.enumeration_id}
            </p>
          </div>
          <div className="border-b-2 border-dashed py-3 flex justify-between">
            <p className="text-sm text-gray-400">ABSSIN:</p>
            <p className="text-sm font-semibold text-gray-600">
              {details?.taxpayer_id}
            </p>
          </div>
          <div className="border-b-2 border-dashed py-3 flex justify-between">
            <p className="text-sm text-gray-400">Taxpayer Name:</p>
            <p className="text-sm font-semibold text-gray-600">
              {details?.taxpayer_name}
            </p>
          </div>
          <div className="border-b-2 border-dashed py-3 flex justify-between">
            <p className="text-sm text-gray-400">Taxpayer Phone:</p>
            <p className="text-sm font-semibold text-gray-600">
              {details?.taxpayer_phone}
            </p>
          </div>
          <div className="border-b-2 border-dashed py-3 flex justify-between">
            <p className="text-sm text-gray-400">Amount:</p>
            <p className="text-sm font-semibold text-gray-600">
              {formatAmount(Number(details?.total_amount))}
            </p>
          </div>
          <div className="border-b-2 border-dashed py-3 flex justify-between">
            <p className="text-sm text-gray-400">Payment Status:</p>
            <p
              className={`${
                details?.items[0].status == "Completed"
                  ? "text-green-500"
                  : "text-yellow-500"
              }`}
            >
              {details?.items[0].status == "Completed" ? (
                <div className="flex items-center gap-1 text-sm font-semibold ">
                  <PiSealCheckDuotone className="text-green-500 text-xl " />
                  <p>{details?.items[0].status}</p>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-sm font-semibold ">
                  <BiLoaderCircle className="text-yellow-400 text-xl animate-spin" />
                  <p>{details?.items[0].status}</p>
                </div>
              )}
            </p>
          </div>
          <div className="py-3 flex justify-between">
            <p className="text-sm text-gray-400">Created:</p>
            <p className="text-sm font-semibold text-gray-600">
              {details?.created_at}
            </p>
          </div>
          <form
            onSubmit={handleSubmit(onsubmit)}
            className="pt-3 flex flex-col gap-2 justify-between"
          >
            <SelectInput
              label={"Market Name"}
              name={"market_id"}
              id={"market_id"}
              register={register}
              validation={{ required: true }}
              error={!!errors.market_id}
              options={markets}
            />
            <FormTextInput
              label={"Shop Number"}
              name={"shop_number"}
              register={register}
              validation={{ required: true }}
              error={errors.shop_number}
            />
            <FormTextInput
              label={"Zone Line"}
              name={"zone_line"}
              register={register}
              validation={{ required: true }}
              error={errors.zone_line}
            />

<           SelectInput
              label={"Payment Period"}
              name={"payment_period"}
              id={"payment_period"}
              register={register}
              validation={{ required: true }}
              error={!!errors.payment_period}
              options={[
                { label: "2025", value: "2025" },
              ]}
            />

            <SelectInput
              label={"Wallet Type"}
              name={"wallet_type"}
              id={"wallet_type"}
              options={[
                { value: "fidelity", label: "Fidelity" },
                { value: "access", label: "Access" },
              ]}
            />
            <FormButton
              text={"Pay Now"}
              disabled={mutatePayForMarketLevy.isPending}
              loading={mutatePayForMarketLevy.isPending}
            />
          </form>

          {status.openModal && status.mode === "success" && (
            <MarketTicketModal
              details={{
                enum_id: modalDetails?.enumeration_id,
                payment_status: modalDetails?.payment_status,
                payment_ref: modalDetails?.payment_ref,
              }}
              text={modalDetails?.response_message}
              icon={
                <FcApproval className="my-4 text-[5rem] p-3 bg-green-100 rounded-full" />
              }
              maintext={"Market Ticket Payment Successful"}
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default AddMarketTicketForm;
