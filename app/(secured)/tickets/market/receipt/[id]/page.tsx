import { GoBackButton } from '@/src/components/common/button'
import ViewReceiptComponent from '@/src/components/modules/tickets/market/receipt'
import React from 'react'

const ViewReceiptPage = ({ params }: { params: { id: string } }) => {


  return (
    <div>
      <GoBackButton />
      <ViewReceiptComponent id={params.id}/>
    </div>
  )
}

export default ViewReceiptPage