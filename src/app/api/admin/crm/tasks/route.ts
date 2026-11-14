import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { getAllCrmTasks, createCrmTask, toggleCrmTaskStatus } from '@/lib/crm-service';

async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get('pertap_jwt')?.value;
  if (!token) return null;
  const payload = await verifyJWT(token);
  if (!payload) return null;
  const isAdminEmail =
    payload.email === 'nibrasulhaqqamini@gmail.com' ||
    payload.email === 'tapfolio.in@gmail.com' ||
    (process.env.ADMIN_EMAIL && payload.email === process.env.ADMIN_EMAIL);
  if (!isAdminEmail) return null;
  return payload;
}

export async function GET(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const tasks = await getAllCrmTasks();
    return NextResponse.json({ success: true, tasks });
  } catch (error) {
    console.error('Failed to get CRM tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const body = await request.json();
    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const task = await createCrmTask({
      title: body.title,
      leadId: body.leadId,
      leadName: body.leadName,
      dueDate: body.dueDate || new Date(Date.now() + 86400000 * 2).toISOString(),
      assignedTo: body.assignedTo || 'Nibrasul Haqq',
      status: 'PENDING',
      priority: body.priority || 'MEDIUM',
    });

    return NextResponse.json({ success: true, task });
  } catch (error) {
    console.error('Failed to create CRM task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Task id is required' }, { status: 400 });
    }

    const updated = await toggleCrmTaskStatus(id);
    if (!updated) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, task: updated });
  } catch (error) {
    console.error('Failed to toggle task status:', error);
    return NextResponse.json({ error: 'Failed to toggle task' }, { status: 500 });
  }
}
