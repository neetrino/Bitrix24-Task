import { AccessStatus } from '@prisma/client';
import { auth } from '@/auth';
import { HomeLanding } from '@/features/marketing/HomeLanding';

export default async function HomePage() {
  const session = await auth();
  if (!session?.user) {
    return <HomeLanding variant="signed_out" />;
  }
  if (session.user.accessStatus === AccessStatus.ACTIVE) {
    return <HomeLanding variant="active" />;
  }
  return <HomeLanding variant="pending" />;
}
