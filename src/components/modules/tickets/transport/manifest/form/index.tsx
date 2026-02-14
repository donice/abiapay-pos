"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { randomInvoiceGenerator } from "@/src/utils/randomInvoiceGenerator";
import { getCurrentDateTime } from "@/src/utils/getCurrentDateTime";
import toast from "react-hot-toast";
import { isBrowser } from "@/src/utils/isBrowser";
import { useRouter } from "next/navigation";
import { Button, BackButton } from "@/src/components/common/button";
import { FormTextInput, SelectInput } from "@/src/components/common/input";
import { SuccessModal } from "@/src/components/common/modal";
import { useDebounce } from "@/src/hooks/useDebounce";
import "./style.scss";
import { CreateManifestPayloadType } from "@/src/components/types/ticketTypes";
import {
  createManifest,
  fetchPlateNumberInfo,
} from "@/src/services/ticketsServices";
import { useMutation } from "react-query";
import { RiAddLine, RiDeleteBin2Line } from "react-icons/ri";
import { bankOptions } from "@/src/lib/app";

const AddManifestForm = ({
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
    control,
  } = useForm<CreateManifestPayloadType>({
    defaultValues: {
      merchant_key: process.env.NEXT_PUBLIC_MERCHANT_KEY || "",
      vehiclePlateNumber: "",
      taxpayer_phone: "",
      taxpayer_name: "",
      wallet_type: "fidelity",
      destination: "",
      passengers: [
        {
          name: "",
          phone_number: null,
          next_of_kin_name: "",
          next_of_kin_phone: "",
        },
      ],
      amount: null,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "passengers",
  });

  const router = useRouter();

  const data = isBrowser && sessionStorage.getItem("USER_DATA");
  const user_data = data && JSON.parse(data);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateManifestPayloadType) => {
      return createManifest(data);
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

  const onSubmit = async (data: CreateManifestPayloadType) => {
    const formData = {
      ...data,
      transaction_date: getCurrentDateTime(),
      invoice_id: `INV${randomInvoiceGenerator()}`,
    };

    sessionStorage.setItem("TRANSPORT_INVOICE", JSON.stringify(formData));

    mutate(formData);
  };

  const vehiclePlateNumber = watch("vehiclePlateNumber");
  const debouncedPlateNumber = useDebounce(vehiclePlateNumber, 500);

  useEffect(() => {
    if (debouncedPlateNumber) {
      const getPlateNumberInfo = async (vehiclePlateNumber: string) => {
        try {
          const response = await fetchPlateNumberInfo(vehiclePlateNumber);

          if (response.data?.length !== 0) {
            toast.success(response.message);
            setValue("taxpayer_name", response.data.Name);
            setValue("taxpayer_phone", response.data.Phone);
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
      <FormTextInput
        label="Plate Number"
        type="text"
        name="vehiclePlateNumber"
        placeholder="Enter Plate Number"
        register={register}
        validation={{
          required: true,
          setValueAs: (value: string) => value.toUpperCase(),
        }}
        error={errors.vehiclePlateNumber}
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
        label="Taxpayer Name"
        type="text"
        name="taxpayer_name"
        placeholder="Enter Taxpayer Name"
        register={register}
        validation={{ required: true }}
        error={errors.taxpayer_name}
      />

      <FormTextInput
        label="Destination"
        type="text"
        name="destination"
        placeholder="Enter Destination"
        register={register}
        validation={{ required: true }}
        error={errors.destination}
      />

      <FormTextInput
        label="Amount"
        type="number"
        name="amount"
        placeholder="Enter Amount"
        register={register}
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

      <div className="passengers-section">
        <h4>{`Passenger${fields.length > 1 ? "s" : ""}`}</h4>
        {fields.map((field, index) => (
          <div key={field.id} className="add-ticket">
            <FormTextInput
              label={`Passenger ${index + 1} Name`}
              type="text"
              name={`passengers.${index}.name`}
              placeholder="Enter Name"
              register={register}
              validation={{ required: "Passenger name required" }}
              error={errors.passengers?.[index]?.name}
            />

            <FormTextInput
              label="Phone Number"
              type="number"
              name={`passengers.${index}.phone_number`}
              placeholder="Enter Phone Number"
              register={register}
              validation={{ required: "Phone number required" }}
              error={errors.passengers?.[index]?.phone_number}
            />

            <FormTextInput
              label="Next of Kin Name"
              type="text"
              name={`passengers.${index}.next_of_kin_name`}
              placeholder="Enter Next of Kin Name"
              register={register}
              validation={{ required: "Next of Kin name required" }}
              error={errors.passengers?.[index]?.next_of_kin_name}
            />

            <FormTextInput
              label="Next of Kin Phone"
              type="number"
              name={`passengers.${index}.next_of_kin_phone`}
              placeholder="Enter Next of Kin Phone"
              register={register}
              validation={{ required: "Next of Kin phone required" }}
              error={errors.passengers?.[index]?.next_of_kin_phone}
            />

            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="remove-btn"
              >
                <RiDeleteBin2Line /> <span>Remove Passenger</span>
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => {
            const lastPassenger = watch("passengers")?.[fields.length - 1];

            if (
              lastPassenger?.name &&
              lastPassenger?.phone_number &&
              lastPassenger?.next_of_kin_name &&
              lastPassenger?.next_of_kin_phone
            ) {
              append({
                name: "",
                phone_number: null,
                next_of_kin_name: "",
                next_of_kin_phone: "",
              });
            } else {
              toast.error(
                "Please fill all fields for the current passenger before adding a new one."
              );
            }
          }}
          className="add-btn"
        >
          <RiAddLine /> <span>Add Passenger</span>
        </button>
      </div>

      <div className="btn_container">
        <BackButton link="/tickets" />
        <Button text="Create Manifest" loading={isPending} />
      </div>

      {show && (
        <SuccessModal
          maintext="Transaction completed successfully"
          link="/tickets"
          buttonText="Close"
          id={`Manifest with Ref: ${paymentRef} was successfully created`}
        />
      )}
    </form>
  );
};

export default AddManifestForm;
