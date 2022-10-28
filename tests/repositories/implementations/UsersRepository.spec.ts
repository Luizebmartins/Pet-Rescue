import { User } from '@/entities/User'
import { IUsersRepository } from '@/repositories/IUsersRepository'
import { IUsersDbaMethods } from '@/infra/IUsersDbaMethods'
import { UsersFirebase } from '@/infra/firebase/methods/UsersFirebase'
import { firebaseAdmin } from '@/infra/firebase/connection/firebase'
import { UsersRepository } from '@/repositories/Implementations/UsersRepository'
const usersRef = firebaseAdmin.firestore().collection('users');


const makeSut = (): IUsersRepository => {
    const usersFirebase = new UsersFirebase(usersRef)
    return new UsersRepository(usersFirebase)
}

describe("Users Repository", () => {
    test("ensure return user if exist", async () => {
        const sut = makeSut()
        const userData = {
            name: 'anyName',
            email: 'email@teste.com',
            password: 'any',
            phone: ["35997464533"]
        }
        const user = new User(userData)
        const userCreated = await sut.save(user)
        
        const userGet = await sut.get(user.email)
        expect(userGet).toBeInstanceOf(User)
    })

    test("ensure successful user creation", async () => {
        const sut = makeSut()
        const userData = {
            name: 'anyName',
            email: 'email@teste.com',
            password: 'any',
            phone: ["35997464533"]
        }
        const user = new User(userData)
        const userCreated = await sut.save(user)
        expect(userCreated).toBe(true)
        await sut.delete(user.email)
    })
    
    test('ensure delete user if exist', async () => {
        const sut = makeSut()
        const userData = {
            name: 'anyName',
            email: 'email@teste.com',
            password: 'any',
            phone: ["35997464533"]
        }
        const user = new User(userData)
        const userCreated = await sut.save(user)
        expect(userCreated).toBe(true)

        const removedUser = await sut.delete(user.email)
        expect(removedUser).toBe(true)
    })
})