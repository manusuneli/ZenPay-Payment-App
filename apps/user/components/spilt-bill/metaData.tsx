// components/Metadata.tsx
export default function Metadata({
  description,
  createdBy,
  createdAt,
}: {
  description: string;
  createdBy: string;
  createdAt: Date;
}) {
  return (
    <div className="space-y-2">
      <h2 className="text-lg md:text-xl font-semibold text-gray-800">{description}</h2>
      <p className="text-sm text-gray-600">
        Created on <span className="font-medium">{createdAt.toLocaleString()}</span>
      </p>
      <p className="text-sm text-gray-500">
        Created by <span className="font-semibold text-[#a259ff]">{createdBy}</span>
      </p>
    </div>
  );
}
