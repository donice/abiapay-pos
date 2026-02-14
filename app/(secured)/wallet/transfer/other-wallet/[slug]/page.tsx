"use client";
import React, { useEffect, useState } from "react";
import "./style.scss";
import {
  FormTextInput,
} from "@/src/components/common/input";
import { Button, GoBackButton } from "@/src/components/common/button";
import { useForm } from "react-hook-form";
import { useDebounce } from "@/src/hooks/useDebounce";
import {
  AccessWalletToWallet,
  fetchWalletInfo,
  FidelityWalletToWallet,
  WalletInfoType,
} from "@/src/services/walletService";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "react-query";
import { SmallLoader } from "@/src/components/common/loader";
import { fetchDashboardData } from "@/src/services/dashboardService";
import { InformationModal } from "@/src/components/common/modal";
import { fetchBanks } from "@/src/services/common";
import { IndividualTransferWalletCards } from "@/src/components/modules/wallet/components/wallet-cards";
import { TbSend } from "react-icons/tb";
import { getErrorMessages } from "@/src/utils/helper";

const StatementPage = ({ params }: { params: { slug: string } }) => {
  const activeAccount = params.slug;
  const [showSuccessModal, setShowSuccessModal] = useState({
    show: false,
    mode: "",
  });
  const [beneficiary, setBeneficiary] = useState("");
  const [banks, setBanks] = useState([]);

  const {
    setValue,
    register: registerTransferToBank,
    formState: { errors: errorsTransferToBank },
    handleSubmit: handleSubmitTransferToBank,
  } = useForm({
    defaultValues: {
      cashout_type: "",
      merchant_key: process.env.NEXT_PUBLIC_MERCHANT_KEY || "",
      bank_account: "",
      amount: "",
      desc: "",
    },
  });
  const {
    watch: watchTransferWallet,
    register: registerTransferWallet,
    formState: { errors: errorsTransferWallet },
    handleSubmit: handleSubmitTransferWallet,
  } = useForm({
    defaultValues: {
      cashout_type: "",
      merchant_key: process.env.NEXT_PUBLIC_MERCHANT_KEY || "",
      recipient_wallet_no: "",
      amount: "",
      desc: "",
    },
  });

  const cashoutType = "wallet";
  const { onChange } = registerTransferToBank("amount");

  const walletNo = watchTransferWallet("recipient_wallet_no");
  const debouncedWalletNo = useDebounce(walletNo, 500);

  const { data } = useQuery({
    queryKey: ["get_dashboard_data"],
    queryFn: () => {
      return fetchDashboardData();
    },
  });

  const { data: dasboardData } = useQuery({
    queryKey: ["get_dashboard_data"],
    queryFn: () => {
      return fetchDashboardData();
    },
  });

  const getBanks = async () => {
    try {
      const data = await fetchBanks();
      console.log(data);
      setBanks(
        data?.response_data?.map((item: any) => {
          return {
            label: item.name,
            value: item.code,
          };
        })
      );
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBanks();
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: WalletInfoType) => {
      return fetchWalletInfo(data);
    },
    mutationKey: ["fetch_wallet_info"],
    onSuccess: (data) => {
      if (data.status == true) {
        if(activeAccount == "fidelity"){
          setBeneficiary(
          data?.data.surname +
            " " +
            data?.data.firstname +
            " (" +
            data?.data.account_name +
            ")"
        )
        }
        if(activeAccount == "access"){
          setBeneficiary(
          data?.data.WalletName +
            " (" +
            data?.data.VirtualAccountName +
            ")"
        )
        }



      } else {
        setBeneficiary("");
      }
    },
    onError: (error) => {
      setBeneficiary("");
      console.log(error);
    },
  });

  const { mutate: mutateTransfer, isPending: isPendingTransfer } = useMutation({
    mutationFn: (data: any) => {
      if (cashoutType == "wallet") {
        return activeAccount == "access"
          ? AccessWalletToWallet(data)
          : FidelityWalletToWallet(data);
      }
      throw new Error("Invalid cashout type or active account");
    },
    mutationKey: ["post_payment"],
    onSuccess: (data) => {
      if (data.response_code == "00") {
        toast.success("Transaction Successful");
        setShowSuccessModal({ show: true, mode: "success" });
    } else if (data.response_code == "15") {
      setShowSuccessModal({ show: true, mode: "warning" });
    }
      else {
        toast.error(data.status + ": " + data.message);
        setBeneficiary("");
      }
    },
    onError: (error: any) => {
      setBeneficiary("");
      toast.error(
        getErrorMessages(error?.response?.data?.message) ||
          "Error completing transaction"
      );
      console.log(error);
    },
  });

  useEffect(() => {
    if (debouncedWalletNo) {
      mutate({ wallet_id: debouncedWalletNo, wallet_type: activeAccount });
    }
  }, [debouncedWalletNo, setValue]);

  const onSubmit = (reqData: any) => {
    console.log("DATA", reqData);
    mutateTransfer(reqData);
  };

  return (
    <section className="other-wallet">
      <header>
        <GoBackButton />
        <IndividualTransferWalletCards
          data={data}
          activeAccount={activeAccount}
        />
      </header>


      {cashoutType == "wallet" && (
        <form
          onSubmit={handleSubmitTransferWallet(onSubmit)}
          className="other-wallet_form"
        >
          {" "}
          <FormTextInput
            type="number"
            label={"Beneficiary Wallet"}
            name="recipient_wallet_no"
            placeholder={"Enter Beneficiary Wallet ID"}
            register={registerTransferWallet}
            validation={{ required: true }}
            error={errorsTransferWallet.recipient_wallet_no}
          />
          {isPending && (
            <p className="other-wallet_form_beneficiary">
              <SmallLoader />{" "}
            </p>
          )}
          {beneficiary !== "" && !isPending && (
            <div className="other-wallet_form_beneficiary">
              <p>{beneficiary}</p>
            </div>
          )}
          <FormTextInput
            type="number"
            label={"Amount"}
            name={"amount"}
            placeholder="Enter Amount"
            register={registerTransferWallet}
            onChange={onChange}
            validation={{
              required: "Enter an amount",
              validate: (value: number) => {
                if (activeAccount == "access") {
                  if (value > dasboardData?.access?.wallet_balance) {
                    return "Insufficient funds in your Access wallet";
                  }
                } else {
                  if (value > dasboardData?.fidelity?.balance) {
                    return "Insufficient funds in your Fidelity wallet";
                  }
                }
              },
            }}
            error={errorsTransferWallet.amount}
          />
          <FormTextInput
            label={"Description"}
            name={"desc"}
            placeholder="Enter Description"
            register={registerTransferWallet}
            validation={{ required: true }}
            error={errorsTransferWallet.desc}
          />
          <Button
            text="Transfer Funds"
            loading={isPendingTransfer}
            disabled={isPendingTransfer || beneficiary == ""}
          />
        </form>
      )}

      {showSuccessModal.show == true && showSuccessModal.mode == "success" && (
        <InformationModal
          mode="success"
          icon={<TbSend className="success_icon" />}
          maintext={`Money sent successfully`}
          subtext="Your transaction has been completed successfully. You can check your transaction history in your account."
          link={"/wallet/transfer/other-wallet"}
        />
      )}

      {showSuccessModal.show == true && showSuccessModal.mode == "warning" && (
        <InformationModal
          mode="warning"
          // icon={<TbSend className="warning_icon" />}
          maintext={`Insufficient funds`}
          subtext="Insufficient funds in your wallet. Please fund your wallet and try again."
          link={"/wallet/transfer/other-wallet"}
        />
      )}
    </section>
  );
};

export default StatementPage;
