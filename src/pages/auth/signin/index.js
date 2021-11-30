import Head from 'next/head'
import { useRouter } from 'next/router'
import { createBreakpoints } from "@chakra-ui/theme-tools"
import { getCsrfToken, getSession } from "next-auth/client"
import { Flex, chakra, FormControl, FormLabel, Input, Button, Alert, Img, AlertIcon, AlertDescription, CloseButton } from "@chakra-ui/react"
import { useEffect, useState } from 'react'



export default function SignIn({ csrfToken }) {
    const router = useRouter()
    const [message, setMessage] = useState(false)
    const breakpoints = createBreakpoints({
        sm: "30em",
        md: "48em",
        lg: "62em",
        xl: "80em",
        "2xl": "96em",
    })
    useEffect(() => {
        const error = router.query
        if (error.error) {
            setMessage('O email ou senha está incorreto!')
        }
    }, [])
    return (
        <>
            <Head>
                <title>Logar no painel</title>
                <link rel="icon" type="image/x-icon" href="/favicon.png" />
            </Head>
            <Flex className="container" background="url(/bg.png)" backgroundSize="cover" w="100%" p="12px 24px" h="100vh" bgColor="gray.300" justifyContent="center" alignItems="center" flexDir="column">
                <Flex mb="1rem">
                    <Img maxW="180px" src="/logo.png" alt="Logo" />
                </Flex>
                <Flex w="100%" maxW="460px" h="auto" bgColor="white" p={{ base: '1.5rem', sm: "2rem", md: "2rem", lg: "3rem" }} borderRadius="md" boxShadow="md">
                    <chakra.form w="100%" method="post" action="/api/auth/callback/credentials">
                        <Flex mb="1rem">
                            {message != '' &&
                                <Alert status="error">
                                    <AlertIcon />
                                    <AlertDescription>{message}</AlertDescription>
                                    <CloseButton onClick={() => setMessage('')} position="absolute" right="8px" top="8px" />
                                </Alert>
                            }
                        </Flex>
                        <Input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                        <FormControl id="email">
                            <FormLabel>Endereço de Email</FormLabel>
                            <Input name="email" type="email" placeholder="Email" />
                        </FormControl>
                        <FormControl id="password" mt="0.5rem">
                            <FormLabel>Senha</FormLabel>
                            <Input name="password" type="password" placeholder="**********" />
                        </FormControl>
                        <FormControl id="signin" mt="1rem">
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

