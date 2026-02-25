// lib/auth.ts
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(data: any): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ ...data, iat: Date.now() })).toString('base64url');
  
  const secret = process.env.JWT_SECRET || 'default-secret';
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${payload}`)
    .digest('base64url');

  return `${header}.${payload}.${signature}`;
}

export function verifyToken(token: string): any {
  try {
    const [header, payload, signature] = token.split('.');
    const secret = process.env.JWT_SECRET || 'default-secret';
    
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${header}.${payload}`)
      .digest('base64url');

    if (signature !== expectedSignature) {
      return null;
    }

    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return decoded;
  } catch (error) {
    return null;
  }
}

// Mock database (replace with real database in production)
interface User {
  id: string;
  username: string;
  name?: string;
  password: string;
  email: string;
  createdAt: Date;
}

let users: User[] = [
  {
    id: '39ba4524-d807-4457-99b4-79bc85d6aba4',
    username: 'admin',
    name: 'Admin User',
    email: 'admin@example.com',
    password: '$2b$10$0exJkYXPMPl8BK5b7s/L/.Xzsi.L2Z9hFDW5nm9aaRsaTSJU8mSCa',
    createdAt: new Date()
  },
  {
    id: '54043afc-de58-49db-9be3-23e81493b4dd',
    username: '29a12n19d92',
    name: 'Anand Waghela',
    email: 'and@smapp.com',
    password: '$2b$10$0exJkYXPMPl8BK5b7s/L/.Xzsi.L2Z9hFDW5nm9aaRsaTSJU8mSCa',
    createdAt: new Date()
  }
];

export async function createUser(username: string, email: string, password: string): Promise<User | null> {
  const existingUser = users.find(u => u.username === username || u.email === email);
  if (existingUser) return null;

  const hashedPassword = await hashPassword(password);
  const user: User = {
    id: crypto.randomUUID(),
    username,
    email,
    password: hashedPassword,
    createdAt: new Date()
  };

  users.push(user);
  return { ...user, password: '' };
}

export async function findUser(username: string): Promise<User | null> {
  return users.find(u => u.username === username) || null;
}

export async function authenticateUser(username: string, password: string): Promise<User | null> {
  const user = await findUser(username);
  if (!user) return null;

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) return null;

  return { ...user, password: '' };
}
