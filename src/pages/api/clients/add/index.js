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
        await database('clients').insert({ name, contact, domain, price, expire_at });
        const clients = await database('clients').select().orderBy('expire_at', 'asc');

        var total_price = 0;

        clients.forEach(client => {
          total_price += parseFloat(client.price).toFixed(2);
        });

        return response.status(201).json({ success: true, clients, total_price });
    } catch (error) {
        return response.status(500).json({ error: error.message });
    }

}
