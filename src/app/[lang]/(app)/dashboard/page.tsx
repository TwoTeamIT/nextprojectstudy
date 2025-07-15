import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/get-dictionary";
import DashboardContent from "@/components/Dashboard/DashboardContent";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const masterDict = await getDictionary(lang);
  const dict = { ...masterDict.DashboardPage };

  return <DashboardContent dict={dict} />;
}
