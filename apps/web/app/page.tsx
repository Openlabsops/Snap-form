import { IndexPage } from "@/components/pages";
import { AuthenticatedRedirect } from "@/components/auth/authenticated-redirect";

export default function Home() {
  return (
    <AuthenticatedRedirect>
      <IndexPage />
    </AuthenticatedRedirect>
  );
}
