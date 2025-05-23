export interface User {
    user_id: number;
    first_name: string;
    last_name: string;
    user_image: string;
    user_name: string;
    user_email: string;
    user_phone: string;
    user_address: string;
    role: string;
    user_status: string;
    // user_password is intentionally omitted for security reasons
}