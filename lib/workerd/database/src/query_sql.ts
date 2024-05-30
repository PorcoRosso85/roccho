import { QueryArrayConfig, QueryArrayResult } from "pg";

interface Client {
    query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

export const getUserInfoQuery = `-- name: getUserInfo :one
SELECT user_id, user_name, email, registered_at FROM users WHERE user_id = $1`;

export interface getUserInfoArgs {
    userId: number;
}

export interface getUserInfoRow {
    userId: number;
    userName: string | null;
    email: string | null;
    registeredAt: Date | null;
}

export async function getUserInfo(client: Client, args: getUserInfoArgs): Promise<getUserInfoRow | null> {
    const result = await client.query({
        text: getUserInfoQuery,
        values: [args.userId],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        userId: row[0],
        userName: row[1],
        email: row[2],
        registeredAt: row[3]
    };
}

export const getUserRoleQuery = `-- name: getUserRole :one
SELECT users.user_id, users.user_name, users.email, users.registered_at, roles.role_id, roles.role_name, users_roles.user_id, users_roles.role_id
FROM users
JOIN users_roles ON users_roles.user_id = users.user_id
JOIN roles ON roles.role_id = users_roles.role_id
WHERE users."user_id" = $1`;

export interface getUserRoleArgs {
    userId: number;
}

export interface getUserRoleRow {
    users: string | null;
    roles: string | null;
    usersRoles: string | null;
}

export async function getUserRole(client: Client, args: getUserRoleArgs): Promise<getUserRoleRow | null> {
    const result = await client.query({
        text: getUserRoleQuery,
        values: [args.userId],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        users: row[0],
        roles: row[1],
        usersRoles: row[2]
    };
}

export const insertItemQuery = `-- name: insertItem :one


INSERT INTO items (item_id, item_name, owner_user_id, last_updated) VALUES (
    $1, $2, $3, $4
    ) RETURNING item_id, item_name, balance, owner_user_id, last_updated`;

export interface insertItemArgs {
    itemId: number;
    itemName: string;
    ownerUserId: number;
    lastUpdated: Date;
}

export interface insertItemRow {
    itemId: number;
    itemName: string;
    balance: string;
    ownerUserId: number;
    lastUpdated: Date;
}

export async function insertItem(client: Client, args: insertItemArgs): Promise<insertItemRow | null> {
    const result = await client.query({
        text: insertItemQuery,
        values: [args.itemId, args.itemName, args.ownerUserId, args.lastUpdated],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        itemId: row[0],
        itemName: row[1],
        balance: row[2],
        ownerUserId: row[3],
        lastUpdated: row[4]
    };
}

export const getItemQuery = `-- name: getItem :one

SELECT item_id, item_name, balance, owner_user_id, last_updated FROM items WHERE item_id = $1`;

export interface getItemArgs {
    itemId: number;
}

export interface getItemRow {
    itemId: number;
    itemName: string;
    balance: string;
    ownerUserId: number;
    lastUpdated: Date;
}

export async function getItem(client: Client, args: getItemArgs): Promise<getItemRow | null> {
    const result = await client.query({
        text: getItemQuery,
        values: [args.itemId],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        itemId: row[0],
        itemName: row[1],
        balance: row[2],
        ownerUserId: row[3],
        lastUpdated: row[4]
    };
}

export const insertUserQuery = `-- name: insertUser :one
INSERT INTO users (user_id, user_name, email, registered_at) VALUES (
    $1, $2, $3, $4
    ) RETURNING user_id, user_name, email, registered_at`;

export interface insertUserArgs {
    userId: number;
    userName: string | null;
    email: string | null;
    registeredAt: Date | null;
}

export interface insertUserRow {
    userId: number;
    userName: string | null;
    email: string | null;
    registeredAt: Date | null;
}

export async function insertUser(client: Client, args: insertUserArgs): Promise<insertUserRow | null> {
    const result = await client.query({
        text: insertUserQuery,
        values: [args.userId, args.userName, args.email, args.registeredAt],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        userId: row[0],
        userName: row[1],
        email: row[2],
        registeredAt: row[3]
    };
}

export const editUserQuery = `-- name: editUser :one
UPDATE users SET user_name = $2, email = $3, registered_at = $4 WHERE user_id = $1 RETURNING user_id, user_name, email, registered_at`;

export interface editUserArgs {
    userId: number;
    userName: string | null;
    email: string | null;
    registeredAt: Date | null;
}

export interface editUserRow {
    userId: number;
    userName: string | null;
    email: string | null;
    registeredAt: Date | null;
}

export async function editUser(client: Client, args: editUserArgs): Promise<editUserRow | null> {
    const result = await client.query({
        text: editUserQuery,
        values: [args.userId, args.userName, args.email, args.registeredAt],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        userId: row[0],
        userName: row[1],
        email: row[2],
        registeredAt: row[3]
    };
}

export const deleteUserQuery = `-- name: deleteUser :one
DELETE FROM users WHERE user_id = $1 RETURNING user_id, user_name, email, registered_at`;

export interface deleteUserArgs {
    userId: number;
}

export interface deleteUserRow {
    userId: number;
    userName: string | null;
    email: string | null;
    registeredAt: Date | null;
}

export async function deleteUser(client: Client, args: deleteUserArgs): Promise<deleteUserRow | null> {
    const result = await client.query({
        text: deleteUserQuery,
        values: [args.userId],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        userId: row[0],
        userName: row[1],
        email: row[2],
        registeredAt: row[3]
    };
}

