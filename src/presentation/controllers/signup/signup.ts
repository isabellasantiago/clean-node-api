import { MissingParamError, InvalidParamError } from "../../errors"
import { badRequest, serverError } from "../../helpers/http-helper"
import { HttpResponse, HttpRequest, Controller, EmailValidator, AddAccount } from "./signup-protocols";

export class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator;
    private readonly addAccount: AddAccount;

    constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
        this.emailValidator = emailValidator
        this.addAccount = addAccount;
    }    
    handle (httpRequest: HttpRequest): HttpResponse {
        try{
            const requiredFileds = ['name', 'email', 'password', 'passwordConfirmation']

            for (const field of requiredFileds) {
                if(!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }

            const {email, password, passwordConfirmation, name} = httpRequest.body

            if(password !== passwordConfirmation) {
                return badRequest(new InvalidParamError('passwordConfirmation'))
            }

            const isEmailValid = this.emailValidator.isValid(email);

            if(!isEmailValid) return badRequest( new InvalidParamError('email'));

            const account = this.addAccount.add({
                name,
                email,
                password
            })

            return {
                statusCode: 200,
                body: account
            }
        }catch(error){
            return serverError()
        }
        
    }
}