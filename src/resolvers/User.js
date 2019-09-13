import getUserId from "../utils/getUserId"
import { Prisma } from "prisma-binding"

// When creating creating resolvers and customizing the data return 
// we use parent to call from the main query which in this file is users()
// so when you need an email or id or name you do not need to specify like args.data.name or args.id
// for that you have parent which calls from the info (the data return). so you can call it like parent.id or parent.name 
// 
const User = {
    email: {
        fragment: 'fragment userId on User { id }',
        resolve(parent, args, { request }, info) {
            const userId = getUserId(request, false)
    
            if (userId && userId === parent.id) {
                return parent.email
            } else {
                return null
            }
        }
    },
}

export { User as default}