import { SignUpController } from './signup';
import { MissingParamError } from '../errors/missing-param-error';
import { InvalidParamError } from '../errors/invalid-param-error';
import { EmailValidator } from '../protocols/email-validator';

interface SutTypes {
    sut: SignUpController,
    emailValidatorStub: EmailValidator,
}

const makeSut = (): SutTypes => {
    class EmailValidatorStub implements EmailValidator{
        isValid(email: string): boolean {
            return true
        }
    }
    const emailValidatorStub: EmailValidator = new EmailValidatorStub();

    const sut = new SignUpController(emailValidatorStub)
    return {
        sut,
        emailValidatorStub
    }
}

describe('SignUp Controller', () => {
    test('Should return 400 if no name is provided', () => {
        //sut- system under test (class to test)
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        
        const httResponse = sut.handle(httpRequest)
        expect(httResponse.statusCode).toBe(400)
        expect(httResponse.body).toEqual(new MissingParamError('name'))
    })

    test('Should return 400 if no email is provided', () => {
        //sut- system under test (class to test)
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        
        const httResponse = sut.handle(httpRequest)
        expect(httResponse.statusCode).toBe(400)
        expect(httResponse.body).toEqual(new MissingParamError('email'))
    })

    test('Should return 400 if no password is provided', () => {
        //sut- system under test (class to test)
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                passwordConfirmation: 'any_password'
            }
        }
        
        const httResponse = sut.handle(httpRequest)
        expect(httResponse.statusCode).toBe(400)
        expect(httResponse.body).toEqual(new MissingParamError('password'))
    })

    test('Should return 400 if no passwordConfirmation is provided', () => {
        //sut- system under test (class to test)
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password'
            }
        }
        
        const httResponse = sut.handle(httpRequest)
        expect(httResponse.statusCode).toBe(400)
        expect(httResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
    })

    test('Should return 400 if an invalid email is provided', () => {
        //sut- system under test (class to test)
        const { sut, emailValidatorStub } = makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'invalid_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }

        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        
        const httResponse = sut.handle(httpRequest)
        expect(httResponse.statusCode).toBe(400)
        expect(httResponse.body).toEqual(new InvalidParamError('email'))
    })
})