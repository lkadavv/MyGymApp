export interface Booking {
    id?: number;
    training_id: number;
    client_name: string;
    client_phone: string;
    booking_date: string;
    status: string;
    created_at?: string;
}

export interface BookingWithTraining extends Booking {
    training_name?: string;
    trainer_name?: string;
    duration?: number;
    price?: number;
    time?: string;
}