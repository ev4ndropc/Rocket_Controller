import { getSession } from "next-auth/client"
import database from '../../../../database';

export default async function listClients(request, response) {
    const { id, name, contact, expire_at } = request.body;

    const session = await getSession({ req: request });
    if (!session)
        return response.status(401).json({ message: 'Unauthorized' });

    if (!id || !name || !contact || !expire_at)
        return response.status(400).json({ message: 'Bad Request' });


    try {
        const clients = await database.update().table('clients').set({
            name: name,
            contact: contact,
            expire_at: expire_at
        }).where({ id: id });

        response.status(200).json({ success: true, clients });
    } catch (error) {
        response.status(500).json({ error: error.message });
    }

}
