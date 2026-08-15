import { notFound } from "next/navigation";
import DashboardPreview from "./DashboardPreview";

export const metadata = {
  title: "NLOCK App Preview",
  robots: { index: false, follow: false },
};

export default function NlockAppPreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <DashboardPreview />;
}
