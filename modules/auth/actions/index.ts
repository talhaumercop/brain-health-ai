'use server'

import { auth } from "@/auth"
import { db } from "@/lib/db"

export const getUserById = async(id:any) => {
  try {
    const user = await db.user.findUnique({
      where: {id: id},
      include: {accounts: true}
    });
    return user;
  } catch (error) {
    console.log('Error in getUserById:', error);
    return null;
  }
}

export const getAccountByUserId = async(userId:any) => {
  try {
    const account = await db.account.findFirst({
      where: {userId: userId}
    });
    return account;
  } catch (error) {
    console.log('Error in getAccountByUserId:', error);
    return null;
  }
}

export const currentUser = async() => {
  const user = await auth();
  return user?.user;
}