import { AuditLogs } from "@/components/dashboard/AuditLogs";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Container } from "@/components/layout/Container";

export default function AuditLogsPage() {
  return (
    <PageWrapper>
      <Container className="py-8">
        <AuditLogs />
      </Container>
    </PageWrapper>
  );
}
