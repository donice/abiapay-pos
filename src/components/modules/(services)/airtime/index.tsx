"use client";
import { CustomHeader } from "@/src/components/common/header";
import { fetchDashboardData } from "@/src/services/dashboardService";
import { useMutation, useQuery } from "react-query";
import React from "react";
import TransferWalletCards from "../../wallet/components/wallet-cards";
import Networks, { AirtimeAmounts } from "../lib/Networks";
import "../style.scss";
import { useForm, useWatch } from "react-hook-form";
import { FormTextInput } from "@/src/components/common/input";
import { FormButton } from "@/src/components/common/button";
import { BuyAirtimeService } from "@/src/services/VATService";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

const AirtimeModule = () => {
  const router = useRouter();
  const [activeAccount, setActiveAccount] = React.useState("fidelity");

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<AirtimeServiceTypes>({
    defaultValues: {
      wallet: "fidelity",
    },
  });

  const selectedNetwork = useWatch({ control, name: "network" });

  const handleNetworkSelect = (network: string) => {
    setValue("network", network);
  };
  const handleWalletSelect = (wallet: string) => {
    setValue("wallet", wallet);
  };

  const { data, refetch } = useQuery({
    queryKey: ["get_dashboard_data"],
    queryFn: () => {
      return fetchDashboardData();
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["buy_airtime"],

    mutationFn: async (data: AirtimeServiceTypes) => {
      const res = await BuyAirtimeService(data);
      return res;
    },
    onSuccess: async (data: any) => {
      await refetch();

      if (data?.response_code == "00") {
        if (typeof data?.response_message !== "string") {
          return toast.error("Unsuccessful airtime purchase");
        } else {
          router.push("/success");
        }
      } else {
        toast.error(data?.response_message);
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit = (data: any) => {
    mutate(data);
  };

  return (
    <div>
      <CustomHeader title="Airtime" desc="Purchase airtime for any network" />
      <div className="flex flex-end justify-end items-center my-4">
        <Link href={"/airtime/history"} className="text-sm font-bold">
          View history
        </Link>
      </div>
      <section className="service">
        <TransferWalletCards
          data={data}
          activeAccount={activeAccount}
          setActiveAccount={setActiveAccount}
          onWalletSelect={handleWalletSelect}
          type="balance"
        />

        <Networks onNetworkSelect={handleNetworkSelect} />

        {selectedNetwork && (
          <form className="service_form" onSubmit={handleSubmit(onSubmit)}>
            <FormTextInput
              label={"Phone Number"}
              name={"phone_number"}
              type={"number"}
              validation={{
                required: "Phone number is required",
                minLength: {
                  value: 11,
                  message: "Phone number must be 11 digits",
                },
                maxLength: {
                  value: 11,
                  message: "Phone number must be 11 digits",
                },
              }}
              error={errors.phone_number}
              register={register}
            />

            <div>
              <AirtimeAmounts
                onAmountSelect={(amount: number) => setValue("amount", amount)}
              />
            </div>
            <FormTextInput
              label={"Amount"}
              name={"amount"}
              type={"number"}
              validation={{
                required: "Amount is required",
                min: { value: 50, message: "Amount must be at least ₦50" },
              }}
              error={errors.amount}
              register={register}
            />

            {watch("amount") && (
              <span className="animate-slide-down text-blue-500 text-xs font-normal border border-blue-200 bg-blue-50 p-1 rounded-md text-center block">
                You will receive a ₦{(watch("amount") * 0.015).toFixed(2)}{" "}
                Cashback
              </span>
            )}

            <FormButton
              text={"Buy Airtime"}
              disabled={isPending}
              loading={isPending}
            />
          </form>
        )}
      </section>
    </div>
  );
};

export default AirtimeModule;

type AirtimeServiceTypes = {
  amount: number;
  phone_number: string;
  network: string;
  wallet: string;
};
