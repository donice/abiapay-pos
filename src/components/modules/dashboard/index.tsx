"use client";
import React, {
  useEffect,
  useReducer,
  type Reducer,
  useCallback,
  useState,
} from "react";
import StatsCard from "./statsCard";
import { PrimaryButton, SecondaryButton } from "@/src/components/common/button";
import "./style.scss";
import { CustomHeader } from "@/src/components/common/header";
import {
  fetchDashboardData,
  fetchABSSINData,
  fetchEnumerationData,
  fetchTotalABSSIN,
} from "@/src/services/dashboardService";
import toast from "react-hot-toast";
import LoaderSkeleton from "../../common/loader-skeleton";
import type { Action, State } from "../../types/dashboardTypes";
import { isBrowser } from "@/src/utils/isBrowser";
import { WalletCard } from "./walletCard";
import { fetchTransactions } from "@/src/services/ticketsServices";
import QuickLink from "./quickLink";
import MdaCard from "./mdaCard";
import { useQuery } from "@tanstack/react-query";
import { fetchReceipts } from "@/src/services/receiptsServices";
import { fetchBills } from "@/src/services/billServices";
import EnforcerCard from "./enforcerCard";
import { appMetadata } from "@/src/lib/app";

const MDA_KEYS = {
  ministry_of_transport: "29001001",
  absaa: "11100104",
  board_of_iternal_revenue: "20008001",
};

function filterByTodaysDate(transactions: any[]) {
  const today = new Date().toISOString().split("T")[0];
  return transactions.filter((transaction) => {
    return transaction.trans_date.split("T")[0] === today;
  });
}

const initialState: State = {
  fidelityData: {
    total_credit: null,
    total_debit: null,
    balance: null,
    earnings: null,
    account_name: null,
    account_number: null,
    bank_name: null,
  },
  accessData: {
    current_earnings: null,
    wallet_balance: null,
    wallet_id: null,
    wallet_name: null,
  },
  loading: true,
};

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return {
        ...state,
        fidelityData: action.payload.fidelityData,
        accessData: action.payload.accessData,
        loading: false,
      };
    case "FETCH_ERROR":
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};

const DashboardComponent: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [abssinCount, setABSSINCount]: any = React.useState(0);
  const [enumerationCount, setEnumerationCount]: any = React.useState(null);
  const [ttCount, setTtCount]: any = React.useState(null);
  const [userData, setUserData] = useState<{
    name?: string;
    user_cat?: string;
    mda_name?: string;
    mda?: string;
  } | null>(null);

  useEffect(() => {
    if (isBrowser) {
      const data = window.sessionStorage.getItem("USER_DATA");
      if (data) {
        try {
          setUserData(JSON.parse(data));
        } catch (e) {
          console.error("Error parsing JSON data:", e);
          setUserData({});
        }
      }
    }
  }, []);

  useEffect(() => {
    if (isBrowser) {
      const data = window.sessionStorage.getItem("USER_DATA");
      if (data) {
        try {
          setUserData(JSON.parse(data));

          // Get location once user logs in
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                const geoString = `${pos.coords.latitude},${pos.coords.longitude}`;
                sessionStorage.setItem("USER_GEOLOCATION", geoString);
              },
              (err) => {
                console.error("Geolocation error:", err);
                toast.error(
                  "Unable to fetch location. Please allow location access.",
                );
              },
            );
          }
        } catch (e) {
          console.error("Error parsing JSON data:", e);
          setUserData({});
        }
      }
    }
  }, []);

  // ! using useCallback to memoize the data coming from the services

  const getDashboardData = useCallback(async () => {
    try {
      const res = await fetchDashboardData();
      dispatch({
        type: "FETCH_SUCCESS",
        payload: {
          fidelityData: res.fidelity,
          accessData: res.access,
        },
      });
    } catch (error) {
      // toast.error("Error fetching dashboard data");
      dispatch({ type: "FETCH_ERROR" });
    }
  }, []);

  const getABSSINData = useCallback(async () => {
    try {
      const res = await fetchABSSINData();
      setABSSINCount(res?.data.length);
    } catch (error) {
      toast.error("Cannot fetch abssin data");
    }
  }, []);

  const getTotalABSSIN = useCallback(async () => {
    try {
      const res = await fetchTotalABSSIN();
      setABSSINCount(res?.data.length);
    } catch (error) {
      toast.error("Cannot fetch abssin data");
    }
  }, []);

  const getEnumerationDailyData = useCallback(async () => {
    try {
      const res = await fetchEnumerationData();
      setEnumerationCount(
        res?.response_data?.transport?.thisDay +
          res?.response_data?.market?.thisDay,
      );
    } catch (error) {
      toast.error("Cannot fetch enumeration data");
    }
  }, []);

  const getTransportTicketData = useCallback(async () => {
    try {
      const res = await fetchTransactions();
      const todaysTickets = filterByTodaysDate(res?.data);
      setTtCount(todaysTickets.length);
    } catch (error) {
      toast.error("Cannot fetch ticket data");
    }
  }, []);

  const { data: receiptData, isLoading: receiptLoading } = useQuery({
    queryKey: ["get_receipts"],
    queryFn: () => {
      return fetchReceipts();
    },
  });

  const { data: billsData, isLoading: billsLoading } = useQuery({
    queryKey: ["get_bills"],
    queryFn: () => {
      return fetchBills();
    },
  });

  const fetched_data = billsData?.response_data || [];

  // console.log(receiptData, "RECEIPT DATA");

  useEffect(() => {
    getDashboardData();
    getABSSINData();
    getEnumerationDailyData();
    getTransportTicketData();
    getTotalABSSIN();
  }, []);

  const { fidelityData, accessData, loading } = state;

  console.log("userData", userData);

  return (
    <div className="dashboard">
      <header className="dashboard_header">
        <CustomHeader
          title={`Welcome${userData?.name && `, ${userData?.name}`}`}
          desc={
            userData?.user_cat == "MdaUser"
              ? `${userData?.mda_name} Dashboard`
              : "Overview of your dashboard"
          }
        />
        {userData?.user_cat == "MdaUser" ||
        userData?.user_cat == "Enforcer" ||
        userData?.user_cat == "Enforcer" ? null : (
          <div className="dashboard_header_buttons">
            <SecondaryButton
              text="Akara Ekwenti"
              link="/find/using-phone-number"
            />
            {/* <PrimaryButton
              text="Sharp Sharp"
              link="/find/using-plate-number"
              addIcon={true}
            /> */}
          </div>
        )}
      </header>

      {userData?.user_cat == "MdaUser" ||
      userData?.user_cat == "Enforcer" ? null : !loading ? (
        <div className="dashboard_wallets">
          {appMetadata.banksAllowed.find((b) => b.value === "access")
            ?.allowed && <WalletCard bank="access" data={accessData} />}

          {appMetadata.banksAllowed.find((b) => b.value === "fidelity")
            ?.allowed && <WalletCard bank="fidelity" data={fidelityData} />}
        </div>
      ) : (
        <div className="dashboard_wallets_skeleton">
          <LoaderSkeleton />
          <LoaderSkeleton />
        </div>
      )}

      {userData?.user_cat == "MdaUser" ? (
        <div className="dashboard_mda_stats">
          <MdaCard
            name="Bills"
            amount={
              billsData?.response_data == null
                ? 0
                : billsData?.response_data.length.toString()
            }
            link="/bills"
          />
          <MdaCard
            name="Receipts"
            amount={receiptData == null ? 0 : receiptData.length.toString()}
            link="/receipts"
          />
        </div>
      ) : userData?.user_cat == "Enforcer" ? (
        <div className="dashboard_enf_stats">
          <EnforcerCard
            name="Fines"
            amount={
              billsData?.response_data == null
                ? 0
                : billsData?.response_data.length.toString()
            }
            link="/bills"
          />
        </div>
      ) : abssinCount != null && enumerationCount != null ? (
        <div className="dashboard_stats">
          <StatsCard
            name="Tickets"
            amount={ttCount == null ? 0 : ttCount.toString()}
            link="/tickets"
          />
          <StatsCard
            name="ABSSIN"
            amount={abssinCount == null ? 0 : abssinCount.toString()}
            link="identity"
          />
          <StatsCard
            name="Enumeration"
            amount={enumerationCount == null ? 0 : enumerationCount.toString()}
            link="/enumeration"
          />
        </div>
      ) : (
        <div className="dashboard_stats_skeleton">
          <LoaderSkeleton height="100px" />
          <LoaderSkeleton height="100px" />
          <LoaderSkeleton height="100px" />
        </div>
      )}

      <div className="dashboard_quicklinks">
        {userData?.mda == MDA_KEYS.absaa && (
          <>
            <QuickLink name="ABSSAA" link="/absaa/signage" />
          </>
        )}
        {(userData?.mda == MDA_KEYS.ministry_of_transport ||
          userData?.mda == MDA_KEYS.board_of_iternal_revenue) && (
          <>
            <QuickLink name="Bulk Prints" link="/prints" />
          </>
        )}
        {userData?.user_cat == "MdaUser" && (
          <>
            {" "}
            <QuickLink name="Identity" link="/identity" />{" "}
            <QuickLink name="Contract Management" link="/contract" />
            <QuickLink name="Bills" link="/bills" />{" "}
            {/* {userData?.mda =="20008001" && */}
            <QuickLink
              name="Demand Notices"
              comingSoon={false}
              link="/demand-notices"
            />
            {/* } */}
            <QuickLink name="Receipts" link="/receipts" />
          </>
        )}

        {userData?.user_cat == "Enforcer" && (
          <>
            <QuickLink name="Verify Vehicle Status" link="/vehicle-status" />
            <QuickLink name="Traffic Offence Ticket" link="/traffic-offence" />
            <QuickLink name="Verify Ticket Status" link="/verify-ticket" />
            {/* <QuickLink name="Vehicle Impound" link="/vehicle-impound"  /> */}
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardComponent;
