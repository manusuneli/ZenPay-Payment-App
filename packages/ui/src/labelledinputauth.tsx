
interface LabelledInputProps {
    label : string;
    placeholder : string;
    onChangeFunc : (value : string) => void,
    type?: string;
    otp ?: boolean
    value ?: string; 
}


export default function LabelledInputAuth({label, placeholder, onChangeFunc, type, otp, value} : LabelledInputProps)
{
    return (
        <div>
            <div className="mb-2 text-sm font-bold text-gray-900">
                {label}
            </div>
            {type == "tel" ? 
            <input value={value} onChange={(e) => {
                onChangeFunc(e.target.value);
            }} placeholder={placeholder} inputMode={"numeric"} pattern="[0-9]{10}" minLength={10} maxLength={10} type={type} required className="py-5 border border-gray-300 h-9 rounded-lg w-full bg-gray-50 p-2.5 text-gray-900 text-md focus:ring-blue-500"></input> : 
            
            <input value={value} onChange={(e) => {
                onChangeFunc(e.target.value);
            }} placeholder={placeholder} type={type} required className="py-5 border border-gray-300 h-9 rounded-lg w-full bg-gray-50 p-2.5 text-gray-900 text-md focus:ring-blue-500"></input>
            }
            
        </div>
    )
}