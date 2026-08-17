import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      client_name,
      email,
      phone,
      target_allocation,
      portfolioSize,
      consultation_date,
      preferredDate,
      time_slot,
      preferredTime,
      notes,
    } = body;

    const finalName = (client_name || name || '').trim();
    const finalEmail = (email || '').trim().toLowerCase();
    const finalPhone = (phone || '').trim();
    const finalAllocation = target_allocation || portfolioSize || '₹10L - ₹25L';
    
    // Combine date & time into consultation_date to strictly match Supabase table schema
    const rawDate = consultation_date || preferredDate || 'Tomorrow';
    const rawTime = time_slot || preferredTime || '04:00 PM - 04:30 PM';
    const formattedConsultationDate = `${rawDate} • ${rawTime}`;

    // Validate required fields
    if (!finalName || !finalEmail || !finalPhone) {
      return NextResponse.json(
        { error: 'Client Name, Email Address, and Phone Number are required.' },
        { status: 400 }
      );
    }

    // 1. Initialize Supabase Client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cplgtebmbplroctuqmyz.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseKey) {
      console.error('❌ [SUPABASE CONFIG ERROR]: Missing Supabase Key in environment variables.');
      return NextResponse.json(
        { error: 'Server database configuration error.' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    // 2. Insert into Supabase `public.mfd_bookings` table
    // Exact schema columns: client_name, email, phone, target_allocation, consultation_date
    const { data: dbBooking, error: dbError } = await supabase
      .from('mfd_bookings')
      .insert({
        client_name: finalName,
        email: finalEmail,
        phone: finalPhone,
        target_allocation: finalAllocation,
        consultation_date: formattedConsultationDate,
      })
      .select('id, client_name, email, phone, target_allocation, consultation_date, created_at')
      .single();

    if (dbError) {
      console.error('❌ [SUPABASE INSERT FAILED]:', {
        code: dbError.code,
        message: dbError.message,
        details: dbError.details,
        hint: dbError.hint,
      });

      return NextResponse.json(
        { 
          error: `Database insertion failed: ${dbError.message}`,
          code: dbError.code,
        },
        { status: 500 }
      );
    }

    const generatedBookingId = dbBooking.id;
    console.log('✅ [SUPABASE INSERT SUCCESS]: Created booking row #', generatedBookingId);

    // 3. Dispatch real HTML email notification via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL || 'support@brewrichwealth.com';
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    let emailDispatched = false;

    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);

        const emailHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #0f172a; }
                .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.06); }
                .header { background: linear-gradient(135deg, #0A358F 0%, #1456F0 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
                .header h1 { margin: 0 0 6px 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
                .header p { margin: 0; font-size: 12px; opacity: 0.9; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; }
                .content { padding: 32px 24px; }
                .alert-pill { display: inline-block; background: #eff6ff; color: #1d4ed8; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 800; border: 1px solid #bfdbfe; margin-bottom: 20px; text-transform: uppercase; }
                .details-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
                .details-table td { padding: 12px 14px; font-size: 14px; border-bottom: 1px solid #f1f5f9; }
                .details-table td.label { width: 38%; font-weight: 600; color: #64748b; background-color: #f8fafc; border-radius: 6px; }
                .details-table td.value { font-weight: 700; color: #0f172a; }
                .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; background: #eff6ff; color: #1e40af; font-weight: 800; font-size: 13px; border: 1px solid #dbeafe; }
                .action-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 14px; padding: 16px; margin-top: 24px; }
                .footer { padding: 20px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8; }
                .btn { display: inline-block; background: #1456F0; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 9999px; font-weight: 700; font-size: 14px; margin-top: 16px; }
              </style>
            </head>
            <body>
              <div class="card">
                <div class="header">
                  <p>Brewrich Wealth Advisory Desk</p>
                  <h1>New 1-on-1 Portfolio Consultation</h1>
                </div>
                <div class="content">
                  <span class="alert-pill">⚡ Direct Consultation Lead</span>
                  <p style="font-size: 15px; line-height: 1.5; color: #334155; margin-top: 0;">
                    A prospective investor has requested a 1-on-1 Mutual Fund Portfolio Review & Fast-Track Account Opening consultation.
                  </p>
                  
                  <table class="details-table">
                    <tr>
                      <td class="label">Database Record ID</td>
                      <td class="value"><code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-family: monospace;">${generatedBookingId}</code></td>
                    </tr>
                    <tr>
                      <td class="label">Client Name</td>
                      <td class="value">${finalName}</td>
                    </tr>
                    <tr>
                      <td class="label">Phone / WhatsApp</td>
                      <td class="value"><a href="tel:${finalPhone}" style="color: #1456F0; text-decoration: none;">${finalPhone}</a></td>
                    </tr>
                    <tr>
                      <td class="label">Email Address</td>
                      <td class="value"><a href="mailto:${finalEmail}" style="color: #1456F0; text-decoration: none;">${finalEmail}</a></td>
                    </tr>
                    <tr>
                      <td class="label">Consultation Date & Slot</td>
                      <td class="value">${formattedConsultationDate}</td>
                    </tr>
                    <tr>
                      <td class="label">Target Allocation</td>
                      <td class="value"><span class="badge">${finalAllocation}</span></td>
                    </tr>
                    ${notes ? `
                    <tr>
                      <td class="label">Client Notes</td>
                      <td class="value">${notes}</td>
                    </tr>` : ''}
                    <tr>
                      <td class="label">Recorded In Database</td>
                      <td class="value" style="color: #64748b; font-size: 13px;">${timestamp}</td>
                    </tr>
                  </table>

                  <div class="action-box">
                    <p style="margin: 0 0 4px 0; font-weight: 800; color: #166534; font-size: 14px;">Advisory Desk Action:</p>
                    <p style="margin: 0; font-size: 13px; color: #15803d; line-height: 1.4;">
                      Please dispatch Google Meet calendar invite or contact the client on WhatsApp (${finalPhone}) to initiate digital onboarding.
                    </p>
                  </div>

                  <div style="text-align: center; margin-top: 24px;">
                    <a href="mailto:${finalEmail}?subject=Brewrich%20Wealth%20Consultation%20Confirmed%20-%20Ref%20%23${generatedBookingId}" class="btn">
                      Reply to Investor
                    </a>
                  </div>
                </div>
                <div class="footer">
                  Brewrich Wealth Management • AMFI Registered Mutual Fund Distributor<br/>
                  Confidential Database Record
                </div>
              </div>
            </body>
          </html>
        `;

        const { error: resendError } = await resend.emails.send({
          from: 'Brewrich Wealth <onboarding@resend.dev>',
          to: [adminEmail],
          replyTo: finalEmail,
          subject: `🔔 New 1-on-1 MFD Booking: ${finalName} (${finalAllocation})`,
          html: emailHtml,
        });

        if (resendError) {
          console.error('❌ [RESEND EMAIL FAILED]:', {
            name: resendError.name,
            message: resendError.message,
          });
        } else {
          emailDispatched = true;
          console.log('✅ [RESEND EMAIL DISPATCHED]: Sent notification to', adminEmail);
        }
      } catch (emailErr) {
        console.error('❌ [RESEND CLIENT ERROR]:', emailErr);
      }
    } else {
      console.warn('⚠️ [RESEND WARNING]: RESEND_API_KEY is not defined in environment.');
    }

    return NextResponse.json({
      success: true,
      bookingId: generatedBookingId,
      emailDispatched,
      message: 'Consultation successfully scheduled and recorded in database!',
    });

  } catch (err: any) {
    console.error('❌ [FATAL /api/book-mfd ERROR]:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error processing consultation request.' },
      { status: 500 }
    );
  }
}
