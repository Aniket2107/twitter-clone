import { gql, useMutation } from "@apollo/client";
import { useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { TWEETS_QUERY } from "../../pages/home/Home";
import { ME_QUERY } from "../../pages/profile/Profile";
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
      {
        query: ME_QUERY,
      },
    ],
  });

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    toast.info("Uploading image...");

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

    // console.log(file);

    setImage(file.secure_url);
    setImageLoading(false);
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (tweet.length < 1) {
      // alert("Please enter something ;)");
      toast.error("Tweet cannot be empty");
      return <ToastContainer />;
    }

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
      toast.success("Tweet posted sucessfully ;)");
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
              src={user.profile?.avatar}
              alt="avatar"
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
          <label htmlFor="file-input" style={{ cursor: "pointer" }}>
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

          {imageLoading && <i className="fas fa-cog fa-spin ml-3"></i>}
          {image && (
            <a
              href={image}
              target="_blank"
              className="cp td-n ml-3"
              rel="noreferrer"
            >
              img
            </a>
          )}
        </div>
        <button
          className="addtweet_btn"
          onClick={handleSubmit}
          disabled={imageLoading || tweet.length < 2}
        >
          <span>Tweet</span>
        </button>
      </form>
    </div>
  );
}

export default AddTweet;
