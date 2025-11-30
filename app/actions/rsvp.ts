'use server';

import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export interface RSVPData {
  name: string;
  email: string;
  numberOfGuests: number;
  attending: boolean;
  submittedAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const RSVP_FILE = path.join(DATA_DIR, 'rsvps.json');

async function ensureDataDirectory() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

async function getRSVPs(): Promise<RSVPData[]> {
  await ensureDataDirectory();

  if (!existsSync(RSVP_FILE)) {
    return [];
  }

  try {
    const data = await readFile(RSVP_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading RSVPs:', error);
    return [];
  }
}

async function saveRSVPs(rsvps: RSVPData[]): Promise<void> {
  await ensureDataDirectory();
  await writeFile(RSVP_FILE, JSON.stringify(rsvps, null, 2), 'utf-8');
}

export async function submitRSVP(data: RSVPData) {
  try {
    // Validate data
    if (!data.name || !data.email) {
      return { success: false, error: 'Name and email are required' };
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return { success: false, error: 'Please enter a valid email address' };
    }

    // Get existing RSVPs
    const rsvps = await getRSVPs();

    // Check for duplicate email
    const existingRSVP = rsvps.find(rsvp => rsvp.email.toLowerCase() === data.email.toLowerCase());
    if (existingRSVP) {
      // Update existing RSVP
      const updatedRSVPs = rsvps.map(rsvp =>
        rsvp.email.toLowerCase() === data.email.toLowerCase() ? data : rsvp
      );
      await saveRSVPs(updatedRSVPs);
      return { success: true, message: 'RSVP updated successfully' };
    }

    // Add new RSVP
    rsvps.push(data);
    await saveRSVPs(rsvps);

    return { success: true, message: 'RSVP submitted successfully' };
  } catch (error) {
    console.error('Error submitting RSVP:', error);
    return { success: false, error: 'Failed to submit RSVP. Please try again.' };
  }
}
