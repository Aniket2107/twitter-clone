import AllTweets from '../components/AllTweets'
import HomePageTweet from '../components/HomePageTweet'
import LeftNav from '../components/LeftNav'
import PopularTweets from '../components/PopularTweets'
import SearchUser from '../components/SearchUser'

import '../styles/home.css'
import '../styles/primary.css'

const Home = () => {
  return (
    <>
      <div className="primary">
        <div className="left">
          <LeftNav />
        </div>
        <div className="home">
          <div className="home-header">
            <h3 className="home-title">Home</h3>
          </div>
          <HomePageTweet />
          <AllTweets />
        </div>
        <div className="right">
          <SearchUser />
          <PopularTweets />
        </div>
      </div>
    </>
  )
}

export default Home
