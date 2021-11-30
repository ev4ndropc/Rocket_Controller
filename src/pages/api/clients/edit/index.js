import { getSession } from "next-auth/client"
import database from '../../../../database';

export default async function editClient(request, response) {
    const { id, name, contact, domain, price, expire_at } = request.body;

    const session = await getSession({ req: request });
    if (!session)
        return response.status(401).json({ message: 'Unauthorized' });

    if (!id || !name || !contact || !expire_at)
        return response.status(400).json({ message: 'Bad Request' });


    try {
        const update = await database.update({
            name: name,
            contact: contact,
            domain: domain,
            price: price,
            expire_at: expire_at
        }).table('clients').where({ id: id });

        const clients = await database.select().table('clients').orderBy('expire_at', 'asc');
        var total_price = 0;

        clients.forEach(client => {
            if(client.price != null) {
                total_price = parseFloat(total_price).toFixed(2)+parseFloat(client.price).toFixed(2);
            }
        });

        response.status(200).json({ success: true, clients, total_price });
    } catch (error) {
        response.status(500).json({ error: error.message });
    }

}
