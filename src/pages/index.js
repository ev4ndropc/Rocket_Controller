import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useSession, getSession, signOut } from "next-auth/client"
import moment from 'moment'
import 'moment/locale/pt-br'
import {
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Text,
  Select,
  chakra,
  useToast
} from '@chakra-ui/react'

import { AiOutlineUserAdd, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai'
import { IoMdArrowDropup, IoMdArrowDropdown } from 'react-icons/io'
import { MdLogout } from 'react-icons/md'
import { BiSearchAlt } from 'react-icons/bi'
import { FaUsers } from 'react-icons/fa'

export default function Page(props) {
  const toast = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const onClose = () => setIsOpen(false)

  const [clients, setClients] = useState([])
  const [clientId, setClientId] = useState(null)
  const [modalType, setModalType] = useState('')

  //Add new client data
  const [clientName, setClientName] = useState('')
  const [clientContact, setClientContact] = useState('')
  const [clientSpotifyLink, setClientSpotifyLink] = useState('')
  const [expireAt, setExpireAt] = useState(moment().format('YYYY-MM-DDTHH:mm:ss'))

  const [searchFor, setSearchFor] = useState('')
  const [searchWhere, setSearchWhere] = useState('')

  const setListBy = async (orderBy) => {
    const res = await fetch('/api/clients/list?orderBy=' + orderBy)
    const data = await res.json()
    setClients(data.clients)
  }

  const handleAddNewCLient = () => {
    setModalType('add')
    setClientName('')
    setClientContact('')
    setClientSpotifyLink('')
    setExpireAt(moment().format('YYYY-MM-DDTHH:mm:ss'))
    setIsOpen(true)
  }

  const handleEditClient = (client) => {
    setModalType('edit')
    setClientId(client)
    const client_data = clients.filter(item => item.id === client)
    setClientName(client_data[0].name)
    setClientContact(client_data[0].contact)
    setClientSpotifyLink(client_data[0].spotify_link)
    setExpireAt(client_data[0].expire_at)
    setIsOpen(true)
  }

  const handleDeleteClient = (client) => {
    setModalType('delete')
    setClientId(client)
    setIsOpen(true)

    console.log(modalType)
  }

  const handleConfirmAddNewClient = async () => {

    if (!clientName || !clientContact || !expireAt) {
      return toast({
        title: 'Preencha todos os campos',
        status: 'error',
        duration: 2000,
        isClosable: true
      })
    }

    const data = {
      name: clientName,
      contact: clientContact,
      spotify_link: clientSpotifyLink,
      expire_at: expireAt
    }
    const response = await fetch('/api/clients/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const json = await response.json()
    if (json.success) {
      setClients(json.clients)
      setIsOpen(false)
      setClientName('')
      setClientContact('')
      setClientSpotifyLink('')
      setExpireAt('')
      return toast({
        title: 'Cliente adicionado com sucesso',
        status: 'success',
        duration: 2000,
        isClosable: true
      })
    }
  }

  const handleConfirmEditClient = async () => {
    if (!clientName || !clientContact || !expireAt) {
      return toast({
        title: 'Preencha todos os campos',
        status: 'error',
        duration: 2000,
        isClosable: true
      })
    }

    const data = {
      id: clientId,
      name: clientName,
      contact: clientContact,
      spotify_link: clientSpotifyLink,
      expire_at: expireAt
    }

    const response = await fetch('/api/clients/edit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const json = await response.json()
    if (json.success) {
      setClients(json.clients)
      onClose()
      setClientName('')
      setClientContact('')
      setClientSpotifyLink('')
      setExpireAt('')
      return toast({
        title: 'Cliente editado com sucesso',
        status: 'success',
        duration: 2000,
        isClosable: true
      })
    }
  }

  const handleConfirDelete = async () => {
    const res = await fetch(`/api/clients/delete?id=${clientId}`, {
      method: 'DELETE',
    })
    const data = await res.json()
    if (data.error) {
      return toast({
        title: 'Erro ao deletar cliente',
        status: 'error',
        duration: 2000,
        isClosable: true
      })
    } else {
      setClients(data.clients)
      console.log(data)
      setIsOpen(false)
      return toast({
        title: 'Cliente removido com sucesso',
        status: 'success',
        duration: 2000,
        isClosable: true
      })
    }
  }

  const handleSearchFor = async () => {
    if (!searchFor || !searchWhere) {
      const res = await fetch('/api/clients/list')
      const data = await res.json()
      return setClients(data.clients)
    }

    const res = await fetch(`/api/clients/search?value=${searchFor}&where=${searchWhere}`)
    const data = await res.json()

    if (data.message) {
      return toast({
        title: 'Digite o que quer procurar e selecione em qual campo!',
        status: 'error',
        duration: 2000,
        isClosable: true
      })
    }

    return setClients(data.clients)
  }

  useEffect(() => {
    const getClients = async () => {
      const res = await fetch('/api/clients/list')
      const data = await res.json()
      return data.clients
    }

    getClients().then(data => setClients(data))

  }, [])
  return (
    <>
      <Head>
        <title>Lista de clientes</title>
      </Head>
      <Flex className="container" w="100%" h="100%" overflowY="scroll" p="24px" bgColor="gray.300" justifyContent="center" alignItems="center">
        <Flex w="100%" maxW="1080px" p="1rem" borderRadius="md" boxShadow="md" bgColor="white" justifyContent="flex-start" alignItems="center" flexDir="column">
          <Flex w="100%" maxW="976px" direction="column" alignItems="center" mt="2rem">
            <Heading>Lista de clientes</Heading>
          </Flex>
          <Flex w="100%" maxW="976px" direction="column" alignItems="center" mt="2rem">
            <Flex w="100%" justifyContent="space-between">
              <Button colorScheme="green" leftIcon={<AiOutlineUserAdd />} onClick={handleAddNewCLient}>Adicionar novo cliente</Button>
              <Button onClick={() => signOut()} colorScheme="red"><MdLogout size="20px" /></Button>
            </Flex>
            <Flex w="100%" justifyContent="space-around" mt="2rem" className="searchContainer">
              <Flex w="100%">
                <FormControl id="search">
                  <FormLabel htmlFor="search">Pesquisar por</FormLabel>
                  <Input type="text" id="search" value={searchFor} onChange={(e) => setSearchFor(e.target.value)} placeholder="Pesquisar cliente" />
                </FormControl>
              </Flex>
              <Flex w="100%">
                <FormControl id="search_type" ml="1rem">
                  <FormLabel htmlFor="search_type">Pesquisar em</FormLabel>
                  <Select id="search_type" value={searchWhere} onChange={(e) => setSearchWhere(e.target.value)} placeholder="Pesquisar em">
                    <option value="name">Nome</option>
                    <option value="contact">Contato</option>
                    <option value="spotify_link">Link do Spotify</option>
                  </Select>
                </FormControl>
              </Flex>
              <Flex>
                <FormControl display="flex" justifyContent="flex-end" alignItems="flex-end" id="search" ml="1rem">
                  <Button colorScheme="green" onClick={handleSearchFor} leftIcon={<BiSearchAlt />}>Procurar</Button>
                </FormControl>
              </Flex>
            </Flex>
            <Flex w="100%" overflow="scroll" flexDir="column">
              <Flex w="100%" mt="1rem" mb="0.3rem" alignItems="center" flexDir="row">
                <FaUsers />
                <Text ml="0.3rem">Total de clientes: <chakra.strong ml="0.3rem">{clients.length}</chakra.strong></Text>
              </Flex>
              <Table variant="striped" m="0 0 1rem" boxShadow="md">
                <Thead bgColor="gray.500">
                  <Tr>
                    <Th color="white">Nome</Th>
                    <Th color="white">Contato</Th>
                    <Th color="white">Link do Spotify</Th>
                    <Th color="white" display="flex" justifyContent="flex-start" alignItems="center" flexDir="row">
                      <Flex>Expira em</Flex>
                      <Flex flexDir="column" ml="0.5rem">
                        <Flex mb="-3px" cursor="pointer">
                          <IoMdArrowDropup onClick={() => setListBy('asc')} size="18px" />
                        </Flex>
                        <Flex mt="-3px" cursor="pointer">
                          <IoMdArrowDropdown onClick={() => setListBy('desc')} size="18px" />
                        </Flex>
                      </Flex>
                    </Th>
                    <Th color="white">Ações</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {clients.map(client => (
                    <Tr key={client.id}>
                      <Td>{client.name}</Td>
                      <Td>{client.contact}</Td>
                      <Td><chakra.a color="blue.300" href={client.spotify_link} target="_blank">{client.spotify_link}</chakra.a></Td>
                      <Td>{moment(client.expire_at).format('LLL')}</Td>
                      <Td minW="260px">
                        <Button mr="0.1rem" colorScheme="blue" leftIcon={<AiOutlineEdit />} onClick={() => handleEditClient(client.id)}>Editar</Button>
                        <Button ml="0.1rem" colorScheme="red" leftIcon={<AiOutlineDelete />} onClick={() => handleDeleteClient(client.id)}>Excluir</Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Flex>

          </Flex>
        </Flex>
      </Flex>
      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Deletar cliente
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza que deseja deletar o cliente?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button colorScheme="red" onClick={handleConfirDelete} >
                Deletar
              </Button>
              <Button onClick={onClose} ml={3}>
                Cancelar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Modal isCentered size="lg" isOpen={modalType == 'edit' ? isOpen : modalType == 'add' ? isOpen : null} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalType == 'edit' ? 'Editar cliente' : 'Adicionar cliente'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex w="100%" direction="column" alignItems="center" mt="1rem">
              <chakra.form w="100%" method="post">
                <FormControl>
                  <FormLabel>Nome</FormLabel>
                  <Input value={clientName} onChange={(e) => setClientName(e.target.value)} name="name" type="text" placeholder="Nome do cliente" />
                </FormControl>
                <FormControl mt="0.5rem">
                  <FormLabel>contato</FormLabel>
                  <Input value={clientContact} onChange={(e) => setClientContact(e.target.value)} name="contact" type="text" placeholder="Contato" />
                </FormControl>
                <FormControl mt="0.5rem">
                  <FormLabel>Link do Spotify</FormLabel>
                  <Input value={clientSpotifyLink} onChange={(e) => setClientSpotifyLink(e.target.value)} name="spotify_link" type="text" placeholder="Link do Spotify" />
                </FormControl>
                <FormControl mt="1rem">
                  <FormLabel>Data de expiração</FormLabel>
                  <Input value={expireAt} onChange={(e) => setExpireAt(e.target.value)} type="datetime-local" />
                </FormControl>
              </chakra.form>

            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Fechar
            </Button>
            <Button
              colorScheme={modalType == 'add' ? 'green' : 'blue'}
              leftIcon={modalType == 'add' ? <AiOutlineUserAdd /> : <AiOutlineEdit />}
              onClick={modalType == 'add' ? handleConfirmAddNewClient : handleConfirmEditClient}
            >
              {modalType == 'add' ? 'Adicionar' : 'Editar'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )

}


export async function getServerSideProps(context) {

  const session = await getSession(context)

  if (session) {
    return {
      props: {
        session
      }
    }
  } else {
    return {
      redirect: {
        permanent: false,
        destination: '/auth/signin'
      }
    }
  }
}