import { gql, useMutation, useQuery } from '@apollo/client'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { useState } from 'react'

import * as Yup from 'yup'
import Modal from 'react-modal'
import { ME_QUERY } from '../pages/Profile'
import { customStyles } from '../styles/modalStyles'
import '../styles/tweet.css'
import { TWEETS_QUERY } from './AllTweets'

const CREATE_COMMENT_MUTATION = gql`
  mutation addComment($data: Content, $tweetId: Int!) {
    addComment(data: $data, tweetId: $tweetId) {
      id
    }
  }
`

interface CommentProps {
  content: string
}
interface Props {
  tweet: string
  name: string
  avatar: string
  id: number
}

const CreateComment = ({ tweet, avatar, name, id }: Props) => {
  const [addComment] = useMutation(CREATE_COMMENT_MUTATION, {
    refetchQueries: [{ query: ME_QUERY }, { query: TWEETS_QUERY }],
  })

  const [modalIsOpen, setIsOpen] = useState(false)

  const { loading, error, data } = useQuery(ME_QUERY)

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error.message}</p>

  const initialValues: CommentProps = {
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

  return (
    <div>
      <span onClick={openModal}>
        <i className="far fa-comment" aria-hidden="true" />
      </span>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
        style={customStyles}
        ariaHideApp={false}
      >
        <span className="exit" onClick={closeModal}>
          <i className="fa fa-times" aria-hidden="true" />
        </span>
        <div className="header" />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 8fr',
            marginTop: '10px',
          }}
        >
          <img
            src={avatar}
            style={{ width: '40px', borderRadius: '50%' }}
            alt="avatar"
          />
          <h5>{name}</h5>
        </div>
        <p
          style={{
            marginLeft: '20px',
            borderLeft: '1px solid var(--accent)',
            paddingLeft: '20px',
            height: '50px',
            marginTop: 0,
          }}
        >
          {tweet}
        </p>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true)
            await addComment({
              variables: {
                data: {
                  content: values.content,
                },
                tweetId: id,
              },
            })

            setSubmitting(false)
            setIsOpen(false)
          }}
        >
          <Form>
            <img
              src={data.me.profile?.avatar}
              style={{ width: '40px', borderRadius: '50%' }}
              alt="avatar"
            />
            <Field
              name="content"
              type="text"
              as="textarea"
              placeholder="Add a comment..."
            />
            <ErrorMessage name="content" component={'div'} />

            <div className="footer" />
            <button type="submit" className="tweet-button">
              <span>Reply</span>
            </button>
          </Form>
        </Formik>
      </Modal>
    </div>
  )
}

export default CreateComment
