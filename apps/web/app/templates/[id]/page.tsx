import { TemplateDetailsPage } from "@/components/pages/template-details";

export default async function TemplateDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TemplateDetailsPage templateId={id} />;
}
