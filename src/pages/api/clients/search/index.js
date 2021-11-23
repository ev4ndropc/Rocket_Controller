import { getSession } from "next-auth/client"
import database from '../../../../database';

export default async function search(request, response) {
    const { value, where } = request.query;
    const session = await getSession({ req: request });
    if (!session)
        return response.status(401).json({ message: 'Unauthorized' });

    if (!value || !where)
        return response.status(400).json({ message: 'Bad Request' });

    try {
        const clients = await database('clients').where(`${where}`, 'like', `%${value}%`);
        response.status(200).json({ success: true, clients });
    } catch (error) {
        response.status(500).json({ error: error.message });
    }

}
