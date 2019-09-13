import bcrypt from "bcryptjs"
import { async } from 'regenerator-runtime/runtime'
import prisma from "../../src/prisma"
import jwt from "jsonwebtoken"


const userOne = {
    input: {
        name: 'jen',
        email: 'jen@example.com',
        password: bcrypt.hashSync('Red098!@#$')
    },
    user: undefined,
    jwt: undefined
}

const userTwo = {
    input: {
        name: 'may',
        email: 'may@example.com',
        password: bcrypt.hashSync('Red098!@#$')
    },
    user: undefined,
    jwt: undefined
}

const postOne = {
    input: {
        title: 'why learn JavaScript by jen',
        body: '',
        published: true,
    },
    post: undefined,
}

const seedDatabase = async () => {
    // Delete test data
    await prisma.mutation.deleteManyUsers()

    // Create user one
    userOne.user = await prisma.mutation.createUser({
        data: userOne.input
    })
    userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET)
    // Create user two
    userTwo.user = await prisma.mutation.createUser({
        data: userTwo.input
    })
    userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET)

}

export { seedDatabase as default, userOne, userTwo }