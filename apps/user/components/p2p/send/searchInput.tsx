import { FaSearch } from "react-icons/fa";

export default function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="space-y-1 mb-4">
      <h2 className="text-sm sm:text-base font-medium text-gray-800">
        Search Contact
      </h2>
      <div className="flex items-center border rounded-lg px-3 py-2 sm:px-4 sm:py-3 bg-white">
        <FaSearch className="text-gray-400 mr-2 text-xs sm:text-sm" />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Search contacts…"
          className="w-full outline-none text-sm sm:text-base text-gray-700"
        />
      </div>
    </div>
  );
}
