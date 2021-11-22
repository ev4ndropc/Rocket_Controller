import { getSession } from "next-auth/client"
import database from '../../../../database';

export default async function listClients(request, response) {
  const session = await getSession({ req: request });
  if (!session)
    return response.status(401).json({ message: 'Unauthorized' });

  try {
    const clients = await database('clients');
    response.status(200).json({ success: true, clients });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }

}
