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
  useToast,
  Tooltip,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'

import { AiOutlineUserAdd, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai'
import { IoMdArrowDropup, IoMdArrowDropdown } from 'react-icons/io'
import { MdLogout, MdOutlineAccountCircle } from 'react-icons/md'
import { BiSearchAlt, BiCog } from 'react-icons/bi'
import { FaUsers, FaRegMoneyBillAlt } from 'react-icons/fa'
import { IoCashOutline } from 'react-icons/io5'
import { BsCheckCircle } from 'react-icons/bs'

export default function Page(props) {
  const toast = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const onClose = () => setIsOpen(false)

  const [email, setEmail] = useState(props.session.user.email)
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')

  const [clients, setClients] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [clientId, setClientId] = useState(null)
  const [modalType, setModalType] = useState('')

  //Add new client data
  const [clientName, setClientName] = useState('')
  const [clientContact, setClientContact] = useState('')
  const [domain, setDomain] = useState('')
  const [price, setPrice] = useState('')
  const [expireAt, setExpireAt] = useState(moment().format('yyyy-MM-DD'))

  const [searchFor, setSearchFor] = useState('')
  const [searchWhere, setSearchWhere] = useState('')

  const setListBy = async (orderBy) => {
    const res = await fetch('/api/clients/list?orderBy=' + orderBy)
    const data = await res.json()
    setClients(data.clients)
    setTotalPrice(data.total_price)
  }

  const handleAddNewCLient = () => {
    setModalType('add')
    setClientName('')
    setClientContact('')
    setDomain('')
    setExpireAt(moment().format('yyyy-MM-DD'))
    setIsOpen(true)
  }

  const handleEditClient = (client) => {
    setModalType('edit')
    setClientId(client)
    const client_data = clients.filter(item => item.id === client)
    setClientName(client_data[0].name)
    setClientContact(client_data[0].contact)
    setDomain(client_data[0].domain)
    setPrice(client_data[0].price)
    setExpireAt(client_data[0].expire_at)
    setIsOpen(true)
  }

  const handleDeleteClient = (client, domain) => {
    setModalType('delete')
    setClientId(client)
    setDomain(domain)
    setIsOpen(true)
  }

  const handleChangeState = async (client, state) => {
    const res = await fetch('/api/clients/action?domain=' + client + '&state=' + state)
    const data = await res.json()
    if (data.success) {
      toast({
        title: 'Sucesso!',
        description: 'Cliente alterado com sucesso!',
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
      setClients(data.clients)
      setDomain('')
    } else {
      toast({
        title: 'Erro!',
        description: 'Não foi possível alterar o cliente!',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
      setDomain('')
      return
    }
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
      domain: domain,
      price: price,
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
      setTotalPrice(json.total_price)
      setIsOpen(false)
      setClientName('')
      setClientContact('')
      setDomain('')
      setPrice('')
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
      domain: domain,
      price: price,
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
      setTotalPrice(json.total_price)
      onClose()
      setClientName('')
      setClientContact('')
      setDomain('')
      setPrice('')
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
    const res = await fetch(`/api/clients/delete?id=${clientId}&domain=${domain}`, {
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
      setTotalPrice(data.total_price)
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
    if (!searchFor && !searchWhere) {
      const res = await fetch('/api/clients/list')
      const data = await res.json()
      setClients(data.clients)
      setTotalPrice(data.total_price)
      return
    } else if (!searchWhere) {
      return toast({
        title: 'Preencha o campo de "Pesquisar em"',
        status: 'error',
        duration: 2000,
        isClosable: true
      })
    } else if (!searchFor) {
      return toast({
        title: 'Preencha o campo de "Pesquisar por"',
        status: 'error',
        duration: 2000,
        isClosable: true
      })
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

  const setAsPaid = async (client) => {
    const res = await fetch(`/api/clients/paid?id=${client}`)
    const data = await res.json()
    if (data.success) {
      setClients(data.clients)
      setTotalPrice(data.total_price)
      return toast({
        title: 'Cliente marcado como pago',
        status: 'success',
        duration: 2000,
        isClosable: true
      })
    }
  }

  const handleChangeMyInformation = () => {
    setModalType('edit_my_information')
    setIsOpen(true)

    setEmail(props.session.user.email)
    setPassword('')
    setRepeatPassword('')

  }

  const handleEditMyInformation = async () => {
    if (!email || !password || !repeatPassword || password.trim() == '' || repeatPassword.trim() == '') {
      return toast({
        title: 'Preencha todos os campos',
        status: 'error',
        duration: 2000,
        isClosable: true
      })
    }
    if (password !== repeatPassword) {
      return toast({
        title: 'As senhas não são iguais',
        status: 'error',
        duration: 2000,
        isClosable: true
      })
    }

    const data = {
      email: email,
      password: password
    }

    const response = await fetch('/api/auth/edit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const json = await response.json()

    if (json.success) {
      setIsOpen(false)
      return toast({
        title: 'Dados editados com sucesso',
        status: 'success',
        duration: 2000,
        isClosable: true
      })
    } else {
      return toast({
        title: 'Erro ao editar dados',
        status: 'error',
        duration: 2000,
        isClosable: true
      })
    }
  }


  const handleCreateNewAdminAccount = () => {
    setModalType('create_new_admin_account')
    setIsOpen(true)

    setEmail('')
    setPassword('')
    setRepeatPassword('')
  }

  const handleConfirmCreateNewAdminAccount = async () => {
    if (!email || !password || !repeatPassword || password.trim() == '' || repeatPassword.trim() == '') {
      return toast({
        title: 'Preencha todos os campos',
        status: 'error',
        duration: 2000,
        isClosable: true
      })
    }
    if (password !== repeatPassword) {
      return toast({
        title: 'As senhas não são iguais',
        status: 'error',
        duration: 2000,
        isClosable: true
      })
    }

    const data = {
      email: email,
      password: password
    }

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const json = await response.json()

    if (json.success) {
      setIsOpen(false)
      return toast({
        title: 'Conta criada com sucesso',
        status: 'success',
        duration: 2000,
        isClosable: true
      })
    } else {
      return toast({
        title: 'Erro ao criar conta de administrador',
        status: 'error',
        duration: 2000,
        isClosable: true
      })
    }
  }





  useEffect(() => {
    const getClients = async () => {
      const res = await fetch('/api/clients/list')
      const data = await res.json()
      setClients(data.clients)
      setTotalPrice(data.total_price)
    }

    getClients()

  }, [])

  return (
    <>
      <Head>
        <title>Lista de clientes</title>
        <link rel="icon" type="image/x-icon" href="/favicon.png" />
      </Head>
      <Flex className="container" background="url(/bg.png)" backgroundSize="cover" w="100%" h="100%" overflowY="scroll" p="24px" bgColor="gray.300" justifyContent="center" alignItems="center">
        <Flex w="100%" maxW="1280px" p="1rem" borderRadius="md" boxShadow="md" bgColor="white" justifyContent="flex-start" alignItems="center" flexDir="column">
          <Flex w="100%" maxW="1200px" direction="column" alignItems="center" mt="2rem">
            <Heading>Lista de clientes</Heading>
          </Flex>
          <Flex w="100%" maxW="1200px" direction="column" alignItems="center" mt="2rem">
            <Flex w="100%" justifyContent="space-between" className="container-topar">
              <Flex justifyContent="center" alignItems="center">
                <Button colorScheme="green" leftIcon={<AiOutlineUserAdd />} onClick={handleAddNewCLient}>Adicionar novo cliente</Button>
              </Flex>
              <Flex justifyContent="center" alignItems="center">
                <Button onClick={() => signOut()} colorScheme="red"><MdLogout size="20px" /></Button>

                <Menu placement="auto-start">
                  <MenuButton as={Avatar} cursor="pointer" src="/favicon.png" ml="1rem" size="md" />
                  <MenuList boxShadow="md">
                    <MenuItem onClick={handleChangeMyInformation}>
                      <BiCog />
                      <Text ml="0.5rem">Mudar meus dados</Text>
                    </MenuItem>
                    <MenuItem onClick={handleCreateNewAdminAccount}>
                      <MdOutlineAccountCircle />
                      <Text ml="0.5rem">Cria nova conta de administrador</Text>
                    </MenuItem>
                  </MenuList>
                </Menu>

              </Flex>
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
                    <option value="spotify_link">Dominio</option>
                  </Select>
                </FormControl>
              </Flex>
              <Flex>
                <FormControl display="flex" justifyContent="flex-end" alignItems="flex-end" id="search" ml="1rem">
                  <Button colorScheme="green" onClick={handleSearchFor} leftIcon={<BiSearchAlt />}>Procurar</Button>
                </FormControl>
              </Flex>
            </Flex>
            <Flex w="100%" overflow="scroll" flexDir="column" maxH="420px">
              <Flex w="100%" mt="1rem" mb="0.3rem" alignItems="center" flexDir="row">
                <Flex flexDir="row" alignItems="center">
                  <FaUsers />
                  <Text ml="0.3rem">Total de clientes: <chakra.strong ml="0.3rem">{clients.length}</chakra.strong></Text>
                </Flex>
                <Flex flexDir="row" alignItems="center" ml="2rem">
                  <FaRegMoneyBillAlt />
                  <Text ml="0.3rem">Total mensal: <chakra.strong ml="0.3rem">R$ {totalPrice}</chakra.strong></Text>
                </Flex>
              </Flex>
              <Table variant="striped" m="0 0 1rem" boxShadow="md">
                <Thead bgColor="gray.500">
                  <Tr>
                    <Th color="white">Nome</Th>
                    <Th color="white">Contato</Th>
                    <Th color="white">Dominio</Th>
                    <Th color="white">Status</Th>
                    <Th color="white">Preço</Th>
                    <Th color="white" display="flex" justifyContent="flex-start" alignItems="center" flexDir="row">
                      <Flex>Expira em</Flex>
                      <Flex flexDir="column" ml="0.5rem">
                        <Tooltip placement="end" label="Ordernar por data de expiração mais próxima">
                          <Flex mb="-3px" cursor="pointer">
                            <IoMdArrowDropup onClick={() => setListBy('asc')} size="18px" />
                          </Flex>
                        </Tooltip>
                        <Tooltip placement="end" label="Ordernar por data de expiração mais longe">
                          <Flex mt="-3px" cursor="pointer">
                            <IoMdArrowDropdown onClick={() => setListBy('desc')} size="18px" />
                          </Flex>
                        </Tooltip>
                      </Flex>
                    </Th>
                    <Th color="white">Marcar como Pago</Th>
                    <Th color="white">Ações</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {clients.map(client => (
                    <Tr key={client.id}>
                      <Td>{client.name}</Td>
                      <Td>
                        <chakra.a href={`${client.contact.includes('http') ? client.contact : 'https://' + client.contact}`}>{client.contact}</chakra.a>
                      </Td>
                      <Td><chakra.a href={`https://${client.domain}`} target="_blank">{client.domain}</chakra.a></Td>
                      <Td>{client.state == 'Suspend' ? <Button onClick={() => handleChangeState(client.domain, 'Activate')} colorScheme="green">Reativar</Button> : <Button onClick={() => handleChangeState(client.domain, 'Suspend')} colorScheme="red">Desativar</Button>}</Td>
                      <Td minW="120px">R$ {client.price}</Td>
                      <Td minW="232px" fontWeight={moment().unix() > moment(client.expire_at).unix() ? 'bold' : ''} color={moment().unix() > moment(client.expire_at).unix() ? 'red.400' : ''}>{moment(client.expire_at).format('DD-MM-yyyy')}{moment().unix() > moment(client.expire_at).unix() ? ' - (Vencido)' : ''}</Td>
                      <Td>
                        <Button mr="0.1rem" colorScheme="green" leftIcon={<IoCashOutline />} onClick={() => setAsPaid(client.id)}>Pago</Button>
                      </Td>
                      <Td minW="260px">
                        <Button mr="0.1rem" colorScheme="blue" leftIcon={<AiOutlineEdit />} onClick={() => handleEditClient(client.id)}>Editar</Button>
                        <Button ml="0.1rem" colorScheme="red" leftIcon={<AiOutlineDelete />} onClick={() => handleDeleteClient(client.id, client.domain)}>Excluir</Button>
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
                  <FormLabel>Dominio</FormLabel>
                  <Input value={domain} onChange={(e) => setDomain(e.target.value)} name="domain" type="text" placeholder="Dominio" />
                </FormControl>
                <FormControl mt="0.5rem">
                  <FormLabel>Preço</FormLabel>
                  <Input value={price} onChange={(e) => setPrice(e.target.value)} name="price" type="number" placeholder="Preço" />
                </FormControl>
                <FormControl mt="1rem">
                  <FormLabel>Data de expiração</FormLabel>
                  <Input value={expireAt} onChange={(e) => setExpireAt(e.target.value)} type="date" />
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
              leftIcon={modalType == 'add' ? <AiOutlineUserAdd /> : <BsCheckCircle />}
              onClick={modalType == 'add' ? handleConfirmAddNewClient : handleConfirmEditClient}
            >
              {modalType == 'add' ? 'Adicionar' : 'Salvar'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isCentered size="lg" isOpen={modalType == 'edit_my_information' ? isOpen : modalType == 'create_new_admin_account' ? isOpen : null} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalType == 'edit_my_information' ? 'Mudar minhas informações' : 'Criar nova conta de administrador'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex w="100%" direction="column" alignItems="center" mt="1rem">
              <chakra.form w="100%" method="post">
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} name="name" type="email" placeholder="Email" />
                </FormControl>

                <FormControl mt="1rem">
                  <FormLabel>Senha</FormLabel>
                  <Input value={password} onChange={(e) => setPassword(e.target.value)} name="name" type="password" placeholder="Senha" />
                </FormControl>

                <FormControl mt="1rem">
                  <FormLabel>Repita a senha</FormLabel>
                  <Input value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} name="name" type="password" placeholder="Repita a senha" />
                </FormControl>
              </chakra.form>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Fechar
            </Button>
            <Button
              colorScheme="green"
              leftIcon={modalType == 'edit_my_information' ? <BsCheckCircle /> : <AiOutlineUserAdd />}
              onClick={modalType == 'edit_my_information' ? handleEditMyInformation : handleConfirmCreateNewAdminAccount}
            >
              {modalType == 'edit_my_information' ? 'Salvar' : 'Criar conta'}
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