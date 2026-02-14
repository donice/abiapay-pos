"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { fetchProducts } from "@/src/services/common";
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
import { CreateTicketPayload } from "@/src/components/types/ticketTypes";
import {
  Product,
  createNewTicket,
  fetchPlateNumberInfo,
} from "@/src/services/ticketsServices";
import { useMutation } from "react-query";
import { bankOptions } from "@/src/lib/app";

const  AddTransportTicketForm = ({
  show,
  setShow,
  paymentRef,
  setPaymentRef,
  selectedPeriod,
  setSelectedPeriod,
  selectedProduct,
  setSelectedProduct,
}: any) => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateTicketPayload>({
    defaultValues: {
      merchant_key: process.env.NEXT_PUBLIC_MERCHANT_KEY || "",
      transaction_date: getCurrentDateTime(),
      invoice_id: `INV${randomInvoiceGenerator()}`,
      paymentPeriod: "",
      productCode: "",
      next_expiration_date: "",
      no_of_days: "",
      amount: "",
      lga: "",
      agentEmail: "",
      plateNumber: "",
      taxPayerPhone: "",
      taxPayerName: "",
      wallet_type: "fidelity",
    },
  });

  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);

  const data = isBrowser && sessionStorage.getItem("USER_DATA");
  const user_data = data && JSON.parse(data);
  const getProductsData = async () => {
    try {
      const response = await fetchProducts();
      setProducts(response?.data);
    } catch {
      toast.error("Error fetching products");
    }
  };

  useEffect(() => {
    setValue("agentEmail", user_data?.email);
  }, [setValue, user_data]);

  useEffect(() => {
    getProductsData();
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateTicketPayload) => {
      return createNewTicket(data);
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

  const onSubmit = async (data: CreateTicketPayload) => {
    const formData = {
      ...data,
      transaction_date: getCurrentDateTime(),
      invoice_id: `INV${randomInvoiceGenerator()}`,
    };

    sessionStorage.setItem("TRANSPORT_INVOICE", JSON.stringify(formData));

    mutate(formData);
  };

  const handleProductChange = (event: { target: { value: any } }) => {
    const productCode = event.target.value;
    setSelectedProduct(productCode);
    setValue("productCode", productCode);
  };

  const handlePeriodChange = (event: { target: { value: any } }) => {
    const period = event.target.value;
    setSelectedPeriod(period);
    setValue("paymentPeriod", period);

    const selectedProductData = products.find(
      (product) => product.productCode === selectedProduct
    );
    let amount = 0;
    let no_of_days = "0";

    switch (period) {
      case "1 Day":
        no_of_days = "1";
        amount = selectedProductData?.dailyAmount || 0;
        break;
      case "1 Week":
        no_of_days = "7";
        amount = selectedProductData?.weeklyAmount || 0;
        break;
      case "1 Month":
        no_of_days = "30";
        amount = selectedProductData?.monthlyAmount || 0;
        break;
    }

    setValue("no_of_days", no_of_days);
    const transaction_date = new Date();
    const next_expiration_date = new Date(
      transaction_date.getTime() + parseInt(no_of_days) * 24 * 60 * 60 * 1000
    );
    setValue("next_expiration_date", next_expiration_date.toISOString());
    setValue("amount", amount);
  };

  const plateNumber = watch("plateNumber");
  const debouncedPlateNumber = useDebounce(plateNumber, 500);

  useEffect(() => {
    if (debouncedPlateNumber) {
      const getPlateNumberInfo = async (plateNumber: string) => {
        try {
          const response = await fetchPlateNumberInfo(plateNumber);

          if (response.data?.length !== 0) {
            toast.success(response.message);
            setValue("taxPayerName", response.data.Name);
            setValue("taxPayerPhone", response.data.Phone);
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
      label="Ticket Type"
      name="productCode"
      id="productCode"
      register={register}
      validation={{
        required: true,
        onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedProduct(e.target.value);
        }
      }}
      options={products.map((product) => ({
        value: product.productCode,
        label: product.productName,
      }))}
      placeholder="Select Ticket Type"
      error={!!errors.productCode}
      />

    <FormTextInput
      label="Plate Number"
      type="text"
      name="plateNumber"
      placeholder="Enter Plate Number"
      register={register}
      validation={{
        required: true,
        setValueAs: (value: string) => value.toUpperCase()
      }}
      error={errors.plateNumber}
      />

      <FormTextInput
        label="Taxpayer Phone Number"
        type="number"
        name="taxPayerPhone"
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
        error={errors.taxPayerPhone}
      />

      <FormTextInput
        label="Taxpayer Name"
        type="text"
        name="taxPayerName"
        placeholder="Enter Taxpayer Name"
        register={register}
        validation={{ required: true }}
        error={errors.taxPayerName}
      />

      <SelectInput
        label="Payment Period"
        name="paymentPeriod"
        id="paymentPeriod"
        value={selectedPeriod}
        onChange={handlePeriodChange}
        disabled={!selectedProduct}
        options={[
          { value: "1 Day", label: "1 Day" },
          { value: "1 Week", label: "1 Week" },
          { value: "1 Month", label: "1 Month" },
        ]}
        placeholder="Select Payment Period"
        error={!!errors.paymentPeriod}
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
        <BackButton link="/tickets/transport" />
        <Button text="Process Payment" loading={isPending} />
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

export default AddTransportTicketForm;
