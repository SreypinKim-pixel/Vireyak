interface IconProps {
  name: React.ReactNode;
  size?: number;
}

export default function Icon({ name, size = 20 }: IconProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        width: size,
        height: size,
      }}
    >
      {name}
    </span>
  );
}