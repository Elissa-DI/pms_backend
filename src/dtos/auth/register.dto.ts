import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Role } from "@prisma/client";

export class RegisterDto {
  @IsString({ message: "Name must be a string." })
  @IsNotEmpty({ message: "Name is required." })
  public name!: string;

  @IsEmail({}, { message: "Email must be a valid email address." })
  @IsNotEmpty({ message: "Email is required." })
  public email!: string;

  @IsString({ message: "Password must be a string." })
  @IsNotEmpty({ message: "Password is required." })
  @MinLength(12, { message: "Password must be at least 12 characters long." })
  public password!: string;

  @IsEnum(Role, { message: `Role must be one of: ${Object.values(Role).join(", ")}` })
  public role!: Role;
}
