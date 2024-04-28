export interface RestaurantData{
    imgSrc: string,
    name: string
}
export interface User{
    username:string,
    email:string,
    role:string,
    joinedAt:string,
    phone:string[],
    _id:string,
    point: number,
    karma: number
}

export interface Session{
    user: User,
    token: string
}
export interface Period{
    start:string,
    end:string
}
export interface Restaurant{
    // [x: string]: any
    name: string,
    address: string,
    menus: Menu[],
    openingHours: string,
    closingHours: string,
    reservationPeriods : Period[],
    reserverCapacity : number,
    reservation : string[],
    discounts : DiscountWithEdit[],
    tags: string[],
    _id: string,
    isOwner?: boolean
}
export interface DiscountWithEdit extends Discount{
    canEdit?: boolean
}
export interface Discount  {
    _id?: string,
    name: string,

    description : string,
        
    points: number,

    isValid: boolean
}

interface BaseRestaurantResponse{
    success:boolean,
    count:number,
    pagination:{
        limit:number,
        total:number,
        next:{
            page:number
        },
        prev:{
            page:number
        }
    },
}

export interface RestaurantsResponse extends BaseRestaurantResponse{
    data: Restaurant[]
}

export interface RestaurantResponse extends BaseRestaurantResponse{
    data: Restaurant
}

export interface Reservation{
    reservorId: string,
    restaurantId: string,
    reservationDate: string,
    _id?: string,
    // restaurant?: Restaurant,
    welcomeDrink: boolean,
    discountIndex: number,
    reservationPeriod: Period
}

export interface ReservationsResponse{
    success: boolean,
    data:Reservation[]
}

export interface ResizableMultiInputEvent{
    currentTarget:{
        value:any
    }
}

export interface Menu{
    name:string,
    price:number
}

export type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;