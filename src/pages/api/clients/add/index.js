import { getSession } from "next-auth/client"
import database from '../../../../database';


export default async function addClient(request, response) {
    const { name, contact, domain, expire_at } = request.body;

    const session = await getSession({ req: request });
    if (!session)
        return response.status(401).json({ message: 'Unauthorized' });

    if (!name || !contact || !expire_at || !domain)
        return response.status(400).json({ message: 'Bad Request' });

    try {
        await database('clients').insert({ name, contact, domain, expire_at });
        const clients = await database('clients').select();
        return response.status(201).json({ success: true, clients });
    } catch (error) {
        return response.status(500).json({ error: error.message });
    }

}
