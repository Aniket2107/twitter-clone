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
  },
  login: async (parent, args: { data: loginInput }, context: Context) => {
    const user = await context.prisma.user.findUnique({
      where: {
        email: args.data.email,
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
      user,
    }
  },
  createProfile: (parent, args: { data: ProfileInp }, context: Context) => {
    const userId = getUserId(context)

    console.log('userId', userId)

    if (!userId) {
      throw new Error('Something went wrong, Try again')
    }

    return context.prisma.profile.create({
      data: {
        ...args.data,
        user: {
          connect: {
            id: Number(userId),
          },
        },
      },
    })
  },
  updateProfile: (
    parent,
    args: { profileId: number; data: ProfileInp },
    context: Context,
  ) => {
    const userId = getUserId(context)

    if (!userId) {
      throw new Error('Something went wrong, Try again')
    }

    return context.prisma.profile.update({
      data: {
        ...args.data,
      },
      where: {
        id: Number(args.profileId),
      },
    })
  },
  createTweet: (
    parent,
    args: { data: { content: string; img: string } },
    context: Context,
  ) => {
    const userId = getUserId(context)

    if (!userId) {
      throw new Error('Something went wrong, Try again')
    }

    return context.prisma.tweet.create({
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
  },
  likeTweet: (
    parent,
    args: { data: { tweetId: number } },
    context: Context,
  ) => {
    const userId = getUserId(context)

    if (!userId) {
      throw new Error('Something went wrong, Try again')
    }

    return context.prisma.likedTweet.create({
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
  },
  deleteLike: (parent, args: { data: { id: number } }, context: Context) => {
    const userId = getUserId(context)

    if (!userId) {
      throw new Error('Something went wrong, Try again')
    }

    return context.prisma.likedTweet.delete({
      where: { id: args.data.id },
    })
  },
  addComment: (
    parent,
    args: { tweetId: number; data: { content: string } },
    context: Context,
  ) => {
    const userId = getUserId(context)

    if (!userId) {
      throw new Error('Something went wrong, Try again')
    }

    return context.prisma.comment.create({
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
  },
  addReply: (
    parent,
    args: { tweetId: number; data: { content: string }; commentId: number },
    context: Context,
  ) => {
    const userId = getUserId(context)

    if (!userId) {
      throw new Error('Something went wrong, Try again')
    }

    return context.prisma.comment.create({
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
  },

  follow: (parent, args: { data: Follow }, context: Context) => {
    const userId = getUserId(context)

    if (!userId) {
      throw new Error('Something went wrong, Try again')
    }

    return context.prisma.following.create({
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
  },

  unFollow: (parent, args: { followId: number }, context: Context) => {
    const userId = getUserId(context)

    if (!userId) {
      throw new Error('Something went wrong, Try again')
    }

    return context.prisma.following.delete({
      where: { id: args.followId },
    })
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
