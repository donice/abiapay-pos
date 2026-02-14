"use client";
import { Button } from "@/src/components/common/button";
import { FormTextInput, SelectInput } from "@/src/components/common/input";
import { useDebounce } from "@/src/hooks/useDebounce";
import { fetchBillProducts } from "@/src/services/billServices";
import { fetchABSSINInfo, fetchTaxOffice } from "@/src/services/common";
import { useQuery } from "react-query";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import "./style.scss";
import { createBill } from "@/src/services/billServices";
import {  useRouter } from "next/navigation";


const CreateBillModule = () => {
  const { register, handleSubmit, setValue, watch } = useForm();

  const router = useRouter();

  const onSubmit = async (formData: any) => {
    if (!selectedProduct) {
      toast.error("Please select a product");
      return;
    }
    console.log(selectedProduct)

    const requestBody = {
      taxpayer_id: formData.taxpayer_id,
      full_name: formData.full_name,
      email: formData.email || "", 
      phone_number: formData.phone_number,
      revenue_office: formData.revenue_office,
      occurrence: selectedProduct.paymentFrequency,
      items: selectedProduct.items.map((item: any) => ({
        rev_item_name: item.productname || "Unknown",
        amount: Number(item.amount) || 0,
        rev_code: item.rev_code || "N/A",
      })),
    };

    try {
      await createBill(requestBody);
      toast.success("Bill created successfully");
      router.push('/bills');
    } catch (error: any) {
      toast.error(error.message || "Failed to create bill");
    }
  };

  const abssin = watch("taxpayer_id");
  const debouncedAbssin = useDebounce(abssin, 300);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);


  const { data: revenueOfficesData } = useQuery({
    queryKey: ["revenue_offices"],
    queryFn: async () => {
      return await fetchTaxOffice();
    },
  });

  const { data, isError, isLoading } = useQuery({
    queryKey: ["get_bills_products"],
    queryFn: () => fetchBillProducts(),
  });

  const selectedProductId = watch("product");
  useEffect(() => {
    console.log("Products List:", products);
    console.log("Selected Product ID:", selectedProductId);
    const foundProduct = products.find((p: any) => p.id === Number(selectedProductId));
    console.log("Found Product:", foundProduct);
    setSelectedProduct(foundProduct || null);
  }, [selectedProductId, products]);
  
  

  
  useEffect(() => {
    if (data?.response_data) {
      console.log("data",data.response_data.map((bill:any) => ({
        items:bill.productname
      })));
      const extractedBills = data.response_data.map((bill:any) => ({
        id: bill.id,
        productname: bill.productname || "No product",
        totalamount: bill.totalamount || "0",
        collectionTitle: bill.collectionTitle || "N/A", 
        paymentFrequency: bill.paymentFrequency || "N/A", 
        items: bill.items || [], 
        amount: bill?.totalamount || "0", 
        occurrence: bill.occurrence || "N/A",
      }));
      console.log("extractedBills",extractedBills);
      setProducts(extractedBills);
    }
  
  }, [data]);
  


  useEffect(() => {
    if (debouncedAbssin) {
      const getPlateNumberInfo = async (req: string) => {
        try {
          const response = await fetchABSSINInfo({ id: req });

          if (response.data?.length !== 0) {
            toast.success(response.message);
            setValue(
              "full_name",
              response.data.firstname +
                " " +
                response.data.middle_name +
                " " +
                response.data.lastname
            );
            setValue("phone_number", response.data.phone_number);
          }
        } catch (error) {
          console.log(error);
        }
      };

      getPlateNumberInfo(debouncedAbssin);
    }
  }, [debouncedAbssin, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 mb-40">
      <SelectInput
        label={"Taxpayer Type"}
        name={"taxpayer_type"}
        id={"taxpayer_type"}
        register={register}
        options={[
          {
            label: "Individual",
            value: "individual",
          },
          {
            label: "Corporate",
            value: "corporate",
          },
        ]}
      />

      <FormTextInput
        label="ABSSIN"
        name="taxpayer_id"
        register={register}
        validation={{ required: true }}
        placeholder="Enter ABSSIN"
      />
      <FormTextInput
        label="Taxpayer Name"
        name="full_name"
        register={register}
        validation={{ required: true }}
        placeholder="Enter Taxpayer Name"
      />
      <FormTextInput
        label="Taxpayer Phone"
        name="phone_number"
        register={register}
        validation={{ required: true }}
        placeholder="Enter Taxpayer Phone"
      />

      <SelectInput
        label={"Revenue Office"}
        name={"revenue_office"}
        id={"revenue_office"}
        register={register}
        options={revenueOfficesData?.data.map((office: any) => ({
          label: office.name,
          value: office.idstation,
        }))}
      />

      <SelectInput
        label={"Bill Product"}
        name={"product"}
        id={"product"}
        register={register}
        options={products?.map((product: any) => ({
          label: `${product.productname} - ${product.amount}`,
          value: product.id,
        }))}
      />

      


{selectedProduct && (
  <>
  
   
        <div className="bill-details">
          {/* <h3>Bill Details</h3> */}
          <p>
            <strong>Collection Title:</strong> {selectedProduct.productname}
          </p>
          <p>
            <strong>Payment Frequency:</strong> {selectedProduct.occurrence}
          </p>

          {/* Bill Revenue Items */}
          <h4>Bill Revenue Items</h4>
          <table>
            <thead>
              <tr>
                <th>Revenue Code</th>
                <th>Revenue Item</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {selectedProduct.items.map((item: any, index: number) => (
                <tr key={index}>
                  <td>{item.rev_code}</td>
                  <td>{item.rev_item}</td>
                  <td>₦{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            <strong>Total Bill Amount: ₦</strong>{selectedProduct.totalamount}
          </p>
        </div>
        </>
      )}

      
        <Button text={"Create Bill"}  />
    </form>
  );
};

export default CreateBillModule;
