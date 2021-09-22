import { gql, useMutation, useQuery } from '@apollo/client'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { useRef, useState } from 'react'
import Modal from 'react-modal'
import { ME_QUERY } from '../pages/Profile'
import { customStyles } from '../styles/modalStyles'

const UPDATE_PROFILE = gql`
  mutation updateProfile($data: ProfileInp, $profileId: Int) {
    updateProfile(data: $data, profileId: $profileId) {
      id
    }
  }
`

interface ProfileType {
  id: number
  bio: string
  location: string
  website: string
  avatar: string
}

const UpdateProfile = () => {
  const inputFile = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState('')
  const [imageLoading, setImageLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const { data } = useQuery(ME_QUERY)
  const [updateProfile] = useMutation(UPDATE_PROFILE, {
    refetchQueries: [{ query: ME_QUERY }],
  })

  const initialValues: ProfileType = {
    id: data.me.profile.id,
    bio: data.me.profile.bio,
    location: data.me.profile.location,
    website: data.me.profile.website,
    avatar: data.me.profile.avatar,
  }

  const openModal = () => {
    setIsOpen(true)
  }
  const closeModal = () => {
    setIsOpen(false)
  }

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files!
    const data = new FormData()
    data.append('file', files[0])
    data.append('upload_preset', 'c18m8jqp')
    setImageLoading(true)

    const api = process.env.REACT_APP_CLOUD_API || ''

    const res = await fetch(api, {
      method: 'POST',
      body: data,
    })
    const file = await res.json()

    // console.log(file)

    setImage(file.secure_url)
    setImageLoading(false)
  }

  const handleSubmit = async (values: ProfileType) => {
    await updateProfile({
      variables: {
        data: {
          avatar: image ? image : data.me.profile.avatar,
          bio: values.bio,
          location: values.location,
          website: values.website,
        },
        profileId: values.id,
      },
    })

    setIsOpen(false)
  }

  return (
    <div>
      <button onClick={openModal} className="edit-button">
        Edit Profile
      </button>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
        style={customStyles}
        ariaHideApp={false}
      >
        <input
          type="file"
          name="file"
          placeholder="Upload an image"
          onChange={uploadImage}
          ref={inputFile}
          style={{ display: 'none' }}
        />
        {imageLoading ? (
          <h3>Loading...</h3>
        ) : (
          <>
            {image ? (
              <span onClick={() => inputFile.current?.click()}>
                <img
                  src={image}
                  style={{ width: '150px', borderRadius: '50%' }}
                  alt="avatar"
                  onClick={() => inputFile.current?.click()}
                />
              </span>
            ) : (
              <span onClick={() => inputFile.current?.click()}>
                <i
                  className="fa fa-user fa-5x"
                  aria-hidden="true"
                  onClick={() => inputFile.current?.click()}
                ></i>
              </span>
            )}
          </>
        )}
        <Formik
          initialValues={initialValues}
          // validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <Field name="bio" type="text" as="textarea" placeholder="Bio" />
            <ErrorMessage name="bio" component={'div'} />

            <Field name="location" type="text" placeholder="Location" />
            <ErrorMessage name="location" component={'div'} />
            <Field name="website" type="text" placeholder="Website" />
            <ErrorMessage name="website" component={'div'} />

            <button type="submit" className="login-button">
              <span>Update Profile</span>
            </button>
          </Form>
        </Formik>
      </Modal>
    </div>
  )
}

export default UpdateProfile
