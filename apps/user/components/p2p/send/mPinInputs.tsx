import { Button } from "@repo/ui/button";
import { InputOTPGroup } from "../../inputotpgroup";

export default function MPinInput({ onChange, onSubmit, isLoading }: {
  onChange: (pin: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-gray-700 text-center">Enter MPIN</div>
      <div className="flex justify-center">
        <InputOTPGroup type="password" onChangeFunc={onChange} />
      </div>
      <div className="flex justify-center">
        <Button state={isLoading} onClickFunc={onSubmit}>
          {isLoading ? "Transferring..." : "Transfer"}
        </Button>
      </div>
    </div>
  );
}
