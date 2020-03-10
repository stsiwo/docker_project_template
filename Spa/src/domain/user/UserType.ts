/** for user who login this web app **/
export declare type UserType = {
  id: string,
  name: string,
  email?: string,
  password?: string,
  confirm?: string,
  avatarUrl?: string,
  avatarImage?: Blob,
  roles?: RoleEnum[]
}

export enum RoleEnum {
  ADMIN = 'admin',
  MEMBER = 'member',
}

export const initialUserState: UserType = {
  id: '',
  name: '',
  email: '',
  password: '',
  avatarUrl: '',
  avatarImage: null,
  roles: [],
}

export declare type ForgotPasswordType = {
  email: string
}

export const initialForgotPasswordStatus: ForgotPasswordType = {
  email: '',
}

export declare type UserResetPasswordType = {
  password: string
  confirm: string
}

export const initialUserResetPasswordStatus: UserResetPasswordType = {
  password: '',
  confirm: ''
}

export declare type UserResetPasswordRequestDataType = UserResetPasswordType

export declare type UserProfileType = {
  id: string
  name: string
  email: string
  password: string
  confirm: string
}

export declare type UserLoginRequestDataType = {
  email: string
  password: string
}

export declare type UserLoginType = {
  email: string
  password: string,
  confirm: string
}

export declare type UserCredentialValidationSchemaType = {
  password: string,
  confirm: string
}

export declare type UserLoginValidationSchemaType = {
  email: string,
  credential: UserCredentialValidationSchemaType
}

export const initialUserLoginStatus: UserLoginType = {
  email: '',
  password: '',
  confirm: '',
}

export declare type UserSignupRequestDataType = {
  name: string
  email: string
  password: string
}

export declare type UserSignupType = {
  confirm: string
} & UserSignupRequestDataType


export const initialUserSignupStatus: UserSignupType = {
  name: '',
  email: '',
  password: '',
  confirm: '',
}

