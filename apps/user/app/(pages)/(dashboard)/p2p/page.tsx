import { SendAndSearchContacts } from "../../../../components/cards/sendAndSearch";
import { P2PTransactions } from "../../../../components/transactions folder/Dashboard-Pages/TxnsRedirectingBox";
import { getContacts } from "../../../lib/actions/getContacts";
import { getP2PTxns } from "../../../lib/actions/getP2P-txns";

export default async function P2PTransferPage() {
  const txns = await getP2PTxns();
  const contacts = await getContacts();

  return (
    <div className="w-full px-4 sm:px-6">
      <h1 className="mx-4 mt-20 text-3xl ml-20 sm:text-4xl bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 inline-block text-transparent bg-clip-text font-bold mb-6">
        P2P Transfer
      </h1>
      
      <div className="my-3 grid grid-cols-1 lg:grid-cols-4 gap-2">
        <div className="col-span-2 lg:col-span-2">
          <SendAndSearchContacts
            AllMyContacts={contacts.AllMyContacts}
            numberOfContacts={contacts.numberOfContacts || 0}
          />
        </div>

        <div className="col-span-1 lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 w-full shadow-sm w-max">
            <P2PTransactions transactions={txns?.tx || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
