import { gql } from 'apollo-server'

export const typeDefs = gql`
  type Mutation {
    signupUser(data: UserCreateInput!): AuthOutput
    login(data: loginInput!): AuthOutput
    createProfile(data: ProfileInp): Profile
    updateProfile(profileId: Int, data: ProfileInp): Profile
    createTweet(data: Content): Tweet
    likeTweet(data: TweetId): LikedTweet
    deleteLike(data: LikedId): LikedTweet
    addComment(tweetId: Int, data: CommentContent): Comment
    addReply(tweetId: Int, commentId: Int, data: Content): Comment
    follow(data: Follow): Following
    unFollow(followId: Int): Following
  }

  type Query {
    me: User!
    allUsers: [User!]!
    userById(userId: Int!): User
    tweets: [Tweet!]!
    tweet(tweetId: Int): Tweet
    getTweetsByUser: [Tweet]
    followers: Int!
    getUserLikedTweets: [LikedTweet]
  }

  type User {
    email: String!
    id: Int!
    name: String
    password: String
    profile: Profile
    tweets: [Tweet]
    likedTweet: [LikedTweet]
    comment: [Comment]
    following: [Following]
  }

  type Profile {
    id: Int!
    createdAt: DateTime
    bio: String
    location: String
    website: String
    avatar: String
    user: User
  }

  type Tweet {
    author: User
    content: String
    img: String
    createdAt: DateTime!
    id: Int!
    likes: [LikedTweet]
    comments: [Comment]
  }

  type LikedTweet {
    id: Int!
    tweet: Tweet
    likedAt: DateTime
    user: User
  }

  type Comment {
    id: Int!
    createdAt: DateTime
    content: String!
    tweet: Tweet
    user: User
    replies: [Comment]
  }

  type Following {
    id: Int!
    name: String
    avatar: String
    followId: Int
    user: User
  }

  enum SortOrder {
    asc
    desc
  }

  input UserCreateInput {
    email: String!
    name: String
    password: String!
  }

  input UserUniqueInput {
    email: String
    id: Int
  }

  type AuthOutput {
    token: String
    user: User
  }

  input loginInput {
    email: String!
    password: String!
  }

  input ProfileInp {
    bio: String
    location: String
    website: String
    avatar: String
  }

  input Content {
    content: String
    img: String
  }

  input CommentContent {
    content: String
  }

  input TweetId {
    tweetId: Int
  }

  input LikedId {
    id: Int
  }

  input Follow {
    name: String
    followId: Int
    avatar: String
  }

  scalar DateTime
`
