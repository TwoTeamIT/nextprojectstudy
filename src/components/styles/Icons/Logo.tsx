import logo from "@/assets/logo.svg";
import Image from "next/image";

type LogoProps = {
  size?: number | undefined;
  className?: string | undefined;
};

export default function Logo({ size, className }: LogoProps) {
  const dimension = size ? size : 42;

  return (
    <Image
      src={logo.src}
      width={dimension}
      height={dimension}
      alt={"Logo"}
      className={className}
    />
  );
}
