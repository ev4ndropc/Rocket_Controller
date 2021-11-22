import { getSession } from "next-auth/client"
import database from '../../../../database';

export default async function listClients(request, response) {
    const { id } = request.query;
    const session = await getSession({ req: request });
    if (!session)
        return response.status(401).json({ message: 'Unauthorized' });

    try {
        await database.delete().from('clients').where('id', id);
        const clients = await database.select().from('clients');
        response.status(200).json({ success: true, clients });
    } catch (error) {
        response.status(500).json({ error: error.message });
    }

}