import { Body, Controller, ParseIntPipe, Post} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "src/dto";
// import { Request } from "express";

@Controller("auth")
export class AuthController {
    constructor (private authService: AuthService) {}

        @Post("signup")
        signup(@Body() dto: AuthDto) {
            // signup(
            //     @Body("email") email: string, 
            //     @Body("password", ParseIntPipe) password: string
            // ) {
            // console.log({
            //     email,
            //     typeOfEmail: typeof email,
            //     password,
            //     typeOfPassword: typeof password,
            // });

            // console.log({
            //     dto,
            // });
            
            return this.authService.signup(dto);
        }

        @Post('signin')
        signin(@Body() dto: AuthDto) {
            return this.authService.signin(dto);
        }
    
}