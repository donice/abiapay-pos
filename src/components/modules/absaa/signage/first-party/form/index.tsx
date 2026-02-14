"use client";
import {  useEffect } from "react";
import { useForm } from "react-hook-form";
import { fetchABSSINInfo } from "@/src/services/common";
import { randomInvoiceGenerator } from "@/src/utils/randomInvoiceGenerator";
import { getCurrentDateTime } from "@/src/utils/getCurrentDateTime";
import toast from "react-hot-toast";
import { isBrowser } from "@/src/utils/isBrowser";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/common/button";
import { FormTextInput, SelectInput } from "@/src/components/common/input";
import { SuccessModal } from "@/src/components/common/modal";
import { useDebounce } from "@/src/hooks/useDebounce";
import "./style.scss";
import { useMutation } from "react-query";
import { ABSAAPayload } from "@/src/components/types/absaaTypes";
import { createFirstPartySignage } from "@/src/services/absaaService";
import { bankOptions } from "@/src/lib/app";

const CreateFirstPartySignageForm = ({
  show,
  setShow,
  paymentRef,
  setPaymentRef,
  selectedPeriod,
  selectedProduct,
}: any) => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ABSAAPayload>({
    defaultValues: {
      merchant_key: process.env.NEXT_PUBLIC_MERCHANT_KEY || "",
      amount: "",
      zone: "",
      size_meter: "",
      sign_type: "",
      road_name: "",
      occurence: "1",
      abssin: "",
      taxpayer_phone: "",
      taxpayer_name: "",
      wallet_type: "fidelity",
    },
  });

  const router = useRouter();

  const data = isBrowser && sessionStorage.getItem("USER_DATA");
  const user_data = data && JSON.parse(data);


  const { mutate, isPending } = useMutation({
    mutationFn: (data: ABSAAPayload) => {
      return createFirstPartySignage(data);
    },
    onSuccess: (response: any) => {
      if (response.response_code === "00") {
        toast.success(response.response_message);
        setPaymentRef(response.payment_ref);
        setShow(true);
      } else if (response.response_code === "74") {
        toast.error(response.response_message);
        router.push("/tickets/transport");
      } else {
        toast.error(`${response.response_message}, Try again`);
      }
    },
    onError: () => {
      toast.error("Error Creating Ticket");
    },
  });

  const onSubmit = async (data: ABSAAPayload) => {
    const formData = {
      ...data,
      transaction_date: getCurrentDateTime(),
      invoice_id: `INV${randomInvoiceGenerator()}`,
    };

    sessionStorage.setItem("TRANSPORT_INVOICE", JSON.stringify(formData));

    mutate(formData);
  };


  const abssin = watch("abssin");
  const debouncedPlateNumber = useDebounce(abssin, 500);

  useEffect(() => {
    if (debouncedPlateNumber) {
      const getPlateNumberInfo = async (abssin: string) => {
        try {
          const response = await fetchABSSINInfo({id: abssin});

          if (response.data?.length !== 0) {
            toast.success(response.message);
            setValue("taxpayer_name", response.data.firstname + " " + response.data.lastname);
            setValue("taxpayer_phone", response.data.phone_number);
          }
        } catch (error) {
          toast.error("Error fetching plate number information");
        }
      };

      getPlateNumberInfo(debouncedPlateNumber);
    }
  }, [debouncedPlateNumber, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="add-ticket">
      <SelectInput
        label="Sign Type"
        name="sign_type"
        id="sign_type"
        register={register}
        validation={{ required: true }}
        options={[
          { value: "Wall Signs", label: "Wall Signs" },
          { value: "Free Standing Signs", label: "Free Standing Signs" },
        ]}
        placeholder="Select Sign Type"
        error={!!errors.sign_type}
      />
      <SelectInput
        label="Zone"
        name="zone"
        id="zone"
        register={register}
        validation={{ required: true }}
        options={[
          { value: "Standard Zone", label: "Standard Zone" },
          { value: "Premium", label: "Premium" },
        ]}
        placeholder="Select Zone"
        error={!!errors.zone}
      />
      <SelectInput
        label="Area in SQM"
        name="size_meter"
        id="size_meter"
        register={register}
        validation={{ required: true }}
        options={[
          {
            value: "0.1m to 1.0(2 x 2 - 3 x 4)ft",
            label: "0.1m to 1.0(2 x 2 - 3 x 4)ft",
          },
          {
            value: "1.01m to 3.0(4 x 6 - 5 x 8)ft",
            label: "1.01m to 3.0(4 x 6 - 5 x 8)ft",
          },
          {
            value: "3.01m to 5.0(6 x 10 - 6 x 12)ft",
            label: "3.01m to 5.0(6 x 10 - 6 x 12)ft",
          },
          {
            value: "5.01m to 7.0(6 x 12 - 8 x 10)ft",
            label: "5.01m to 7.0(6 x 12 - 8 x 10)ft",
          },
          {
            value: "7.01m to 10.0(8 x 10 - 10 x 10)ft",
            label: "7.01m to 10.0(8 x 10 - 10 x 10)ft",
          },
          {
            value: "10.01m to 13.0(10 x 10 - 10 x 12)ft",
            label: "10.01m to 13.0(10 x 10 - 10 x 12)ft",
          },
          {
            value: "13.01m to 15.0(10 x 12 - 10 x 16)ft",
            label: "13.01m to 15.0(10 x 12 - 10 x 16)ft",
          },
          {
            value: "15.01m to 25.0(10 x 16 - 10 x 20)ft",
            label: "15.01m to 25.0(10 x 16 - 10 x 20)ft",
          },

        ]}
        placeholder="Select Area in SQM"
        error={!!errors.size_meter}
      />

      <FormTextInput
        label="ABSSIN"
        type="text"
        name="abssin"
        placeholder="Enter ABSSIN"
        register={register}
        validation={{ required: true }}
        error={errors.abssin}
      />

      <FormTextInput
        label="Taxpayer Name"
        type="text"
        name="taxpayer_name"
        placeholder="Enter Taxpayer Name"
        register={register}
        validation={{ required: true }}
        error={errors.taxpayer_name}
      />

      <FormTextInput
        label="Taxpayer Phone Number"
        type="number"
        name="taxpayer_phone"
        placeholder="Enter Taxpayer Phone Number"
        register={register}
        validation={{
          required: "Field Required",
          minLength: {
            value: 11,
            message: "Length must be above 11 characters",
          },
          maxLength: {
            value: 11,
            message: "Length must be below 13 characters",
          },
        }}
        error={errors.taxpayer_phone}
      />

      <FormTextInput
        label="Location"
        type="text"
        name="road_name"
        placeholder="Enter Location"
        register={register}
        validation={{ required: true }}
        error={errors.road_name}
      />

      <FormTextInput
        label="Amount"
        type="number"
        name="amount"
        placeholder="Enter Amount"
        register={register}
        readOnly
        validation={{ required: true }}
        error={errors.amount}
      />

      <SelectInput
        label="Choose Wallet"
        name="wallet_type"
        id="wallet_type"
        register={register}
        validation={{ required: true }}
        options={bankOptions}
        placeholder="Select Wallet Type"
        error={!!errors.wallet_type}
      />

      <div className="btn_container">
        <Button text="Pay Now" loading={isPending} />
      </div>

      {show && (
        <SuccessModal
          text="View Receipt"
          link="/tickets/transport/add/summary"
          id={`Ref: ${paymentRef}, Valid for: ${selectedPeriod}, Payment for: ${selectedProduct}`}
       buttonText="Done"
          />
      )}
    </form>
  );
};

export default CreateFirstPartySignageForm;
