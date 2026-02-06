import GroupSportTicketsComponent from '@/src/components/modules/tickets/sport/group'
import React from 'react'

const GroupSportTicketsPage = ({ params }: { params: { slug: string } }) => {
  const slug = params.slug
  
  return (
    <div><GroupSportTicketsComponent category={slug} /></div>
  )
}

export default GroupSportTicketsPage