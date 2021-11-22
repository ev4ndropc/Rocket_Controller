import { Provider } from 'next-auth/client'
import { ChakraProvider } from '@chakra-ui/react'
import '../styles/globals.css'

export default function App ({ Component, pageProps }) {
  return (
    <Provider
      options={{
        maxAge: 10000,
      }}
      session={pageProps.session} >
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
    </Provider>
  )
}