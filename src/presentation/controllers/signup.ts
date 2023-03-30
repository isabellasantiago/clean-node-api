import { MissingParamError } from "../errors/missing-param-error"
import { badRequest } from "../helpers/http-helper"
import { HttpResponse, HttpRequest } from "../protocols/http"
import { Controller } from "../protocols/controller"

export class SignUpController implements Controller {
    handle (httpRequest: HttpRequest): HttpResponse {
        if(!httpRequest.body.name) {
            return badRequest(new MissingParamError('name'))
        }
        if(!httpRequest.body.email) {
            return badRequest(new MissingParamError('email'))
        }

        const requiredFileds = ['name', 'email', 'password', 'passwordConfirmation']

        for (const field of requiredFileds) {
            if(!httpRequest.body[field]) {
                return badRequest(new MissingParamError(field))
            }
        }
    }
}