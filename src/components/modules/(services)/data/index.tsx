"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import toast from "react-hot-toast";

import { CustomHeader } from "@/src/components/common/header";
import TransferWalletCards from "../../wallet/components/wallet-cards";
import Networks from "../lib/Networks";
import { FormTextInput, SelectInput } from "@/src/components/common/input";
import { FormButton } from "@/src/components/common/button";
import { fetchDashboardData } from "@/src/services/dashboardService";
import { BuyDataService, GetDataPlans } from "@/src/services/VATService";

import "../style.scss";

type AirtimeServiceTypes = {
  amount: number;
  phone_number: string;
  tarrifTypeId: string;
  network: string;
  wallet: string;
};

const DataModule = () => {
  const router = useRouter();
  const [activeAccount, setActiveAccount] = useState("fidelity");

  const {
    register,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AirtimeServiceTypes>({
    defaultValues: {
      wallet: "fidelity",
      amount: 0,
    },
  });

  const selectedNetwork = useWatch({ control, name: "network" });
  const selectedTarrifId = useWatch({ control, name: "tarrifTypeId" });

  const handleNetworkSelect = (network: string) =>
    setValue("network", network, { shouldValidate: true });

  const handleWalletSelect = (wallet: string) =>
    setValue("wallet", wallet, { shouldValidate: true });

  const { data: dashboardData, refetch } = useQuery({
    queryKey: ["get_dashboard_data"],
    queryFn: fetchDashboardData,
  });

  const { data: dataPlans } = useQuery({
    queryKey: ["get_data_plans", selectedNetwork],
    queryFn: () => GetDataPlans({ network: selectedNetwork }),
    enabled: !!selectedNetwork,
  });

  useEffect(() => {
    const selectedPlan = dataPlans?.response_data?.find(
      (plan: any) =>
        plan.tarrifTypeId === selectedTarrifId ||
        plan.planId === selectedTarrifId
    );

    console.log(selectedPlan)

    if (selectedPlan) {
      setValue("amount", selectedPlan.price);
    }
  }, [selectedTarrifId, dataPlans, setValue]);

  useEffect(() => {
    setValue("amount", 0);
    setValue("tarrifTypeId", "");
  }, [selectedNetwork, setValue]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["buy_airtime"],
    mutationFn: BuyDataService,
    onSuccess: async (res: any) => {
      await refetch();

      if (res?.response_code === "00") {
        if (typeof res?.response_message === "string") {
          router.push("/success");
        } else {
          toast.error("Unsuccessful data purchase");
        }
      } else {
        toast.error(res?.response_message);
      }
    },
    onError: (err) => {
      console.error(err);
      toast.error("An error occurred. Please try again.");
    },
  });

  const onSubmit = (data: AirtimeServiceTypes) => {
    mutate({ ...data, amount: Number(data.amount) });
  };

  const getPlanValue = (plan: any) => {
    switch (selectedNetwork) {
      case "mtn":
        return plan.tarrifTypeId;
      case "airtel":
      case "glo":
        return plan.planId;
      case "9mobile":
        return plan.tarrifTypeId || plan.planId;
      default:
        return null;
    }
  };

  return (
    <div>
      <CustomHeader title="Data" desc="Purchase data for any network" />
      <section className="service">
        <TransferWalletCards
          data={dashboardData}
          activeAccount={activeAccount}
          setActiveAccount={setActiveAccount}
          onWalletSelect={handleWalletSelect}
          type="balance"
        />

        <Networks onNetworkSelect={handleNetworkSelect} />

        {selectedNetwork && (
          <form className="service_form" onSubmit={handleSubmit(onSubmit)}>
            <SelectInput
              label="Tarrif Plans"
              name="tarrifTypeId"
              id="tarrifTypeId"
              register={register}
              onChange={(e) =>
                setValue("tarrifTypeId", e.target.value, {
                  shouldValidate: true,
                })
              }
              options={
                dataPlans?.response_data?.map((plan: any) => ({
                  label: plan.name,
                  value: getPlanValue(plan),
                })) || []
              }
            />

            <FormTextInput
              label="Phone Number"
              name="phone_number"
              type="number"
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

            <FormTextInput
              label="Amount"
              name="amount"
              type="number"
              disabled
              validation={{
                required: "Amount is required",
                min: { value: 40, message: "Amount must be at least ₦50" },
              }}
              error={errors.amount}
              register={register}
            />

            <FormButton
              text="Buy Data"
              disabled={isPending}
              loading={isPending}
            />
          </form>
        )}
      </section>
    </div>
  );
};

export default DataModule;
