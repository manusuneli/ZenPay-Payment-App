interface RawContact {
  contactId: number;
  contactName: string;
  contactEmail: string;
  contactNumber?: string;
}

interface Props {
  contacts: RawContact[];
  selected: string;
  onSelect: (number: string) => void;
}

export default function ContactTable({ contacts, selected, onSelect }: Props) {
  return (
    <div className="overflow-x-auto border rounded-lg max-h-52 overflow-y-auto mb-4">
      <table className="w-full text-xs sm:text-sm text-left text-gray-500">
        <thead className="uppercase bg-gray-50">
          <tr>
            <th className="px-3 py-2 sm:px-4 sm:py-3">Name</th>
            <th className="px-3 py-2 sm:px-4 sm:py-3">Phone</th>
            <th className="px-3 py-2 sm:px-4 sm:py-3">Email</th>
          </tr>
        </thead>
        <tbody>
          {contacts.length ? (
            contacts.map(c => (
              <tr
                key={c.contactId}
                className={`cursor-pointer hover:bg-gray-100 ${
                  selected === c.contactNumber ? "bg-blue-50" : "bg-white"
                }`}
                onClick={() => onSelect(c.contactNumber || "")}
              >
                <td className="px-3 py-2 sm:px-4 sm:py-3 font-medium">
                  {c.contactName}
                </td>
                <td className="px-3 py-2 sm:px-4 sm:py-3">
                  {c.contactNumber || "-"}
                </td>
                <td className="px-3 py-2 sm:px-4 sm:py-3">
                  {c.contactEmail}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={3}
                className="text-center py-6 text-gray-500 text-xs sm:text-sm"
              >
                No contacts found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
