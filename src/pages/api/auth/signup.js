import bcrypt from 'bcrypt';
import database from '../../../database';

export default function handler(request, response) {
    const { email, password } = request.body;

    if (!email || !password) {
        return response.status(400).json({
            error: 'Email and password are required.',
        });
    }

    const hash = bcrypt.hashSync(password, 10);

    database('users').insert({
        email,
        password: hash,
    }).then(() => {
        return response.status(201).json({
            message: 'User created successfully.',
        });
    }).catch(error => {
        return response.status(500).json({
            error: error.message,
        });
    });

}
