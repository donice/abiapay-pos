"use client"

import { GoBackButton } from '@/src/components/common/button'
import { CustomHeader } from '@/src/components/common/header'
import React from 'react'
import AddTrafficOffenceTicketForm from './form'
import { useForm } from 'react-hook-form'

const AddTrafficOffenceTicket = ({ show, setShow }: any) => {

  
  const [selectedType, setSelectedType] = React.useState("");
  const [selectedVehicleType, setSelectedVehicleType] = React.useState("");
  return (
    <section>
      <GoBackButton />
      <div className="">
        <header>
          <CustomHeader title="Add Traffic Offence Ticket" desc="Create Traffic Offence Ticket"/>
        </header>

        <div className="">
          <AddTrafficOffenceTicketForm
            setSelectedType={setSelectedType}
            setSelectedVehicleType={setSelectedVehicleType}
          />
        </div>
      </div>
    </section>
  );
}

export default AddTrafficOffenceTicket