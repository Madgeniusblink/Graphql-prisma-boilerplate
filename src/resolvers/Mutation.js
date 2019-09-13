import bcrypt from 'bcryptjs'
import generateToken from '../utils/generateToken'
import getUserId from "../utils/getUserId"
import hashPassword from "../utils/hashPassword"
import { emailTaken, userExists, postExists, commentExists} from "../utils/validationFunctions"


const Mutation = {
    async createUser(parent, args, { prisma }, info) {
        await emailTaken(prisma, args.data.email)
        const password = await hashPassword(args.data.password)

        
        const user = await prisma.mutation.createUser({
                data: {
                  ...args.data,
                  password: password
                } 
            })
            // not adding info will return all scalar fields
        // JWT user.id
        return {
            user,
            token: generateToken(user.id)
        }
    },
    async loginUser(parent, args, {prisma}, info) {
        // find user by email
        const user = await prisma.query.user({
            where: {
                email: args.data.email
            }
        })

        if (!user) {
            throw new Error(`Unable to login`)
        }

        const isMatch = await bcrypt.compare(args.data.password, user.password)

        if (!isMatch) {
            throw new Error(`Unable to login`)
        }
        
        return {
            user,
            token: generateToken(user.id)
        }
        
    },
    async deleteUser(parent, args, {prisma, request}, info) {
        const userId = getUserId(request)

        await userExists(prisma, userId)
        return prisma.mutation.deleteUser({ where: { id: userId } }, info)
    },
    async updateUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        if (typeof args.data.password === 'string') {
            args.data.password = await hashPassword(args.data.password)
        }

        return prisma.mutation.updateUser({ 
            where: {
                id: userId
            },
            data: args.data
        }, info)
    }
}

export { Mutation as default }
