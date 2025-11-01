import ChatBox from '@/components/dashboard/Chatbox'
import React from 'react'

export default async function Page({ params }: { params: { id: string } }) {
  const { id } =await  params; // userId from URL
  return (
    <div className='w-full'>
      <ChatBox userId={id}/>
    </div>
  )
}

// export default page