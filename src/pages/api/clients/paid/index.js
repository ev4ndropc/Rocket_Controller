import { getSession } from "next-auth/client"
import moment from 'moment';
moment.locale('pt-br');
import database from '../../../../database';


export default async function addClient(request, response) {
    const { id } = request.query;

    const session = await getSession({ req: request });
    if (!session)
        return response.status(401).json({ message: 'Unauthorized' });

    if (!id)
        return response.status(400).json({ message: 'Bad Request' });

    try {
        var client = await database('clients').where({ id }).first()

        var new_date_expire = moment(client.expire_at).unix() + 2592000;

        new_date_expire = moment(new_date_expire).format('YYYY-MM-DD');

        await database('clients').update({ expire_at: new_date_expire }).where({ id });
        const clients = await database('clients').select();
        return response.status(201).json({ success: true, clients });
    } catch (error) {
        return response.status(500).json({ error: error.message });
    }

}
