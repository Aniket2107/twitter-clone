import { Context } from '../../context'
import { getUserId } from '../../utils'

import { hash, compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

export default {
  signupUser: async (
    parent,
    args: { data: UserCreateInput },
    context: Context,
  ) => {
    try {
      const hashedPass = await hash(args.data.password, 10)

      const user = await context.prisma.user.create({
        data: {
          email: args.data.email,
          password: hashedPass,
          name: args.data.name,
        },
      })

      return {
        token: sign({ userId: user.id }, process.env.SECRET),
        user,
      }
    } catch (error) {
      throw new Error(error ? String(error) : 'Something went wrong, Try again')
    }
  },
  login: async (parent, args: { data: loginInput }, context: Context) => {
    try {
      const user = await context.prisma.user.findUnique({
        where: {
          email: args.data.email,
        },
        include: {
          profile: true,
        },
      })

      if (!user) {
        throw new Error('Invalid credientials')
      }

      const validPassword = await compare(args.data.password, user.password)
      if (!validPassword) {
        throw new Error('Invalid credientials')
      }

      return {
        token: sign({ userId: user.id }, process.env.SECRET),
        user: user,
      }
    } catch (error) {
      // console.log(error)
      throw new Error(error ? String(error) : 'Something went wrong, Try again')
    }
  },
  createProfile: async (
    parent,
    args: { data: ProfileInp },
    context: Context,
  ) => {
    try {
      const userId = getUserId(context)

      // console.log(userId)

      if (!userId) {
        throw new Error('Something went wrong, Please login again')
      }

      const profile = await context.prisma.profile.create({
        data: {
          ...args.data,
          user: {
            connect: {
              id: Number(userId),
            },
          },
        },
      })

      return profile
    } catch (error) {
      // console.log(error)
      throw new Error(error ? String(error) : 'Something went wrong, Try again')
    }
  },
  updateProfile: async (
    parent,
    args: { profileId: number; data: ProfileInp },
    context: Context,
  ) => {
    try {
      const userId = getUserId(context)

      if (!userId) {
        throw new Error('Something went wrong, Try again')
      }

      const updatedProfile = await context.prisma.profile.update({
        data: {
          ...args.data,
        },
        where: {
          id: Number(args.profileId),
        },
      })

      return updatedProfile
    } catch (error) {
      throw new Error(error ? String(error) : 'Something went wrong, Try again')
    }
  },
  createTweet: async (
    parent,
    args: { data: { content: string; img: string } },
    context: Context,
  ) => {
    try {
      const userId = getUserId(context)

      if (!userId) {
        throw new Error('Something went wrong, Try again')
      }

      return await context.prisma.tweet.create({
        data: {
          content: args.data.content,
          img: args.data.img,
          author: {
            connect: {
              id: Number(userId),
            },
          },
        },
      })
    } catch (error) {
      throw new Error(error ? String(error) : 'Something went wrong, Try again')
    }
  },
  deleteTweet: async (parent, args, context: Context) => {
    const userId = getUserId(context)

    const delTweet = await context.prisma.tweet.findUnique({
      where: {
        id: Number(args.tweetId),
      },
    })

    if (!delTweet?.authorId) {
      throw new Error('Sorry the post doesnot exists')
    }

    if (Number(delTweet?.authorId) !== Number(userId)) {
      throw new Error('You are not authorised ')
    }

    await context.prisma.likedTweet.deleteMany({
      where: {
        tweetId: Number(args.tweetId),
      },
    })

    await context.prisma.comment.deleteMany({
      where: {
        tweetId: Number(args.tweetId),
      },
    })
    const tweet = await context.prisma.tweet.delete({
      where: {
        id: Number(args.tweetId),
      },
    })

    return tweet
  },
  updateTweet: async (
    parent,
    args: { tweetId: number; content: string },
    context: Context,
  ) => {
    const userId = getUserId(context)

    const upTweet = await context.prisma.tweet.findUnique({
      where: {
        id: Number(args.tweetId),
      },
    })

    if (!upTweet?.authorId) {
      throw new Error('Sorry the post doesnot exists')
    }

    if (Number(upTweet?.authorId) !== Number(userId)) {
      throw new Error('You are not authorised ')
    }

    const tweet = await context.prisma.tweet.update({
      data: {
        content: args.content,
      },
      where: {
        id: Number(args.tweetId),
      },
    })

    return tweet
  },
  likeTweet: async (
    parent,
    args: { data: { tweetId: number } },
    context: Context,
  ) => {
    try {
      const userId = getUserId(context)

      if (!userId) {
        throw new Error('Something went wrong, Try again')
      }

      const like = await context.prisma.likedTweet.create({
        data: {
          tweet: {
            connect: {
              id: Number(args.data.tweetId),
            },
          },
          user: {
            connect: {
              id: Number(userId),
            },
          },
        },
      })

      return like
    } catch (error) {
      throw new Error(error ? String(error) : 'Something went wrong, Try again')
    }
  },
  deleteLike: async (
    parent,
    args: { data: { id: number } },
    context: Context,
  ) => {
    try {
      const userId = getUserId(context)

      if (!userId) {
        throw new Error('Something went wrong, Try again')
      }

      const dislike = await context.prisma.likedTweet.delete({
        where: { id: args.data.id },
      })

      return dislike
    } catch (error) {
      throw new Error(error ? String(error) : 'Something went wrong, Try again')
    }
  },
  addComment: async (
    parent,
    args: { tweetId: number; data: { content: string } },
    context: Context,
  ) => {
    try {
      const userId = getUserId(context)

      if (!userId) {
        throw new Error('Something went wrong, Try again')
      }

      const comment = await context.prisma.comment.create({
        data: {
          content: args.data.content,
          user: {
            connect: {
              id: Number(userId),
            },
          },
          tweet: {
            connect: {
              id: Number(args.tweetId),
            },
          },
        },
      })

      return comment
    } catch (error) {
      throw new Error(error ? String(error) : 'Something went wrong, Try again')
    }
  },
  addReply: async (
    parent,
    args: { tweetId: number; data: { content: string }; commentId: number },
    context: Context,
  ) => {
    try {
      const userId = getUserId(context)

      if (!userId) {
        throw new Error('Something went wrong, Try again')
      }

      return await context.prisma.comment.create({
        data: {
          content: args.data.content,
          user: {
            connect: {
              id: Number(userId),
            },
          },
          tweet: {
            connect: {
              id: Number(args.tweetId),
            },
          },
          comment: {
            connect: {
              id: Number(args.commentId),
            },
          },
        },
      })
    } catch (error) {
      throw new Error(error ? String(error) : 'Something went wrong, Try again')
    }
  },

  follow: async (parent, args: { data: Follow }, context: Context) => {
    try {
      const userId = getUserId(context)

      if (!userId) {
        throw new Error('Something went wrong, Try again')
      }

      return await context.prisma.following.create({
        data: {
          followId: args.data.followId,
          name: args.data.name,
          avatar: args.data.avatar,
          user: {
            connect: {
              id: Number(userId),
            },
          },
        },
      })
    } catch (error) {
      // console.log(error)
      throw new Error(error ? String(error) : 'Something went wrong, Try again')
    }
  },

  unFollow: async (parent, args: { followId: number }, context: Context) => {
    try {
      const userId = getUserId(context)

      if (!userId) {
        throw new Error('Something went wrong, Try again')
      }

      return await context.prisma.following.delete({
        where: { id: args.followId },
      })
    } catch (error) {
      throw new Error(error ? String(error) : 'Something went wrong, Try again')
    }
  },
}

interface UserCreateInput {
  email: string
  name?: string
  password: string
}

interface loginInput {
  email: string
  password: string
}

interface ProfileInp {
  bio?: string
  location?: string
  website?: string
  avatar?: string
}

interface Follow {
  name: string
  followId: number
  avatar: string
}
