import { TemplateDetailsPage } from "@/components/pages/template-details";

export default function TemplateDetails({
  params,
}: {
  params: { id: string };
}) {
  return <TemplateDetailsPage templateId={params.id} />;
}
