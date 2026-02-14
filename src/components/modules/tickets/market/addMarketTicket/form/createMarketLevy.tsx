"use client";
import React, { useEffect } from "react";
import { FormButton } from "@/src/components/common/button";
import { FormTextInput, SelectInput } from "@/src/components/common/input";
import "./style.scss";
import { useForm } from "react-hook-form";
import {
  fetchMarkets,
  MarketLevyType,
  postPayForMarketLevy,
} from "@/src/services/ticketsServices";
import { useMutation } from "react-query";
import { getErrorMessages } from "@/src/utils/helper";
import toast from "react-hot-toast";
import { useDebounce } from "@/src/hooks/useDebounce";
import { fetchABSSINInfo } from "@/src/services/common";
import { MarketTicketModal } from "@/src/components/common/modal";
import { FcApproval } from "react-icons/fc";
import { getCurrentYear } from "@/src/utils/getCurrentYear";

const CreateMarketLevyForm = () => {
  const [markets, setMarkets] = React.useState([]);
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
    watch,
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
        data?.data.map((item: any) => ({
          label: item.market,
          value: item.market_id,
        }))
      );
      return data;
    } catch (error: any) {
      throw new Error(`Error fetching transactions: ${error?.message}`);
    }
  };

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
    },
  });

  const onsubmit = (data: any) => mutatePayForMarketLevy.mutate(data);

  const abssin = watch("abssin");
  const debouncedAbssin = useDebounce(abssin, 300);

  useEffect(() => {
    if (debouncedAbssin) {
      const getPlateNumberInfo = async (req: string) => {
        try {
          const response = await fetchABSSINInfo({ id: req });

          if (response.data?.length !== 0) {
            toast.success(response.message);
            setValue(
              "taxpayer_name",
              response.data.firstname +
                " " +
                response.data.middle_name +
                " " +
                response.data.lastname
            );
            setValue("taxpayer_phone", response.data.phone_number);
          }
        } catch (error) {
          console.log(error);
        }
      };

      getPlateNumberInfo(debouncedAbssin);
    }
  }, [debouncedAbssin, setValue]);

  useEffect(() => {
    getMarkets();
  }, []);

  return (
    <div className="add-market-ticket">
      <section className="grid gap-4">
        <div>
          <form
            onSubmit={handleSubmit(onsubmit)}
            className="flex flex-col gap-2 justify-between"
          >
            {" "}
            <FormTextInput
              label="Taxpayer ABSSIN"
              type="number"
              name="abssin"
              placeholder="Enter Taxpayer ABSSIN"
              register={register}
              validation={{
                required: "Taxpayer ABSSIN is Required",
                minLength: {
                  value: 10,
                  message: "Length must be above 10 characters",
                },
                maxLength: {
                  value: 11,
                  message: "Length must be below 11 characters",
                },
              }}
              error={errors.abssin}
            />
            <FormTextInput
              label="Taxpayer Name"
              type="text"
              name="taxpayer_name"
              placeholder="Enter Taxpayer Name"
              register={register}
              validation={{
                required: "Taxpayer Name is Required",
              }}
              error={errors.taxpayer_name}
            />
            <FormTextInput
              label="Taxpayer Phone"
              type="number"
              name="taxpayer_phone"
              placeholder="Enter Taxpayer Phone"
              register={register}
              validation={{
                required: "Taxpayer Phone is Required",
              }}
              error={errors.taxpayer_phone}
            />
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
            />{" "}
            <SelectInput
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
            <FormTextInput
              label={"Amount to be paid"}
              name={"amount"}
              disabled
              value={18_000}
              error={errors.zone_line}
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

export default CreateMarketLevyForm;
