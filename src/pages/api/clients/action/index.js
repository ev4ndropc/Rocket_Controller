import { getSession } from "next-auth/client"
import database from '../../../../database';


export default async function deleteClient(request, response) {
    const { domain, state } = request.query;
    const session = await getSession({ req: request });
    if (!session)
        return response.status(401).json({ message: 'Unauthorized' });

    try {
        const change = await fetch('https://' + process.env.DOMAIN_HOST + ':8090/api/submitWebsiteStatus', {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": "{\"adminUser\":\"" + process.env.CYBERPANEL_ADMIN + "\",\"adminPass\":\"" + process.env.CYBERPANEL_PASS + "\",\"websiteName\":\"" + domain + "\",\"state\":\"" + state + "\"}"
        }).then(res => res.json());

        await database.update({ state }).from('clients').where('domain', domain);
        const clients = await database.select().from('clients').orderBy('expire_at', 'asc');
        var total_price = 0;

        clients.forEach(client => {
            if (client.price != null) {
                total_price = total_price + parseFloat(Number(client.price));
            }
        });
        return response.status(200).json({ success: true, clients, total_price, change });
    } catch (error) {
        return response.status(500).json({ error: error.message });
    }

}
