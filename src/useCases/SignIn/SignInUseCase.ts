import { IUsersRepository } from '../../repositories/IUsersRepository'
import { ISignInDTO } from './SignInDTO'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

export class SignInUseCase {
    constructor(
        private usersRepository: IUsersRepository
    ) {}

    async execute(data: ISignInDTO): Promise<any> {
        const existingUser = await this.usersRepository.get(data.email)
        if(!existingUser) throw new Error("Email or password is incorrect!")

        const passwordMatch = await bcrypt.compare(data.password, existingUser.password)
        if(!passwordMatch) throw new Error("Email or password is incorrect!")
        
        const token = jwt.sign({
            email: existingUser.email,
        }, process.env.JWT_KEY, {
            expiresIn: '1d',
        })

        return {
            success: true,
            token: token
        }
    }
}