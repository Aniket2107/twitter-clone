import { useMutation } from '@apollo/client'
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik'
import { ADD_TWEET_MUTATION } from './Tweet'

import '../styles/tweet.css'

import * as Yup from 'yup'
import { TWEETS_QUERY } from './AllTweets'
import { useRef, useState } from 'react'

interface TweetType {
  content: string
}

const HomePageTweet = () => {
  const inputFile = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState('')
  const [imageLoading, setImageLoading] = useState(false)
  const [createTweet] = useMutation(ADD_TWEET_MUTATION, {
    refetchQueries: [{ query: TWEETS_QUERY }],
  })

  const initialValues: TweetType = {
    content: '',
  }

  const validationSchema = Yup.object({
    content: Yup.string()
      .required()
      .min(3, 'Must be more than 3 character')
      .max(256, 'Must be less than 257 characters'),
  })

  const handleSubmit = async (
    values: TweetType,
    { resetForm }: FormikHelpers<TweetType>,
  ) => {
    try {
      const res = await createTweet({
        variables: {
          data: {
            content: values.content,
            img: image ? image : '',
          },
        },
      })

      resetForm()
      console.log(res)
    } catch (err: any) {
      alert(err?.graphQLErrors[0].message || 'Something went wrong, Try again')
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
    <div
      className="home-page-tweet"
      style={{
        borderBottom: '10px solid var(--accent)',
        marginBottom: '20px',
        position: 'relative',
      }}
    >
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
            style={{ width: '300px' }}
            type="file"
            name="file"
            placeholder="Select an image"
            onChange={uploadImage}
            ref={inputFile}
          />
          {imageLoading && <h4>Uploading image...</h4>}

          <button
            type="submit"
            className="home-tweet-button"
            style={{ position: 'absolute', bottom: 5, right: 3 }}
          >
            <span>Tweet</span>
          </button>
        </Form>
      </Formik>
    </div>
  )
}

export default HomePageTweet
