import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, fullName, name, email, phone, phone_number, resource_requested, source } = body;

    const finalName = (full_name || fullName || name || '').trim();
    const finalEmail = (email || '').trim().toLowerCase();
    const finalPhone = (phone || phone_number || '').trim();
    const finalResource = resource_requested || 'MIIP Free Study Books Pack (Risk Guide & Chart Patterns)';
    const finalSource = source || 'miip_free_resources_wall';

    // Validate required fields
    if (!finalName || !finalEmail || !finalPhone) {
      return NextResponse.json(
        { error: 'Full Name, Email Address, and Phone Number are required.' },
        { status: 400 }
      );
    }

    // 1. Initialize Supabase Client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cplgtebmbplroctuqmyz.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let dbInserted = false;
    let leadId = null;

    if (supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false },
      });

      // Insert into `lead_captures` table
      const { data: dbData, error: dbError } = await supabase
        .from('lead_captures')
        .insert({
          full_name: finalName,
          email: finalEmail,
          phone: finalPhone,
          resource_requested: finalResource,
          source: finalSource,
        })
        .select('id')
        .single();

      if (dbError) {
        console.warn('⚠️ [SUPABASE lead_captures NOTE]:', dbError.message);
        // Attempt insert into fallback leads table or ignore if schema pending
      } else if (dbData) {
        dbInserted = true;
        leadId = dbData.id;
      }
    }

    // 2. Dispatch Email Alert via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL || 'support@brewrichwealth.com';
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);

        const emailHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a; margin: 0; padding: 24px; color: #f8fafc; }
                .card { max-width: 580px; margin: 0 auto; background: #1e293b; border-radius: 20px; border: 1px solid #334155; overflow: hidden; }
                .header { background: linear-gradient(135deg, #0A358F 0%, #1456F0 100%); padding: 28px 24px; text-align: center; color: #ffffff; }
                .header h1 { margin: 0 0 6px 0; font-size: 20px; font-weight: 800; }
                .content { padding: 28px 24px; color: #e2e8f0; }
                .pill { display: inline-block; background: #3b82f6; color: #ffffff; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; margin-bottom: 16px; }
                .details-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                .details-table td { padding: 10px 12px; font-size: 14px; border-bottom: 1px solid #334155; }
                .details-table td.label { width: 35%; font-weight: 600; color: #94a3b8; }
                .details-table td.value { font-weight: 700; color: #ffffff; }
                .footer { padding: 16px 24px; background: #0f172a; border-top: 1px solid #334155; text-align: center; font-size: 12px; color: #64748b; }
              </style>
            </head>
            <body>
              <div class="card">
                <div class="header">
                  <h1>📚 New Free Study Materials Lead</h1>
                  <p style="margin:0; font-size:12px; opacity:0.9;">Brewrich MIIP Lead Capture Wall</p>
                </div>
                <div class="content">
                  <span class="pill">⚡ New Download Lead</span>
                  <table class="details-table">
                    <tr>
                      <td class="label">Lead Name</td>
                      <td class="value">${finalName}</td>
                    </tr>
                    <tr>
                      <td class="label">Email Address</td>
                      <td class="value"><a href="mailto:${finalEmail}" style="color: #60a5fa; text-decoration: none;">${finalEmail}</a></td>
                    </tr>
                    <tr>
                      <td class="label">Phone / WhatsApp</td>
                      <td class="value"><a href="tel:${finalPhone}" style="color: #34d399; text-decoration: none;">${finalPhone}</a></td>
                    </tr>
                    <tr>
                      <td class="label">Resource Requested</td>
                      <td class="value">${finalResource}</td>
                    </tr>
                    <tr>
                      <td class="label">Captured On</td>
                      <td class="value">${timestamp}</td>
                    </tr>
                  </table>
                </div>
                <div class="footer">
                  Brewrich Wealth Management • Lead Capture Automation
                </div>
              </div>
            </body>
          </html>
        `;

        await resend.emails.send({
          from: 'Brewrich Wealth <onboarding@resend.dev>',
          to: [adminEmail],
          replyTo: finalEmail,
          subject: `📚 New Free Study Pack Lead: ${finalName} (${finalPhone})`,
          html: emailHtml,
        });
      } catch (emailErr) {
        console.warn('⚠️ [RESEND LEAD ALERT NOTE]:', emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      leadId,
      dbInserted,
      message: 'Lead captured successfully. Free study materials unlocked.',
    });
  } catch (err: any) {
    console.error('❌ [/api/lead-capture ERROR]:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error processing lead capture.' },
      { status: 500 }
    );
  }
}
