import Head from 'next/head'
import { createBreakpoints } from "@chakra-ui/theme-tools"
import { getCsrfToken, getSession } from "next-auth/client"
import { Flex, chakra, FormControl, FormLabel, Input, Button } from "@chakra-ui/react"



export default function SignIn({ csrfToken }) {

    const breakpoints = createBreakpoints({
        sm: "30em",
        md: "48em",
        lg: "62em",
        xl: "80em",
        "2xl": "96em",
    })
    return (
        <>
            <Head>
                <title>Logar no painel</title>
            </Head>
            <Flex w="100%" p="12px 24px" h="100vh" bgColor="gray.300" justifyContent="center" alignItems="center">
                <Flex w="100%" maxW="400px" h="auto" bgColor="white" p={{ base: '1.5rem', sm: "2rem", md: "2rem", lg: "3rem" }} borderRadius="md" boxShadow="md">
                    <chakra.form w="100%" method="post" action="/api/auth/callback/credentials">
                        <Input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                        <FormControl>
                            <FormLabel>Endereço de Email</FormLabel>
                            <Input name="email" type="email" placeholder="Email" />
                        </FormControl>
                        <FormControl mt="0.5rem">
                            <FormLabel>Senha</FormLabel>
                            <Input name="password" type="password" placeholder="**********" />
                        </FormControl>
                        <FormControl mt="1rem">
                            <Button w="100%" type="submit" colorScheme="facebook">Entrar</Button>
                        </FormControl>
                    </chakra.form>
                </Flex>
            </Flex>
        </>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)

    if (session) {
        return {
            redirect: {
                permanent: false,
                destination: '/'
            }
        }
    } else {
        return {
            props: {
                csrfToken: await getCsrfToken(context),
            },
        }
    }

}

