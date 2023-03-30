import { MissingParamError, InvalidParamError } from "../errors"
import { badRequest, serverError } from "../helpers/http-helper"
import { HttpResponse, HttpRequest, Controller, EmailValidator } from "../protocols";

export class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator;

    constructor(emailValidator: EmailValidator) {
        this.emailValidator = emailValidator
    }    
    handle (httpRequest: HttpRequest): HttpResponse {
        try{
            const requiredFileds = ['name', 'email', 'password', 'passwordConfirmation']

            for (const field of requiredFileds) {
                if(!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }

            if(httpRequest.body.password !== httpRequest.body.passwordConfirmation) {
                return badRequest(new InvalidParamError('passwordConfirmation'))
            }

            const isEmailValid = this.emailValidator.isValid(httpRequest.body.email);

            if(!isEmailValid) return badRequest( new InvalidParamError('email'));

        }catch(error){
            return serverError()
        }
        
    }
}