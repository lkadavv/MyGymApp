export interface Booking {
    id?: number;
    training_id: number;
    client_name: string;
    client_phone: string;
    booking_date: string;
    training_name?: string;
    trainer_name?: string;
    price?: number;
    time?: string;
}