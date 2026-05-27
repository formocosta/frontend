import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-zinc-50 dark:bg-black">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold underline">adinis!</h1>
      </div>
    </header>
  );
}
