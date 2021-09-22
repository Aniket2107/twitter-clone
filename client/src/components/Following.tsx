import { useQuery } from '@apollo/client'
import { useState } from 'react'
import Modal from 'react-modal'
import { Link } from 'react-router-dom'
import { ME_QUERY } from '../pages/Profile'
import { customStyles } from '../styles/modalStyles'

import '../styles/tweet.css'

const Following = () => {
  const [modalIsOpen, setIsOpen] = useState(false)
  const { loading, error, data } = useQuery(ME_QUERY)

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error.message}</p>

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  return (
    <div>
      <span onClick={openModal}>
        <p>{data.me.following.length} Following</p>
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
        <div style={{ marginLeft: '20px' }}>
          {data.me.following.map((person: any) => (
            <div
              style={{ borderBottom: '1px solid lightGrey', padding: '5px' }}
              key={person.id}
            >
              <div className="tweet-header">
                <img
                  src={person.avatar}
                  style={{ width: '40px', borderRadius: '50%' }}
                  alt="avatar"
                />

                <Link to={`/user/${person.followId}`}>
                  <h4 className="name">{person.name} </h4>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}

export default Following
