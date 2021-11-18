import { Context } from '../../context'
import { getUserId } from '../../utils'

export default {
  me: async (parent, args, context: Context) => {
    try {
      const userId = getUserId(context)

      const result = await context.prisma.user.findUnique({
        where: {
          id: Number(userId),
        },
        include: {
          profile: true,
          comment: true,
          following: {
            include: {
              user: {
                include: {
                  profile: true,
                },
              },
            },
          },
          likedTweet: {
            include: {
              tweet: {
                include: {
                  author: {
                    include: {
                      profile: true,
                    },
                  },
                  likes: true,
                  comments: true,
                },
              },
            },
          },
          tweets: {
            include: {
              author: {
                include: {
                  profile: true,
                },
              },
              likes: true,
              comments: true,
            },
          },
        },
        rejectOnNotFound: true,
      })

      return result
    } catch (error) {
      throw new Error(error ? String(error) : 'Something went wrong, Try again')
    }
  },
  allUsers: async (parent, args, context: Context) => {
    return await context.prisma.user.findMany({
      include: {
        profile: true,
      },
    })
  },
  userById: async (parent, args: { userId: number }, context: Context) => {
    try {
      const result = await context.prisma.user.findUnique({
        where: {
          id: Number(args.userId),
        },
        include: {
          profile: true,
          comment: true,
          following: true,
          likedTweet: true,
          tweets: {
            include: {
              likes: true,
              comments: true,
              author: {
                include: {
                  profile: true,
                },
              },
            },
          },
        },
        rejectOnNotFound: true,
      })

      return result
    } catch (error) {
      throw new Error(error ? String(error) : 'Something went wrong, Try again')
    }
  },
  tweets: async (parent, args, context: Context) => {
    try {
      const result = await context.prisma.tweet.findMany({
        include: {
          author: {
            include: {
              profile: true,
            },
          },
          comments: true,
          likes: true,
        },
      })

      return result
    } catch (error) {
      throw new Error(error ? String(error) : 'Something went wrong, Try again')
    }
  },
  getTweetsByUser: async (parent, args, context: Context) => {
    try {
      const userId = getUserId(context)

      const userFollowing = await context.prisma.following.findMany({
        where: {
          userId: Number(userId),
        },
      })

      let tweets: any = []

      const userTweets = await context.prisma.tweet.findMany({
        where: {
          authorId: Number(userId),
        },
        include: {
          author: true,
          comments: true,
          likes: true,
        },
      })

      if (userTweets.length > 0) {
        tweets = userTweets
      }

      // console.log(tweets)

      if (userFollowing.length > 0) {
        for (const val of userFollowing) {
          const temp = await context.prisma.tweet.findMany({
            where: {
              authorId: Number(val.followId),
            },
            include: {
              author: {
                include: {
                  profile: true,
                },
              },
              comments: true,
              likes: true,
            },
          })

          // console.log(temp)

          tweets = tweets.concat(temp)
        }
      }

      tweets = await tweets.sort((a, b) => b.createdAt - a.createdAt)

      return tweets
    } catch (error) {
      throw new Error(error ? String(error) : 'Something went wrong, Try again')
    }
  },
  tweet: async (parent, args: { tweetId: number }, context: Context) => {
    try {
      const result = await context.prisma.tweet.findUnique({
        where: {
          id: Number(args.tweetId),
        },
        include: {
          author: {
            include: {
              profile: true,
            },
          },
          comments: {
            include: {
              user: {
                include: {
                  profile: true,
                },
              },
            },
          },
          likes: true,
        },
        rejectOnNotFound: true,
      })

      return result
    } catch (error) {
      throw new Error('Seomthing went wrong, Try again')
    }
  },
  followers: async (parent, args, context: Context) => {
    const userId = getUserId(context)

    const followers = await context.prisma.following.findMany({
      where: {
        followId: Number(userId),
      },
    })

    return followers.length
  },
  getUserLikedTweets: async (parent, args, context: Context) => {
    const userId = getUserId(context)

    const userLiked = await context.prisma.likedTweet.findMany({
      where: {
        userId: Number(userId),
      },
      include: {
        tweet: {
          include: {
            author: {
              include: {
                profile: true,
              },
            },
            comments: true,
            likes: true,
          },
        },
      },
    })

    return userLiked
  },
  following: async (parent, args, context: Context) => {
    try {
      const userId = getUserId(context)

      const following = await context.prisma.following.findMany({
        where: {
          userId: Number(userId),
        },
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
      })

      return following
    } catch (error) {
      throw new Error(error ? String(error) : 'Something went wrong, Try again')
    }
  },
}
