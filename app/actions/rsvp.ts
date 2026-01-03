'use server';

import { supabase } from '../../lib/supabase';

export interface RSVPData {
  name: string;
  email: string;
  numberOfGuests: number;
  attending: boolean;
  submittedAt: string;
}

export async function getRSVPByEmail(email: string) {
  try {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Please enter a valid email address' };
    }

    const normalizedEmail = email.toLowerCase();

    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .eq('email', normalizedEmail)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No RSVP found - log that they checked
        await supabase
          .from('rsvps')
          .insert([{
            email: normalizedEmail,
            last_checked_at: new Date().toISOString(),
          }]);

        return { success: false, error: 'No RSVP found for this email address' };
      }
      console.error('Error looking up RSVP:', error);
      return { success: false, error: 'Failed to look up RSVP. Please try again.' };
    }

    // Update last_checked_at for existing RSVP
    await supabase
      .from('rsvps')
      .update({ last_checked_at: new Date().toISOString() })
      .eq('email', normalizedEmail);

    // Convert database format to app format
    const rsvp: RSVPData = {
      name: data.name,
      email: data.email,
      numberOfGuests: data.number_of_guests,
      attending: data.attending,
      submittedAt: data.submitted_at,
    };

    return { success: true, rsvp };
  } catch (error) {
    console.error('Error looking up RSVP:', error);
    return { success: false, error: 'Failed to look up RSVP. Please try again.' };
  }
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

    const normalizedEmail = data.email.toLowerCase();

    // Check if RSVP already exists
    const { data: existingRSVP } = await supabase
      .from('rsvps')
      .select('id')
      .eq('email', normalizedEmail)
      .single();

    // Prepare data for database
    const dbData = {
      name: data.name,
      email: normalizedEmail,
      number_of_guests: data.numberOfGuests,
      attending: data.attending,
      submitted_at: data.submittedAt,
      updated_at: new Date().toISOString(),
    };

    if (existingRSVP) {
      // Update existing RSVP
      const { error } = await supabase
        .from('rsvps')
        .update(dbData)
        .eq('email', normalizedEmail);

      if (error) {
        console.error('Error updating RSVP:', error);
        return { success: false, error: 'Failed to update RSVP. Please try again.' };
      }

      return { success: true, message: 'RSVP updated successfully' };
    } else {
      // Insert new RSVP
      const { error } = await supabase
        .from('rsvps')
        .insert([dbData]);

      if (error) {
        console.error('Error submitting RSVP:', error);
        return { success: false, error: 'Failed to submit RSVP. Please try again.' };
      }

      return { success: true, message: 'RSVP submitted successfully' };
    }
  } catch (error) {
    console.error('Error submitting RSVP:', error);
    return { success: false, error: 'Failed to submit RSVP. Please try again.' };
  }
}

export async function getAllRSVPs() {
  try {
    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .order('submitted_at', { ascending: false, nullsFirst: false });

    if (error) {
      console.error('Error fetching RSVPs:', error);
      return { success: false, error: 'Failed to fetch RSVPs' };
    }

    // Convert database format to app format, including check-only records
    const allRecords = data.map((row: any) => ({
      name: row.name || null,
      email: row.email,
      numberOfGuests: row.number_of_guests || 0,
      attending: row.attending,
      submittedAt: row.submitted_at || null,
      lastCheckedAt: row.last_checked_at || null,
    }));

    return { success: true, rsvps: allRecords };
  } catch (error) {
    console.error('Error fetching all RSVPs:', error);
    return { success: false, error: 'Failed to fetch RSVPs' };
  }
}
