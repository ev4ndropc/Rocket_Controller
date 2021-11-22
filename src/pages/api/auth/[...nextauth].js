import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import database from '../../../database'
import bcrypt from 'bcrypt'

const providers = [
    Providers.Credentials({
        name: 'Credentials',
        credentials: {
            email: { label: "Email", type: "email", placeholder: "john@doe.com" },
            password: { label: "Password", type: "password", placeholder: "********" },
        },
        authorize: async (credentials) => {
            const { email, password } = credentials
            if (!email || !password)
                return null

            const user = await database.select().where({ email }).table('users').first()

            if (!user)
                return null

            if (!bcrypt.compareSync(password, user.password))
                return null

            return user
        }
    })
]

const callbacks = {
    // Getting the JWT token from API response
    async jwt(token, user) {
        if (user) {
            token.accessToken = user.token
        }

        return token
    },

    async session(session, token) {
        session.accessToken = token.accessToken
        return session
    },

    redirect: async (url, baseUrl) => {
        return url.startsWith(baseUrl)
            ? Promise.resolve(url)
            : Promise.resolve(baseUrl)
    }

}

const jwt = {
    secret: process.env.JWT_SECRET,
    expiresIn: '1d',
}

const pages = {
    signIn: '/auth/signin',
}


const options = {
    providers,
    callbacks,
    jwt,
    pages
}


// eslint-disable-next-line import/no-anonymous-default-export
export default (req, res) => NextAuth(req, res, options)