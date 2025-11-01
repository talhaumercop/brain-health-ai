import ChatBox from '@/components/dashboard/Chatbox'
import { auth } from '@/auth'
import React from 'react'

export default async function Page() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return <div className="text-red-500 text-center mt-10">Unauthorized</div>
  }

  return (
    <div className='w-full'>
      <ChatBox userId={userId}/>
    </div>
  )
}
