import type { ReactElement } from "react";
import {
  FcShipped,
  FcInTransit,
  FcAcceptDatabase,
  FcMoneyTransfer,
  FcDiploma2,
  FcAutomatic,
  FcFactory,
  FcCloseUpMode,
  FcElectronics,
  FcFinePrint,
  FcGlobe,
  FcLandscape,
  FcShop,
  FcEngineering,
} from "react-icons/fc";

export interface HaulageProps {
  name: string;
  title: string;
  cat?: string;
  icon?: ReactElement;
}

export const haulages: HaulageProps[] = [
  {
    name: "tickets/transport/flying-revenue/produce",
    title: "Produce",
    cat: "Transport",
    icon: <FcShop className="icon" />,
  },
  {
    name: "tickets/transport/flying-revenue/scrap-metal",
    title: "Scrap Metal",
    cat: "ScrapMetal",
    icon: <FcInTransit className="icon" />,
  },
  {
    name: "tickets/transport/flying-revenue/veterinary-inspection",
    title: "Veterinary Inspection/Abattoir Fees",
    cat: "Veterinary_Abattoir",
    icon: <FcAutomatic className="icon" />,
  },
  {
    name: "tickets/transport/flying-revenue/stone-sites",
    title: "Stone Sites",
    cat: "StoneSites",
    icon: <FcElectronics className="icon" />,
  },
  {
    name: "tickets/transport/flying-revenue/quarry-sites",
    title: "Quarry Sites",
    cat: "QuarrySites",
    icon: <FcAcceptDatabase className="icon" />,
  },
  {
    name: "tickets/transport/flying-revenue/inter-state-haulage",
    title: "Inter State Haulage & Commerece Levy",
    cat: "Transport",
    icon: <FcLandscape className="icon" />,
  },
  {
    name: "tickets/transport/flying-revenue/baggage-basket",
    title: "Baggage & Basket Handling Charge",
    cat: "Baggage_Basket",
    icon: <FcFactory className="icon" />,
  },
  {
    name: "tickets/transport/flying-revenue/forestry",
    title: "Forestry",
    cat: "Forestry",
    icon: <FcGlobe className="icon" />,
  },
  {
    name: "tickets/transport/flying-revenue/market-daily-tolls",
    title: "Market Daily Tolls",
    cat: "Market",
    icon: <FcFinePrint className="icon" />,
  },
  {
    name: "tickets/transport/flying-revenue/palm-produce",
    title: "PalmProduce",
    cat: "PalmProduce",
    icon: <FcCloseUpMode className="icon" />,
  },
  {
    name: "tickets/transport/flying-revenue/sand-beaches",
    title: "Sand Beaches",
    cat: "SandBeaches",
    icon: <FcShipped className="icon" />,
  },
  {
    name: "tickets/transport/flying-revenue/gate-pass",
    title: "Gate Pass",
    cat: "GatePass",
    icon: <FcEngineering className="icon" />,
  },
];