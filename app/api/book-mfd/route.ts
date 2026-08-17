import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@/lib/supabase/server';

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
    const finalDate = consultation_date || preferredDate || 'Earliest Available Slot';
    const finalTime = time_slot || preferredTime || '04:00 PM - 04:30 PM';
    const finalNotes = notes || '';

    // Validate required fields
    if (!finalName || !finalEmail || !finalPhone) {
      return NextResponse.json(
        { error: 'Client Name, Email Address, and Phone Number are required.' },
        { status: 400 }
      );
    }

    // 1. Insert into Supabase `mfd_bookings` table
    const supabase = await createClient();
    let generatedBookingId = `BK-${Date.now().toString(36).toUpperCase()}`;

    const { data: dbBooking, error: dbError } = await supabase
      .from('mfd_bookings')
      .insert({
        client_name: finalName,
        email: finalEmail,
        phone: finalPhone,
        target_allocation: finalAllocation,
        consultation_date: finalDate,
        time_slot: finalTime,
        notes: finalNotes || null,
      })
      .select('id, created_at')
      .maybeSingle();

    if (dbError) {
      console.error('Supabase mfd_bookings insert warning/error:', dbError);
      // Note: If table hasn't been created yet in SQL editor, we log the error
      // and proceed with sending email while using the generated ID reference.
    } else if (dbBooking?.id) {
      generatedBookingId = dbBooking.id;
    }

    // 2. Dispatch real HTML email notification via Resend
    const apiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL || 'support@brewrichwealth.com';
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    let emailDispatched = false;

    if (apiKey) {
      try {
        const resend = new Resend(apiKey);

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
                  <h1>New 1-on-1 Portfolio Booking</h1>
                </div>
                <div class="content">
                  <span class="alert-pill">⚡ Direct Consultation Lead</span>
                  <p style="font-size: 15px; line-height: 1.5; color: #334155; margin-top: 0;">
                    A prospective client has requested a 1-on-1 Mutual Fund Portfolio Review & Account Opening session.
                  </p>
                  
                  <table class="details-table">
                    <tr>
                      <td class="label">Booking Reference</td>
                      <td class="value"><code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 12px;">${generatedBookingId}</code></td>
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
                      <td class="label">Consultation Date</td>
                      <td class="value">${finalDate}</td>
                    </tr>
                    <tr>
                      <td class="label">Selected Time Slot</td>
                      <td class="value">${finalTime}</td>
                    </tr>
                    <tr>
                      <td class="label">Target Allocation</td>
                      <td class="value"><span class="badge">${finalAllocation}</span></td>
                    </tr>
                    ${finalNotes ? `
                    <tr>
                      <td class="label">Client Notes</td>
                      <td class="value">${finalNotes}</td>
                    </tr>` : ''}
                    <tr>
                      <td class="label">Submitted At</td>
                      <td class="value" style="color: #64748b; font-size: 13px;">${timestamp}</td>
                    </tr>
                  </table>

                  <div class="action-box">
                    <p style="margin: 0 0 4px 0; font-weight: 800; color: #166534; font-size: 14px;">Next Action:</p>
                    <p style="margin: 0; font-size: 13px; color: #15803d; line-height: 1.4;">
                      Please confirm calendar invite on Google Meet or reach out on WhatsApp (${finalPhone}) to initiate digital onboarding.
                    </p>
                  </div>

                  <div style="text-align: center; margin-top: 24px;">
                    <a href="mailto:${finalEmail}?subject=Brewrich%20Wealth%20Consultation%20Confirmed%20-%20Ref%20%23${generatedBookingId}" class="btn">
                      Contact Investor
                    </a>
                  </div>
                </div>
                <div class="footer">
                  Brewrich Wealth Management • AMFI Registered Mutual Fund Distributor<br/>
                  Confidential Client Record
                </div>
              </div>
            </body>
          </html>
        `;

        const { error: resendError } = await resend.emails.send({
          from: 'Brewrich Wealth <onboarding@resend.dev>',
          to: [adminEmail],
          replyTo: finalEmail,
          subject: `🔔 New 1-on-1 MFD Consultation: ${finalName} (${finalAllocation})`,
          html: emailHtml,
        });

        if (resendError) {
          console.error('Resend email delivery error:', resendError);
        } else {
          emailDispatched = true;
        }
      } catch (emailErr) {
        console.error('Error invoking Resend email client:', emailErr);
      }
    } else {
      console.warn('RESEND_API_KEY is not defined in environment.');
    }

    return NextResponse.json({
      success: true,
      bookingId: generatedBookingId,
      emailDispatched,
      message: 'Consultation successfully scheduled! Our wealth desk has received your details.',
    });

  } catch (err: any) {
    console.error('Fatal /api/book-mfd endpoint error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error processing consultation request.' },
      { status: 500 }
    );
  }
}
