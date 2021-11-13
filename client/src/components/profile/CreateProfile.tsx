import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import Modal from "react-modal";
import { ME_QUERY } from "../../pages/profile/Profile";
import { customStyles } from "./modalStyle";

const CREATE_PROFILE_MUTATION = gql`
  mutation createProfile($data: ProfileInp) {
    createProfile(data: $data) {
      id
    }
  }
`;

interface ProfileType {
  bio: string;
  location: string;
  website: string;
  avatar: string;
}

const CreateProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState<ProfileType>({
    bio: "",
    location: "",
    website: "",
    avatar: "",
  });

  const [createProfile] = useMutation(CREATE_PROFILE_MUTATION, {
    refetchQueries: [{ query: ME_QUERY }],
  });

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name && e.target.value) {
      setValues({
        ...values,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    try {
      await createProfile({
        variables: {
          data: {
            bio: values.bio,
            location: values.location,
            website: values.website,
          },
        },
      });

      //   console.log(response)

      alert("Profile created!");
      setIsOpen(false);
    } catch (err) {
      console.log(err);

      alert("Something went wrong, Try again");
      setIsOpen(false);
    }
  };

  return (
    <div className="uprofile">
      <button onClick={openModal} className="profile_editBtn">
        Create Profile
      </button>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
        style={customStyles}
        ariaHideApp={false}
      >
        <div className="createProfile">
          <form>
            <div className="up_form-control">
              <label htmlFor="up_bio">Bio</label>
              <input
                type="text"
                id="up_bio"
                name="bio"
                value={values?.bio}
                onChange={handleChange}
                required
              />
            </div>
            <div className="up_form-control">
              <label htmlFor="up_location">Location</label>
              <input
                type="text"
                id="up_location"
                value={values?.location}
                name="location"
                onChange={handleChange}
                required
              />
            </div>
            <div className="up_form-control">
              <label htmlFor="up_website">Website</label>
              <input
                type="text"
                id="up_website"
                value={values?.website}
                name="website"
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="up_button" onClick={handleSubmit}>
              Update Profile
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default CreateProfile;
