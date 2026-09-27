import Image from "next/image";
import Link from "next/link";

export default function Brand() {
  return (
    <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
      <Image 
        src="/Logo.png" 
        alt="Vireyak Logo" 
        width={400}
        height={100}
        priority
        className="h-18 w-auto object-contain"
      />
    </Link>
  );
}