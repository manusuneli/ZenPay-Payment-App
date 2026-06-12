export default function Header({ title }: { title: string }) {
  return (
    <div className="w-full bg-[#a259ff] px-6 py-5">
      <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
    </div>
  );
}
