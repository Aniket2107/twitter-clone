import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import Modal from "react-modal";
import { ME_QUERY } from "../../pages/profile/Profile";
import { customStyles } from "./modalStyle";

import "./uprofile.css";

const UPDATE_PROFILE = gql`
  mutation updateProfile($data: ProfileInp, $profileId: Int) {
    updateProfile(data: $data, profileId: $profileId) {
      id
    }
  }
`;

interface ProfileType {
  id: number;
  bio: string;
  location: string;
  website: string;
  avatar: string;
}

const UpdateProfile = () => {
  const inputFile = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState<ProfileType>({
    id: 0,
    bio: "",
    location: "",
    website: "",
    avatar: "",
  });

  const { data } = useQuery(ME_QUERY);
  const [updateProfile] = useMutation(UPDATE_PROFILE, {
    refetchQueries: [{ query: ME_QUERY }],
  });

  useEffect(() => {
    if (data) {
      setValues({
        id: data.me.profile.id,
        bio: data.me.profile.bio,
        location: data.me.profile.location,
        website: data.me.profile.website,
        avatar: data.me.profile.avatar,
      });
    }

    if (data.me.profile.avatar) {
      setImage(data.me.profile.avatar);
    }
  }, [data]);

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files!;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "c18m8jqp");
    setImageLoading(true);

    const api = process.env.REACT_APP_CLOUD_API || "";

    const res = await fetch(api, {
      method: "POST",
      body: data,
    });
    const file = await res.json();

    // console.log(file)

    setImage(file.secure_url);
    setImageLoading(false);
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    try {
      await updateProfile({
        variables: {
          data: {
            avatar: image ? image : data.me.profile.avatar,
            bio: values?.bio,
            location: values?.location,
            website: values?.website,
          },
          profileId: values?.id,
        },
      });
    } catch (error) {
      alert("Something went wrong, Try again");
    }

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

  return (
    <div className="uprofile">
      <button onClick={openModal} className="profile_editBtn">
        Edit Profile
      </button>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
        style={customStyles}
        ariaHideApp={false}
      >
        <div className="up_left">
          <input
            type="file"
            name="file"
            placeholder="Upload an image"
            onChange={uploadImage}
            ref={inputFile}
            style={{ display: "none" }}
          />
          {imageLoading ? (
            <h3>Loading...</h3>
          ) : (
            <>
              {image ? (
                <span onClick={() => inputFile.current?.click()}>
                  <img
                    src={image}
                    style={{ width: "150px", borderRadius: "50%" }}
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
        </div>

        <div className="up_right">
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

export default UpdateProfile;
