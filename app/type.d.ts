declare interface InfoUser {
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
    dayStartWork:string
    department:string
    email:string
    gender:boolean
    name:string
    phoneNumber:string
    uid:string
    photoUrl:string
    birthDay: string
  }

  declare interface Booking {
    date:string
    idDoctor:string
    idUser:string
    workingTime:number
    nameDoctor:string
  }