import { getSession } from "next-auth/client"
import database from '../../../../database';

export default async function deleteClient(request, response) {
    const { id, domain, } = request.query;
    const session = await getSession({ req: request });
    if (!session)
        return response.status(401).json({ message: 'Unauthorized' });

    try {
        await database.delete().from('clients').where('id', id);
        const clients = await database.select().from('clients').orderBy('expire_at', 'asc');
        var total_price = 0;

        clients.forEach(client => {
            if (client.price != null) {
                total_price = total_price + parseFloat(Number(client.price));
            }
        });
        return response.status(200).json({ success: true, clients, total_price });
    } catch (error) {
        return response.status(500).json({ error: error.message });
    }

}
