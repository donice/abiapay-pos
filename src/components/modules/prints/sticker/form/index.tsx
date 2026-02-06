"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import {
  fetchBulkPrintsData,
  searchBulkPrintsData,
  searchBulkPrintsGroupData,
  FetchBulkPrintsPayload,
} from "@/src/services/bulkPrintsService";
import { fetchLGAData } from "@/src/services/common";
import { Button } from "@/src/components/common/button";
import { FormTextInput, SelectInput } from "@/src/components/common/input";
import "./style.scss";

interface LGA {
  label: string;
  value: string;
}

const BulkPrintForm = ({ setBulkData, setViewData, setStickerLga }: any) => {
  const [selectedOption, setSelectedOption] = useState<
    "bulk" | "search" | "multi"
  >("bulk");

  const [searchTerm, setSearchTerm] = useState("");
  const [multiSearchInput, setMultiSearchInput] = useState("");
  const [lga, setLga] = useState<LGA[]>([]);

  const getLgas = async () => {
    try {
      const { data } = await fetchLGAData();
      setLga(
        data?.map((item: any) => ({
          label: item.lgaName,
          value: item.lgaID,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLgas();
  }, []);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: "Transport",
      lga: null,
      card_type: "sticker",
      no_of_cards: "",
      page: 1,
      previous_print: "false",
      start_date: "",
      end_date: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FetchBulkPrintsPayload) => fetchBulkPrintsData(data),
    onSuccess: (data) => {
      if (data?.response_code === "00") {
        toast.success(data?.response_message || "Data Fetched Successfully");
        setBulkData(data?.response_data.data);
        setStickerLga(data?.response_data.lga_name);
        setViewData("data");
      } else {
        toast.error(data?.response_message);
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });


  const { mutate: searchMutate, isPending: isSearching } = useMutation({
    mutationFn: (data: { ref: string }) => searchBulkPrintsData(data),
    onSuccess: (data) => {
      if (data?.response_code === "00") {
        const result = data?.response_data;
        const normalized = Array.isArray(result) ? result : [result];

        setBulkData(normalized);
        setStickerLga(data?.response_data?.lga_name || "");
        setViewData("data");
        toast.success("Search successful");
      } else {
        toast.error(data?.response_message);
      }
    },
    onError: () => toast.error("Search failed"),
  });

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast.error("Enter ABSSIN");
      return;
    }

    searchMutate({ ref: searchTerm });
  };

  const {
    mutate: multiSearchMutate,
    isPending: isMultiSearching,
  } = useMutation({
    mutationFn: (data: any) => searchBulkPrintsGroupData(data),
    onSuccess: (data: any) => {
      if (data?.response_code === "00") {
        const result = data.response_data.data;
        const normalized = Array.isArray(result) ? result : [result];

        setBulkData(normalized);
        setViewData("data");

        toast.success("Multi-search successful");
      } else {
        toast.error(data?.response_message || "Multi-search failed");
      }
    },
    onError: () => toast.error("Error performing multi-search"),
  });

  const handleMultiSearch = () => {
    let ids = multiSearchInput
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    if (ids.length === 0) {
      toast.error("Please enter ABSSINs separated by commas");
      return;
    }

    const payload = {
      plate_number: ids.join(","),
      card_type: "sticker",
      no_of_cards: 0,
      page: 1,
    };

    multiSearchMutate(payload);
  };


  const onSubmit = (reqData: any) => {
    reqData.previous_print = reqData.previous_print === "true";
    mutate(reqData);
  };

  return (
    <div className="bulk_print_page">
      {/* ---- TABS ---- */}
      <div className="tab_selector">
        <button
          className={selectedOption === "bulk" ? "active" : ""}
          onClick={() => setSelectedOption("bulk")}
        >
          Bulk Print
        </button>

        <button
          className={selectedOption === "search" ? "active" : ""}
          onClick={() => setSelectedOption("search")}
        >
          Search
        </button>

        <button
          className={selectedOption === "multi" ? "active" : ""}
          onClick={() => setSelectedOption("multi")}
        >
          Multi Search
        </button>
      </div>


      {selectedOption === "search" && (
        <div className="search_wrapper">
          <FormTextInput
            label="Search by ABSSIN"
            type="text"
            name="searchTerm"
            value={searchTerm}
            onChange={(e: any) => setSearchTerm(e.target.value)}
            onKeyDown={(e: any) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
          />
          <Button text="Search" onClick={handleSearch} loading={isSearching} />
        </div>
      )}

      {selectedOption === "multi" && (
        <div className="multi_search_wrapper">
          <label className="form_label">Search Multiple ABSSINs</label>

          <FormTextInput
            label="Enter ABSSINs separated by commas (e.g. 12345, 77889, 99001)"
            type="text"
            name="searchTerm"
            value={multiSearchInput}
            onChange={(e: any) => setMultiSearchInput(e.target.value)}
            onKeyDown={(e: any) => {
              if (e.key === "Enter"&& !e.shiftKey) {
                e.preventDefault();
                handleMultiSearch();
              }
            }}
          />

          <Button
            text="Search"
            onClick={handleMultiSearch}
            loading={isMultiSearching}
          />
        </div>
      )}

      {selectedOption === "bulk" && (
        <form onSubmit={handleSubmit(onSubmit)} className="emblem_form">
          <SelectInput
            label="LGA"
            name="lga"
            id="lga"
            register={register}
            validation={{ required: true }}
            error={!!errors.lga}
            options={lga}
          />

          <FormTextInput
            label="Number of Cards"
            type="number"
            name="no_of_cards"
            placeholder="Enter Number of Cards"
            register={register}
            validation={{ required: true }}
            error={errors.no_of_cards}
          />

          <FormTextInput
            label="Page"
            type="number"
            name="page"
            placeholder="Enter Page Number"
            register={register}
            validation={{ required: true }}
            error={errors.page}
          />

          <div className="date_group">
            <FormTextInput
              label="Start Date"
              type="date"
              name="start_date"
              placeholder="Select Start Date"
              register={register}
              validation={{ required: true }}
              error={errors.start_date}
            />

            <FormTextInput
              label="End Date"
              type="date"
              name="end_date"
              placeholder="Select End Date"
              register={register}
              validation={{ required: true }}
              error={errors.end_date}
            />
          </div>

          <div className="form_group">
            <label className="form_label">Print Type</label>
            <div className="radio_group">
              <label>
                <input
                  type="radio"
                  value="false"
                  {...register("previous_print", { required: true })}
                />
                New Print
              </label>
              <label style={{ marginLeft: "1rem" }}>
                <input
                  type="radio"
                  value="true"
                  {...register("previous_print", { required: true })}
                />
                Reprint
              </label>
            </div>
            {errors.previous_print && (
              <span className="error">Print type is required</span>
            )}
          </div>

          <Button text="Fetch Data" loading={isPending} disabled={isPending} />
        </form>
      )}
    </div>
  );
};

export default BulkPrintForm;
