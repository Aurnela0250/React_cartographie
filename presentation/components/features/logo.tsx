import Image from "next/image";

export default function Logo() {
    return (
        <Image
            alt="OrientaMada"
            className="size-8"
            height={32}
            src="/logo-royal.svg"
            width={32}
        />
    );
}
