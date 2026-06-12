import { useEffect, useRef, useState } from "react";

export function InputOTPGroup({ onChangeFunc, type }: { onChangeFunc: (otp: string) => void; type: string }) {
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const [values, setValues] = useState(["", "", "", ""]);

  useEffect(() => {
    const filled = values.every(v => v !== "");
    onChangeFunc(filled ? values.join("") : "");
  }, [values]);

  const handleChange = (val: string, idx: number) => {
    if (!/^\d?$/.test(val)) return;
    const updated = [...values];
    updated[idx] = val;
    setValues(updated);
    if (val && idx < 3) inputRefs[idx + 1]?.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace" && !values[idx] && idx > 0) {
      inputRefs[idx - 1]?.current?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-2">
      {values.map((val, idx) => (
        <input
          key={idx}
          ref={inputRefs[idx]}
          type={type}
          value={val}
          onChange={(e) => handleChange(e.target.value, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          maxLength={1}
          className="w-10 h-10 text-center border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ))}
    </div>
  );
}
