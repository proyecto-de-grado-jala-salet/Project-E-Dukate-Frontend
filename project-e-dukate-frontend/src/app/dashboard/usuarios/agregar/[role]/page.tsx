import { AddUser } from '../../../../../pages/Users/AddUser';

interface RolePageParams {
  params: Promise<{ role: string }>;
}

export default async function RolePage({ params }: RolePageParams) {
  const { role } = await params;

  const validRole = role === 'administrador' ? 'Administrator' : role === 'especialista' ? 'Specialist' : null;

  return <AddUser initialRole={validRole} />;
}