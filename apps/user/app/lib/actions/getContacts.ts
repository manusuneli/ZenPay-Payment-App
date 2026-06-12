"use server"
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "../../lib/auth";
import { prisma } from "@repo/db/client";

export async function getContacts() {
  try {
    const session = await getServerSession(NEXT_AUTH);
    const id = session?.user?.id;

    if (id) {
      
      const userAllContacts = await prisma.contact.findMany({
          where: {
            userId: Number(id),
          },
          include: {
            contact: true     // pura contact hi utha lo 
          }
      })
      const numberOfContacts = userAllContacts.length;
      let AllMyContacts : any = [];
      if(userAllContacts)
      {
        AllMyContacts = userAllContacts.map((c) => ({
          // ye contactId, user ki hi hai jo contact hai
          contactId: c.contactId,
          contactName: c.contact.name,
          contactEmail: c.contact.email,
          contactNumber: c.contact.number
        }));
      }
      
        return {
          AllMyContacts, numberOfContacts
        }
    }
    return { 
        error: "Unauthorized"
    }
  } catch (e) {
    console.error("Error Occurred in Contact Fetching", e);
    return { 
        error: "Internal Server Error" 
    };
  }
}
