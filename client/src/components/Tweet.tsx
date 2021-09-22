import { gql, useMutation } from '@apollo/client'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { useRef, useState } from 'react'
import Modal from 'react-modal'
import * as Yup from 'yup'
import { customStyles } from '../styles/modalStyles'

import '../styles/tweet.css'
import { TWEETS_QUERY } from './AllTweets'

export const ADD_TWEET_MUTATION = gql`
  mutation createTweet($data: Content) {
    createTweet(data: $data) {
      id
    }
  }
`

interface TweetType {
  content: string
}

const Tweet = () => {
  const inputFile = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState('')
  const [imageLoading, setImageLoading] = useState(false)
  const [modalIsOpen, setIsOpen] = useState(false)

  const [createTweet] = useMutation(ADD_TWEET_MUTATION, {
    refetchQueries: [
      {
        query: TWEETS_QUERY,
      },
    ],
  })

  const initialValues: TweetType = {
    content: '',
  }

  const validationSchema = Yup.object({
    content: Yup.string()
      .required()
      .min(1, 'Must be more than 1 character')
      .max(256, 'Must be less than 257 characters'),
  })

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  const handleSubmit = async (values: TweetType) => {
    //TODO: image uploading

    try {
      const res = await createTweet({
        variables: {
          data: {
            content: values.content,
            img: image ? image : '',
          },
        },
      })

      console.log(res)

      setIsOpen(false)
    } catch (err: any) {
      alert('Something went wrong, Try again')
    }
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

  return (
    <div>
      <button
        style={{ marginRight: '10px', marginTop: '30px' }}
        onClick={openModal}
      >
        <span style={{ padding: '15px 70px 15px 70px' }}>Tweet</span>
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
        style={customStyles}
        ariaHideApp={false}
      >
        <span className="exit" onClick={closeModal}>
          <i className="fa fa-times" aria-hidden="true"></i>
        </span>
        <div className="header"></div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <ErrorMessage name="content" component={'div'} />
            <Field
              name="content"
              type="text"
              as="textarea"
              placeholder="What's happening..."
            />

            <input
              type="file"
              name="file"
              placeholder="Select an image"
              onChange={uploadImage}
              ref={inputFile}
            />
            {imageLoading && <h4>Uploading image...</h4>}

            <div className="footer"></div>
            <button type="submit" className="tweet-button">
              <span>Tweet</span>
            </button>
          </Form>
        </Formik>
      </Modal>
    </div>
  )
}

export default Tweet
