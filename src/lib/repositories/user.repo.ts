import pool from "@/src/lib/db";

export interface UserRow {
    id: Number;
    email: string;
    password: string | null;
    name: string | null;
    role: 
    auth_provider: string
}

export interface RegisterInput {
  email: string;

}

export async function findUserById() {}
