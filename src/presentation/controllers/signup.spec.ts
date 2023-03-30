import {SignUpController} from './signup';
import { MissingParamError } from '../errors/missing-param-error';

describe('SignUp Controller', () => {
    test('Should return 400 if no name is provided', () => {
        //sut- system under test (class to test)
        const sut = new SignUpController()
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

    test('Should return 400 if no name is provided', () => {
        //sut- system under test (class to test)
        const sut = new SignUpController()
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
})