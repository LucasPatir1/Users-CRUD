import axios from "axios"
import { useEffect, useState } from "react"
import Modal from "./components/Modal"
import Header from "./components/Header"
import { useForm } from "react-hook-form"
import UsersList from "./components/UsersList"
import Swal from 'sweetalert2'

const BASE_URL = "https://users-crud.academlo.tech"

const DEFAULT_VALUES = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  birthday: "",
  image_url: ""
}

function App() {
  const [users, setUsers] = useState([])
  const [isUserIdToEdit, setIsUserIdToEdit] = useState()
  const [isShowedForm, setIsShowedForm] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const submit = (data) => {
    if(!data.birthday){
      data.birthday = null
    }

    if(!data.image_url){
      data.image_url = null
    }


    if(isUserIdToEdit){
      editUser(data)
    } else {
      createUser(data)
    }

    Swal.fire({
      icon: 'success',
      title: 'Registro exitoso',
      showConfirmButton: false,
      timer: 2500
    })
    
  }

  const createUser = (data) => {
    const URL = BASE_URL + "/users/"

    axios.post(URL, data)
    .then(() => {
      getAllUsers()
      reset(DEFAULT_VALUES)
      setIsShowedForm(!isShowedForm)
    })
    .catch((err) => console.log(err))
  }

  const deleteUser = (id) => {
    const URL = BASE_URL + `/users/${id}/`

    axios.delete(URL)
    .then(() => getAllUsers())
    .catch((err) => console.log(err))
  }

  const editUser = (data) => {
    const URL = BASE_URL + `/users/${isUserIdToEdit}/`

    axios.patch(URL, data)
    .then(() => {
      getAllUsers()
      reset(DEFAULT_VALUES)
      setIsShowedForm(!isShowedForm)
      setIsUserIdToEdit()
    })
    .catch((err) => console.log(err))
  }
  

  const handleClickEdit = (data) => {
    setIsShowedForm((isShowedForm) => !isShowedForm )
    reset(data)
    setIsUserIdToEdit(data.id)
  }
  
  
  const getAllUsers = () => {
    const URL = BASE_URL + "/users/"

    axios.get(URL)
    .then((res) => setUsers(res.data))
    .catch((err) => console.log(err))
  }
  

  useEffect(() => {
    getAllUsers()
  }, [])

  return (
    <main className="font-sans">
      <Header setIsShowedForm={setIsShowedForm} />

      <Modal isShowedForm={isShowedForm} setIsShowedForm={setIsShowedForm} register={register} handleSubmit={handleSubmit} submit={submit} reset={reset} setIsUserIdToEdit={setIsUserIdToEdit} isUserIdToEdit={isUserIdToEdit} errors={errors} />

      <UsersList users={users} deleteUser={deleteUser} handleClickEdit={handleClickEdit} />
    </main>
  )
}

export default App
