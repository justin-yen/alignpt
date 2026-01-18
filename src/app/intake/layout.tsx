import { IntakeProvider } from "@/context/IntakeContext";

export default function IntakeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <IntakeProvider>{children}</IntakeProvider>;
}
