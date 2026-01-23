
import fs from 'fs';
import path from 'path';
import { PROPERTIES } from './data';

const DB_PATH = path.join(process.cwd(), 'data.json');
const USERS_PATH = path.join(process.cwd(), 'users.json');
const SAVED_PATH = path.join(process.cwd(), 'saved.json');

// Initialize DB if it doesn't exist
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(PROPERTIES, null, 2));
}

// Initialize USERS if it doesn't exist
if (!fs.existsSync(USERS_PATH)) {
    fs.writeFileSync(USERS_PATH, JSON.stringify([], null, 2));
}

// Initialize SAVED if it doesn't exist
if (!fs.existsSync(SAVED_PATH)) {
    fs.writeFileSync(SAVED_PATH, JSON.stringify([], null, 2));
}

export function getProperties() {
    if (!fs.existsSync(DB_PATH)) return [];
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
}

export function saveProperties(properties: any[]) {
    fs.writeFileSync(DB_PATH, JSON.stringify(properties, null, 2));
}

export function addProperty(property: any) {
    const current = getProperties();
    const newProperty = { ...property, id: Math.random().toString(36).substr(2, 9) };
    current.push(newProperty);
    saveProperties(current);
    return newProperty;
}

export function deleteProperty(id: string) {
    const current = getProperties();
    const filtered = current.filter((p: any) => p.id !== id);
    saveProperties(filtered);
}

export function updateProperty(id: string, updates: any) {
    const current = getProperties();
    const index = current.findIndex((p: any) => p.id === id);
    if (index !== -1) {
        current[index] = { ...current[index], ...updates };
        saveProperties(current);
        return current[index];
    }
    return null;
}

export function getUsers() {
    const data = fs.readFileSync(USERS_PATH, 'utf-8');
    return JSON.parse(data);
}

export function saveUsers(users: any[]) {
    fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
}

export function getSavedItems() {
    const data = fs.readFileSync(SAVED_PATH, 'utf-8');
    return JSON.parse(data);
}

export function saveSavedItems(items: any[]) {
    fs.writeFileSync(SAVED_PATH, JSON.stringify(items, null, 2));
}

// --- User Operations ---
export function registerUser(user: any) {
    const users = getUsers();
    if (users.find((u: any) => u.email === user.email)) {
        throw new Error("User already exists");
    }
    const newUser = {
        ...user,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString()
    };
    users.push(newUser);
    saveUsers(users);
    // Don't return password
    const { password, ...safeUser } = newUser;
    return safeUser;
}

export function authenticateUser(email: string, pass: string) {
    const users = getUsers();
    const user = users.find((u: any) => u.email === email && u.password === pass);
    if (user) {
        const { password, ...safeUser } = user;
        return safeUser;
    }
    return null;
}

// --- Saved Property Operations ---
export function toggleSavedProperty(userId: string, propertyId: string) {
    const saved = getSavedItems();
    const index = saved.findIndex((s: any) => s.userId === userId && s.propertyId === propertyId);

    if (index !== -1) {
        saved.splice(index, 1);
        saveSavedItems(saved);
        return false; // Removed
    } else {
        saved.push({ userId, propertyId, createdAt: new Date().toISOString() });
        saveSavedItems(saved);
        return true; // Added
    }
}

export function getUserSavedProperties(userId: string) {
    const saved = getSavedItems();
    const properties = getProperties();
    const userSavedIds = saved.filter((s: any) => s.userId === userId).map((s: any) => s.propertyId);
    return properties.filter((p: any) => userSavedIds.includes(p.id));
}

export function isPropertySaved(userId: string, propertyId: string) {
    const saved = getSavedItems();
    return saved.some((s: any) => s.userId === userId && s.propertyId === propertyId);
}
