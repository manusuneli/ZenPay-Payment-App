interface LabelledInputProps {
  label: string;
  placeholder?: string;
  onChangeFunc: (value: string) => void;
  value?: string;
  type?: string;
  maxi?: number;
}

export default function LabelledInput({
  label,
  placeholder,
  onChangeFunc,
  value,
  type,
  maxi
}: LabelledInputProps) {
  return (
    <div className="w-full">
      <div className="mb-1 sm:mb-2 text-xs sm:text-sm font-semibold text-gray-900">
        {label}
      </div>
      <input
        type={type}
        value={value}
        onChange={e => onChangeFunc(e.target.value)}
        inputMode={type === "tel" ? "numeric" : undefined}
        pattern={type === "tel" ? "[0-9]*" : undefined}
        placeholder={placeholder}
        maxLength={maxi}
        className="border border-gray-300 h-9 sm:h-10 rounded-lg w-full bg-gray-50 p-2.5 text-xs sm:text-sm text-gray-900 focus:ring-blue-500"
      />
    </div>
  );
}
