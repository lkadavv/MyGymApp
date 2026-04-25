export interface Training {
    id?: number;
    name: string;
    trainer_name: string;
    duration: number;
    price: number;
    max_capacity: number;
    time: string;
    description?: string;
    image_emoji?: string;
}