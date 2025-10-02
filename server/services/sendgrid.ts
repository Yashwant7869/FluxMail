import { MailService } from '@sendgrid/mail';

let mailService: MailService | null = null;

if (process.env.SENDGRID_API_KEY) {
  mailService = new MailService();
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn("SENDGRID_API_KEY not found. Email sending will be simulated.");
}

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    if (!mailService) {
      console.log(`📧 [SIMULATED] Email to ${params.to}: ${params.subject}`);
      return true; // Simulate successful sending for development
    }
    
    console.log(`🚀 [SENDING] Attempting to send email to: ${params.to}`);
    console.log(`📧 [EMAIL DETAILS] From: ${params.from}, Subject: ${params.subject}`);
    
    const emailData: any = {
      to: params.to,
      from: params.from,
      subject: params.subject,
    };
    
    if (params.text) {
      emailData.text = params.text;
    }
    
    if (params.html) {
      emailData.html = params.html;
    }
    
    await mailService.send(emailData);
    console.log(`✅ [SUCCESS] Email sent successfully to: ${params.to}`);
    return true;
  } catch (error: any) {
    console.error(`❌ [SENDGRID ERROR] Failed to send email to ${params.to}:`, error);
    
    // Enhanced error logging
    if (error.response && error.response.body) {
      console.error(`📋 [ERROR DETAILS]`, JSON.stringify(error.response.body, null, 2));
    }
    
    return false;
  }
}

export async function sendBulkEmails(emails: EmailParams[]): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const email of emails) {
    const result = await sendEmail(email);
    if (result) {
      success++;
    } else {
      failed++;
    }
  }

  return { success, failed };
}
