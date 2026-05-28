/**
 * Mock dataset used by the Table demo page. Kept in a separate file so the demo
 * page itself stays focused on layout and component composition.
 */
import type { TagsVariant } from '../../../components/Tags';

export type UserStatus = 'Active' | 'Invited' | 'Suspended';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer' | 'Owner';
  status: UserStatus;
  joined: string; // ISO date
}

export const STATUS_VARIANT: Record<UserStatus, TagsVariant> = {
  Active: 'green',
  Invited: 'blue',
  Suspended: 'red'
};

export const USERS: UserRecord[] = [
  { id: 'u-001', name: 'Aanya Iyer',       email: 'aanya@acme.io',     role: 'Owner',  status: 'Active',    joined: '2024-03-12' },
  { id: 'u-002', name: 'Ben Park',         email: 'ben@acme.io',       role: 'Admin',  status: 'Active',    joined: '2024-04-02' },
  { id: 'u-003', name: 'Carmen Ortiz',     email: 'carmen@acme.io',    role: 'Editor', status: 'Active',    joined: '2024-04-19' },
  { id: 'u-004', name: 'Devon Liu',        email: 'devon@acme.io',     role: 'Editor', status: 'Invited',   joined: '2024-05-01' },
  { id: 'u-005', name: 'Esha Patel',       email: 'esha@acme.io',      role: 'Viewer', status: 'Active',    joined: '2024-05-14' },
  { id: 'u-006', name: 'Felix Brandt',     email: 'felix@acme.io',     role: 'Admin',  status: 'Suspended', joined: '2024-06-03' },
  { id: 'u-007', name: 'Gia Romano',       email: 'gia@acme.io',       role: 'Viewer', status: 'Active',    joined: '2024-06-22' },
  { id: 'u-008', name: 'Hiroshi Tanaka',   email: 'hiroshi@acme.io',   role: 'Editor', status: 'Active',    joined: '2024-07-07' },
  { id: 'u-009', name: 'Imani Davies',     email: 'imani@acme.io',     role: 'Admin',  status: 'Active',    joined: '2024-07-19' },
  { id: 'u-010', name: 'Jonas Weber',      email: 'jonas@acme.io',     role: 'Viewer', status: 'Invited',   joined: '2024-08-02' },
  { id: 'u-011', name: 'Kalei Mahoe',      email: 'kalei@acme.io',     role: 'Editor', status: 'Active',    joined: '2024-08-15' },
  { id: 'u-012', name: 'Lin Chen',         email: 'lin@acme.io',       role: 'Admin',  status: 'Active',    joined: '2024-09-01' },
  { id: 'u-013', name: 'Mateo Alvarez',    email: 'mateo@acme.io',     role: 'Viewer', status: 'Suspended', joined: '2024-09-20' },
  { id: 'u-014', name: 'Nadia Petrov',     email: 'nadia@acme.io',     role: 'Editor', status: 'Active',    joined: '2024-10-04' },
  { id: 'u-015', name: 'Owen MacLeod',     email: 'owen@acme.io',      role: 'Admin',  status: 'Active',    joined: '2024-10-22' },
  { id: 'u-016', name: 'Priya Raman',      email: 'priya@acme.io',     role: 'Editor', status: 'Invited',   joined: '2024-11-09' },
  { id: 'u-017', name: 'Quentin Hayes',    email: 'quentin@acme.io',   role: 'Viewer', status: 'Active',    joined: '2024-11-28' },
  { id: 'u-018', name: 'Rosa Beltrán',     email: 'rosa@acme.io',      role: 'Editor', status: 'Active',    joined: '2024-12-12' },
  { id: 'u-019', name: 'Sven Lindqvist',   email: 'sven@acme.io',      role: 'Admin',  status: 'Active',    joined: '2025-01-06' },
  { id: 'u-020', name: 'Tamar Cohen',      email: 'tamar@acme.io',     role: 'Viewer', status: 'Active',    joined: '2025-01-24' },
  { id: 'u-021', name: 'Uma Rao',          email: 'uma@acme.io',       role: 'Editor', status: 'Suspended', joined: '2025-02-11' },
  { id: 'u-022', name: 'Vikram Singh',     email: 'vikram@acme.io',    role: 'Admin',  status: 'Active',    joined: '2025-02-27' },
  { id: 'u-023', name: 'Wren Carlisle',    email: 'wren@acme.io',      role: 'Viewer', status: 'Invited',   joined: '2025-03-15' },
  { id: 'u-024', name: 'Ximena Vela',      email: 'ximena@acme.io',    role: 'Editor', status: 'Active',    joined: '2025-04-01' },
  { id: 'u-025', name: 'Yusuf Demir',      email: 'yusuf@acme.io',     role: 'Admin',  status: 'Active',    joined: '2025-04-20' },
  { id: 'u-026', name: 'Zara Okonkwo',     email: 'zara@acme.io',      role: 'Viewer', status: 'Active',    joined: '2025-05-08' }
];

export const formatJoined = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
