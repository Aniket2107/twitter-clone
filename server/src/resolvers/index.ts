import Query from './Query'
import Mutation from './Mutation'

export default {
  Query: {
    me: Query.me,
    allUsers: Query.allUsers,
    userById: Query.userById,
    tweets: Query.tweets,
    tweet: Query.tweet,
    getTweetsByUser: Query.getTweetsByUser,
    followers: Query.followers,
    getUserLikedTweets: Query.getUserLikedTweets,
  },
  Mutation: {
    signupUser: Mutation.signupUser,
    login: Mutation.login,
    createProfile: Mutation.createProfile,
    updateProfile: Mutation.updateProfile,
    createTweet: Mutation.createTweet,
    updateTweet: Mutation.updateTweet,
    deleteTweet: Mutation.deleteTweet,
    likeTweet: Mutation.likeTweet,
    deleteLike: Mutation.deleteLike,
    addComment: Mutation.addComment,
    addReply: Mutation.addReply,
    follow: Mutation.follow,
    unFollow: Mutation.unFollow,
  },
}
