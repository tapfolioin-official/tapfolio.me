import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      first_name,
      last_name,
      email,
      phone,
      address,
      headline,
      photo_or_profile_url,
      resume_link,
      summary,
      education,
      experience,
      cover_letter,
      job_title,
      department,
      location,
      access_key // Fallback in case of manual test keys
    } = body;

    if (!first_name || !last_name || !email || !resume_link || !job_title) {
      return NextResponse.json({ success: false, message: 'Missing required fields (First Name, Last Name, Email, Resume Link, or Job Title)' }, { status: 400 });
    }

    // 1. Save submission to PostgreSQL database
    const application = await prisma.jobApplication.create({
      data: {
        jobTitle: job_title,
        firstName: first_name,
        lastName: last_name,
        email,
        phone,
        address,
        headline,
        photoUrl: photo_or_profile_url,
        resumeLink: resume_link,
        summary,
        education,
        experience,
        coverLetter: cover_letter,
      },
    });

    // 2. Forward to Web3Forms server-to-server
    const envKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || process.env.WEB3FORMS_ACCESS_KEY;
    const finalAccessKey = access_key || envKey;

    if (finalAccessKey) {
      try {
        const web3Response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: finalAccessKey,
            subject: `New Job Application: ${job_title} - ${first_name} ${last_name}`,
            from_name: "Tapfolio Careers",
            job_title,
            department,
            location,
            first_name,
            last_name,
            email,
            phone,
            address,
            headline,
            photo_or_profile_url,
            resume_link,
            summary,
            education,
            experience,
            cover_letter,
          }),
        });

        const web3Data = await web3Response.json();
        if (!web3Data.success) {
          console.warn("Web3Forms endpoint warning:", web3Data.message);
        }
      } catch (web3Err) {
        console.error("Web3Forms forward network error:", web3Err);
      }
    } else {
      console.warn("Web3Forms forwarding skipped: No access key configured on server.");
    }

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error('Careers application submission error:', error);
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Server error processing job application' }, { status: 500 });
  }
}
