import { notFound } from "next/navigation";
import TestLanding from "./TestLanding";

export const metadata = {
  title: "NLOCK — NLOCK your full potential",
  description: "Uma nova experiência visual NLOCK para coaches que querem operar com mais foco, contexto e controlo.",
  robots: { index: false, follow: false },
};

export default function TestPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <TestLanding />;
}
