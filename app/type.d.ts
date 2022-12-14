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
  dayStartWork: string
  department: string
  email: string
  gender: boolean
  name: string
  phoneNumber: string
  uid: string
  photoUrl: string
  birthDay: string
}

declare interface Booking {
  date: string
  idDoctor: string
  idUser: string
  workingTime: number
  nameDoctor: string
  idBook: string
  status: number
}
declare interface PostArticle {
  timePost: string
  imagePost: string
  title: string
  content: string
  nameDoctor: string
  avtDoctor: string
  idPost: string
  like: []
  comment: []
}
declare interface Like {
  idUser: string
  status: boolean
}
declare interface Comment {
  idUser: string
  contentComment: string
  nameUser: string
  img: string
  timeComment: string
}
declare interface PostArticle {
  title: string
  content: string
  nameDoctor: string
  avtDoctor: string
  idPost: string
  idDoctor: string
  like: []
  comment: []
}
declare interface Like {
  idUser: string
  status: boolean
}
declare interface Comment {
  idUser: string
  contentComment: string
  nameUser: string
  img: string
}

declare interface UpdatePost {
  idPost: string
  img: string
  title: string
  content: string
}
