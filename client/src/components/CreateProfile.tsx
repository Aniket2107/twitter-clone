import { gql, useMutation } from '@apollo/client'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { useState } from 'react'
import { ME_QUERY } from '../pages/Profile'

import { customStyles } from '../styles/modalStyles'
import Modal from 'react-modal'

const CREATE_PROFILE_MUTATION = gql`
  mutation createProfile($data: ProfileInp) {
    createProfile(data: $data) {
      id
    }
  }
`

interface ProfileType {
  bio: string
  avatar: string
  location: string
  website: string
}

const CreateProfile = () => {
  const [createProfile] = useMutation(CREATE_PROFILE_MUTATION, {
    refetchQueries: [{ query: ME_QUERY }],
  })

  const [isOpen, setIsOpen] = useState(false)

  const initialValues: ProfileType = {
    bio: '',
    avatar: '',
    location: '',
    website: '',
  }

  const openModal = () => {
    setIsOpen(true)
  }
  const closeModal = () => {
    setIsOpen(false)
  }

  const handleSubmit = async (values: ProfileType) => {
    try {
      const response = await createProfile({
        variables: {
          data: {
            bio: values.bio,
            location: values.location,
            website: values.website,
          },
        },
      })

      console.log(response)

      alert('Profile created!')
      setIsOpen(false)
    } catch (err) {
      console.log(err)

      alert('Something went wrong, Try again')
      setIsOpen(false)
    }
  }

  return (
    <div>
      <button onClick={openModal} className="edit-button">
        Create Profile
      </button>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
        style={customStyles}
        ariaHideApp={false}
      >
        <Formik
          initialValues={initialValues}
          // validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <ErrorMessage name="bio" component={'div'} />
            <Field name="bio" type="text" as="textarea" placeholder="Bio" />
            <ErrorMessage name="location" component={'div'} />
            <Field name="location" type="location" placeholder="Location" />
            <ErrorMessage name="website" component={'div'} />
            <Field name="website" type="website" placeholder="Website" />

            <button type="submit" className="login-button">
              <span>Create Profile</span>
            </button>
          </Form>
        </Formik>
      </Modal>
    </div>
  )
}

export default CreateProfile
