import bcrypt from 'bcrypt';
import { getSession } from "next-auth/client"

import database from '../../../database';

export default async function handler(request, response) {
    const { email, password } = request.body;

    const session = await getSession({ req: request });
    if (!session)
        return response.status(401).json({ message: 'Unauthorized' });

    if (!email || !password) {
        return response.status(400).json({
            error: 'Email and password are required.',
        });
    }

    const hash = bcrypt.hashSync(password, 10);

    database('users').update({
        email,
        password: hash,
    })
        .where({ email })
        .then(() => {
            return response.status(201).json({
                success: true,
                message: 'User update successfully.',
            });
        }).catch(error => {
            return response.status(500).json({
                error: error.message,
            });
        });

}
