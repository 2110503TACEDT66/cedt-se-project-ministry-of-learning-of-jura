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
    _id:string
}

export interface Session{
    user: User,
    token: string
}

export interface Restaurant{
    [x: string]: any
    name: string,
    address: string,
    menus: Menu[],
    openingHours: string,
    closingHours: string,
    reservationPeriods : {
        start : string,
        end : string,
    }[],
    reserverCapacity : number,
    reservation : string[],
    discounts : Discount[],
    tags: string[],
    _id: string
}
export interface Discount  {
    _id: string,
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
    _id: string,
    restaurant?: Restaurant,
    welcomedrink: boolean
}

export interface ReservationsResponse{
    success: boolean,
    data:Reservation[]
}

export interface ResizableMultiInputEvent{
    currentTarget:{
        value:string
    }
}

export interface Menu{
    name:string,
    price:number
}