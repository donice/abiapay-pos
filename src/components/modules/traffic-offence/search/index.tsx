"use client";


import { GoBackButton } from '@/src/components/common/button'
import { CustomHeader } from '@/src/components/common/header'
import React, { useState } from 'react'
import Form from './form'
import { useRouter } from 'next/navigation'
import { CamelCaseToTitleCase } from '@/src/utils/helper';
import { GoVerified } from 'react-icons/go';
import { RiLoaderLine } from 'react-icons/ri';
import Empty from '@/src/components/common/empty';
import { formatAmount } from '@/src/utils/formatAmount';
import { TbLoader } from 'react-icons/tb';
import "./style.scss";


const SearchTrafficTicket = () => {
    const router = useRouter();
  const [ticketsData, setTicketsData] = useState([]);
  const [searched, setSearched] = useState(false);

  if (ticketsData) {
    sessionStorage.setItem("TICKETS_DATA", JSON.stringify(ticketsData));
  }
  
  return (
    <section>
        <GoBackButton/>

        <div className="find">
            <header>
                <CustomHeader title='Search Traffic Offence Ticket' desc=' ' />    
            </header>

            <div className="find-comp-form">
               <Form setTicketsData={setTicketsData} setSearched={setSearched}/> 
               <div className="main-table">
               {ticketsData && ticketsData.length > 0 ? (
            <div className="main-table_form_tickets_container">
              <div className="tickets">
                {ticketsData.map((transaction: any, index: number) => (
                  <div
                    key={index}
                    className="ticket"
                    onClick={() =>
                      router.push(
                        `/traffic-offence/traffic-ticket-history/${transaction.payment_reference}`
                      )
                    }
                  >
                    <div>
                    <p>{transaction.plate_number}</p>
                    <p>{transaction.offence_type}</p>
                      <p>{transaction.payment_reference}</p>
                    </div>
                     <div>
                                     <p>₦{formatAmount(transaction.amount)}</p>
                                     <p
                                       className={`${
                                         transaction.status === "Completed"
                                           ? "completed"
                                           : "pending"
                                       }`}
                                     >
                                       {transaction.status === "Completed" ? (
                                         <GoVerified />
                                       ) : (
                                         <TbLoader />
                                       )}
                                       {transaction.status}
                                     </p>
                   
                                     
                                   </div>
                  </div>
                ))}
              </div>
            </div>
          ) : searched ? (
            <Empty text="No Plate Number Found" />
          ) : null}
               </div>

             
            </div>
        </div>
    </section>
  )
}

export default SearchTrafficTicket