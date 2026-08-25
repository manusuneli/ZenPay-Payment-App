import { SendAndSearchContacts } from "../../../../components/cards/sendAndSearch";
import { P2PTransactions } from "../../../../components/transactions folder/Dashboard-Pages/TxnsRedirectingBox";
import { getContacts } from "../../../lib/actions/getContacts";
import { getP2PTxns } from "../../../lib/actions/getP2P-txns";

export default async function P2PTransferPage() {
  const txns = await getP2PTxns();
  const contacts = await getContacts();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-14">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">P2P Transfer</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Send funds directly to other wallet users instantly</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="w-full col-span-1 lg:col-span-7">
          <SendAndSearchContacts
            AllMyContacts={contacts.AllMyContacts}
            numberOfContacts={contacts.numberOfContacts || 0}
          />
        </div>

        <div className="w-full col-span-1 lg:col-span-5">
          <P2PTransactions transactions={txns?.tx || []} />
        </div>
      </div>
    </div>
  );
}
