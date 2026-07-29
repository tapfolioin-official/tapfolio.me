import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    let jobs = await prisma.jobRequirement.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Auto-seed default jobs on first run if database is empty
    if (jobs.length === 0) {
      const defaultJobs = [
        { title: "Senior Full Stack Engineer (Next.js)", dept: "Engineering", loc: "Kochi, India / Remote", type: "Full-time" },
        { title: "NFC Mobile Developer (Flutter)", dept: "Engineering", loc: "Kochi, India / Hybrid", type: "Full-time" },
        { title: "Brand Strategist & Product Designer", dept: "Product & Design", loc: "Kochi, India / Hybrid", type: "Full-time" },
        { title: "Growth Marketing Specialist", dept: "Growth & Operations", loc: "Remote (Global)", type: "Contract" }
      ];

      await prisma.jobRequirement.createMany({
        data: defaultJobs,
      });

      jobs = await prisma.jobRequirement.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json({ success: true, jobs });
  } catch (error) {
    console.error('Failed to fetch dynamic job requirements:', error);
    return NextResponse.json({ success: false, error: 'Database connection failed' }, { status: 500 });
  }
}
