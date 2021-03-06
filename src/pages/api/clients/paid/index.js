import { getSession } from "next-auth/client"
import moment from 'moment';

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
        var new_date_expire = moment(`${client.expire_at}`).add(moment(`${client.expire_at}`).daysInMonth(), 'days').calendar().split('/').join('-');
        new_date_expire = new_date_expire.split('-')[2] + '-' + new_date_expire.split('-')[1] + '-' + new_date_expire.split('-')[0];

        await database('clients').update({ expire_at: new_date_expire }).where({ id });
        const clients = await database('clients').select().orderBy('expire_at', 'asc');
        return response.status(201).json({ success: true, clients, new_date_expire });
    } catch (error) {
        return response.status(500).json({ error: error.message });
    }

}
