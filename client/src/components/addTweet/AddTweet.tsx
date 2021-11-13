import { gql, useMutation } from "@apollo/client";
import { useRef, useState } from "react";
import { TWEETS_QUERY } from "../../pages/home/Home";
import "./addtweet.css";

export const ADD_TWEET_MUTATION = gql`
  mutation createTweet($data: Content) {
    createTweet(data: $data) {
      id
    }
  }
`;

function AddTweet() {
  const [tweet, setTweet] = useState("");
  const inputFile = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

  const [createTweet] = useMutation(ADD_TWEET_MUTATION, {
    refetchQueries: [
      {
        query: TWEETS_QUERY,
      },
    ],
  });

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

    console.log(file);

    setImage(file.secure_url);
    setImageLoading(false);
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    try {
      await createTweet({
        variables: {
          data: {
            content: tweet,
            img: image ? image : "",
          },
        },
      });

      setTweet("");
      setImage("");
    } catch (error) {
      console.log(error);
      alert("Something went wrong, Try again");
    }
  };

  let user = JSON.parse(localStorage.getItem("twitter-user")!);

  return (
    <div className="addtweet">
      <form>
        <div className="addtweet_head">
          {user?.profile?.avatar ? (
            <img
              src="https://res.cloudinary.com/aniketcodes/image/upload/v1631960498/rkdw4zxi6cqt1vvbfrym.png"
              alt=""
              className="addtweet_avatar"
            />
          ) : (
            <i
              className="fa fa-user fa-2x addtweet_head"
              aria-hidden="true"
            ></i>
          )}

          <input
            type="text"
            className="addtweet_input"
            placeholder="What's hapenning?"
            value={tweet}
            onChange={(e) => setTweet(e.target.value)}
            minLength={3}
            required
          />
        </div>

        <div className="addtweet_img">
          <label htmlFor="file-input">
            <i className="fas fa-image "></i>
          </label>
          <input
            type="file"
            name="file"
            id="file-input"
            placeholder="Upload an image"
            onChange={uploadImage}
            ref={inputFile}
            style={{ display: "none" }}
          />

          {imageLoading && <i className="fas fa-cog fa-spin"></i>}
        </div>
        <button className="addtweet_btn" onClick={handleSubmit}>
          <span>Tweet</span>
        </button>
      </form>
    </div>
  );
}

export default AddTweet;
