import { SignUpController } from '@/useCases/SignUp/SignUpController'
import { MissingParamError } from '@/useCases/utils/errors/missing-param-error'
import { InvalidParamError } from '@/useCases/utils/errors/invalid-param-error'
import { notMatchParamError } from '@/useCases/utils/errors/not-match-param-error'
import { StringValidator } from '@/useCases/utils/helpers/string-validation-helper'
import { SignUpUseCase } from '@/useCases/SignUp/SignUpUseCase'
import { IUsersRepository } from '@/repositories/IUsersRepository'

interface SutTypes {
    sut: SignUpController,
    signUpUseCaseStub: SignUpUseCase
}

const makeUserRepositoryStub = () => {
    class UserRepositoryStub implements IUsersRepository {
        get(user: any) {
            return true
        }
        save(user: any) {
            return true
        }
        delete(email: string){
            return true
        }
    }
    return new UserRepositoryStub
}


const makeSignUpUseCaseStub = (): SignUpUseCase => {
    return new SignUpUseCase(makeUserRepositoryStub())
}

const makeSut = (): SutTypes => {
    const emailValidator = new StringValidator
    const signUpUseCaseStub = makeSignUpUseCaseStub()
    const sut = new SignUpController(emailValidator, signUpUseCaseStub)

    return {
        sut,
        signUpUseCaseStub
    }

}

describe('SignUp controller', () => {
    test('should return 400 if no name is provided', async () => {
        const {sut} = makeSut()
        const httpRequest = {
            body: {
                email: 'email@email.com',
                password: 'any',
                confirmPassword: 'any',
                phone: "35997464533"
            }
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('name'))
    })
    
    test('should return 400 if no email is provided', async () => {
        const {sut} = makeSut()
        const httpRequest = {
            body: {
                name: 'anyName',
                password: 'any',
                confirmPassword: 'any',
                phone: "35997464533"
            }
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    }) 

    test('should return 400 if no valid email is provided',async () => {
        const {sut} = makeSut()
        const httpRequest = {
            body: {
                name: 'anyName',
                email: 'email@.com',
                password: 'any',
                confirmPassword: 'any',
                phone: "35997464533"
            }
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    }) 

    test('should return 400 if no password is provided', async () => {
        const {sut} = makeSut()
        const httpRequest = {
            body: {
                name: 'anyName',
                email: 'email@teste.com',
                confirmPassword: 'any',
                phone: "35997464533"
            }
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('password'))
    }) 

    test('should return 400 if no confirmPassword is provided', async () => {
        const {sut} = makeSut()
        const httpRequest = {
            body: {
                name: 'anyName',
                email: 'email@teste.com',
                password: 'any',
                phone: "35997464533"
            }
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('confirmPassword'))
    }) 

    test('should return 400 if password and confirmation password do not match', async () => {
        const {sut} = makeSut()
        const httpRequest = {
            body: {
                name: 'anyName',
                email: 'email@teste.com',
                password: 'any',
                confirmPassword: 'anypassword',
                phone: "35997464533"
            }
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new notMatchParamError('password', 'confirmPassword'))
    }) 

    test('should return 500 if SignUpUseCase generate an error', async () => {
        const {sut, signUpUseCaseStub} = makeSut()
        jest.spyOn(signUpUseCaseStub, 'execute').mockImplementation(() => {
            throw new Error()
        })

        const httpRequest = {
            body: {
                name: 'anyName',
                email: 'email@teste.com',
                password: 'any',
                confirmPassword: 'any',
                phone: "35997464533"
            }
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(500)

    })

})