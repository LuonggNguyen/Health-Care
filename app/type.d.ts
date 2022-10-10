declare interface InfoUser {
    age: number
    birthday: string
    bloodPressure: string
    email: string
    gender: boolean
    heartbeat: number
    height: number
    name: string
    phoneNumber: string
    weight: number
    photoUrl: string
  }

declare interface InfoDoctor {
    age:number
    dayStartWork:string
    department:string
    email:string
    gender:boolean
    name:string
    phoneNumber:string
    uid:string
  }

  declare interface Booking {
    date:string
    idDoctor:string
    idUser:string
    workingTime:number
  }