import SingleSportTicketsComponent from '@/src/components/modules/tickets/sport/single'
import React from 'react'

const SingleSportTicketsPage = ({ params }: { params: { slug: string } }) => {
  const slug = params.slug
  
  return (
    <div><SingleSportTicketsComponent category={slug} /></div>
  )
}

export default SingleSportTicketsPage