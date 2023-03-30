import { SignUpController } from './signup';
import { MissingParamError, InvalidParamError, ServerError } from "../errors"
import { EmailValidator } from '../protocols';

interface SutTypes {
    sut: SignUpController,
    emailValidatorStub: EmailValidator,
}

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator{
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub();
}

const makeEmailValidatorWithError = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator{
        isValid(email: string): boolean {
            throw new Error()
        }
    }

    return new EmailValidatorStub();
}

const makeSut = (): SutTypes => {
    const emailValidatorStub: EmailValidator = makeEmailValidator();
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


    test('Should call EmailValidator with correct email', () => {
        //sut- system under test (class to test)
        const { sut, emailValidatorStub } = makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }

        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
        
        sut.handle(httpRequest)
        expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
    })

    test('Should return 500 if email validator throws', () => {
        
        const emailValidatorStub: EmailValidator = makeEmailValidatorWithError();

        const sut = new SignUpController(emailValidatorStub);

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        
        const httResponse = sut.handle(httpRequest)
        expect(httResponse.statusCode).toBe(500)
        expect(httResponse.body).toEqual(new ServerError())
    })
})