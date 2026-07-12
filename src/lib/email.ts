import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  html: string
}

function getTransporter() {
  const email = process.env.GMAIL_EMAIL
  const password = process.env.GMAIL_APP_PASSWORD

  if (!email || !password) {
    throw new Error('GMAIL_EMAIL and GMAIL_APP_PASSWORD are required.')
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email,
      pass: password,
    },
  })
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  const transporter = getTransporter()

  try {
    const info = await transporter.sendMail({
      from: process.env.GMAIL_EMAIL,
      to,
      subject,
      html,
    })

    console.log('Email sent successfully:', info.messageId)
    return info
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

export async function sendDailyReminder(
  email: string,
  name: string,
  todayTasks: Array<{ topic: string; subject: string; hours: number }>
) {
  const totalHours = todayTasks.reduce((sum, t) => sum + t.hours, 0)

  try {
    await sendEmail({
      to: email,
      subject: `Your Study Plan for Today — ${todayTasks.length} tasks`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
          <h1 style="color: #6366f1; font-size: 24px;">Good morning, ${name}! </h1>
          <p style="color: #374151;">Here's what you're studying today:</p>
          
          <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin: 16px 0;">
            ${todayTasks.map(t => `
              <div style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                <strong style="color: #111827;">${t.topic}</strong><br>
                <span style="color: #6b7280; font-size: 14px;">${t.subject} · ${t.hours}h</span>
              </div>
            `).join('')}
          </div>
          
          <p style="color: #374151;">
            <strong>Total today:</strong> ${totalHours} hours across ${todayTasks.length} topics
          </p>
          
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/study-plan" 
             style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">
            Open Study Plan →
          </a>
          
          <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
            You can disable these reminders in your dashboard settings.
          </p>
        </div>
      `
    })
  } catch (error) {
    console.error('Error sending daily reminder:', error)
    throw error
  }
}

export async function sendWeeklySummary(
  email: string,
  name: string,
  completedTasks: Array<{ topic: string; subject: string; hours: number; plan_date: string }>,
  upcomingTasks: Array<{ topic: string; subject: string; hours: number; plan_date: string }>,
  weekRange: string
) {
  const completedHours = completedTasks.reduce((sum, t) => sum + t.hours, 0)
  const upcomingHours = upcomingTasks.reduce((sum, t) => sum + t.hours, 0)

  try {
    await sendEmail({
      to: email,
      subject: `Weekly Study Summary — ${weekRange}`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
          <h1 style="color: #6366f1; font-size: 24px;">Weekly summary for ${name}</h1>
          <p style="color: #374151;">Here's what you accomplished last week and what's coming up next.</p>

          <div style="margin: 24px 0;">
            <div style="padding: 18px; background: #eef2ff; border-radius: 14px; margin-bottom: 16px;">
              <p style="margin: 0; color: #4f46e5; font-weight: 700;">Week</p>
              <p style="margin: 4px 0 0; color: #374151;">${weekRange}</p>
            </div>

            <div style="display: grid; gap: 12px;">
              <div style="background: #f8fafc; border-radius: 12px; padding: 16px; border: 1px solid #e2e8f0;">
                <p style="margin: 0 0 8px; font-weight: 700; color: #111827;">Completed this week</p>
                <p style="margin: 0; color: #475569;">${completedTasks.length} topics completed · ${completedHours} hours</p>
              </div>

              <div style="background: #f8fafc; border-radius: 12px; padding: 16px; border: 1px solid #e2e8f0;">
                <p style="margin: 0 0 8px; font-weight: 700; color: #111827;">Upcoming next week</p>
                <p style="margin: 0; color: #475569;">${upcomingTasks.length} topics planned · ${upcomingHours} hours</p>
              </div>
            </div>
          </div>

          <div style="background: #f3f4f6; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
            <p style="margin: 0 0 12px; font-weight: 700; color: #111827;">Completed topics</p>
            ${completedTasks.length > 0 ? completedTasks.map((t) => `
              <div style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                <strong style="color: #111827;">${t.topic}</strong><br>
                <span style="color: #6b7280; font-size: 14px;">${t.subject} · ${t.hours}h · ${t.plan_date}</span>
              </div>
            `).join('') : '<p style="margin: 0; color: #6b7280;">No topics completed last week.</p>'}
          </div>

          <div style="background: #f3f4f6; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
            <p style="margin: 0 0 12px; font-weight: 700; color: #111827;">Planned topics next week</p>
            ${upcomingTasks.length > 0 ? upcomingTasks.map((t) => `
              <div style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                <strong style="color: #111827;">${t.topic}</strong><br>
                <span style="color: #6b7280; font-size: 14px;">${t.subject} · ${t.hours}h · ${t.plan_date}</span>
              </div>
            `).join('') : '<p style="margin: 0; color: #6b7280;">No topics planned for next week yet.</p>'}
          </div>

          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
             style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
            View your dashboard →
          </a>

          <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
            Weekly summaries help keep your study plan on track. You can update your schedule in the app anytime.
          </p>
        </div>
      `
    })
  } catch (error) {
    console.error('Error sending weekly summary:', error)
    throw error
  }
}

export async function sendProgressSummary(
  email: string,
  name: string,
  completedTasks: Array<{ topic: string; subject: string; hours: number; plan_date: string }>,
  upcomingTasks: Array<{ topic: string; subject: string; hours: number; plan_date: string }>,
  summaryRange: string
) {
  const completedHours = completedTasks.reduce((sum, t) => sum + t.hours, 0)
  const upcomingHours = upcomingTasks.reduce((sum, t) => sum + t.hours, 0)

  try {
    await sendEmail({
      to: email,
      subject: `📊 Study Summary — ${summaryRange}`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
          <h1 style="color: #6366f1; font-size: 24px;">Progress summary for ${name}</h1>
          <p style="color: #374151;">Here's your study progress up to now, plus your next planned topics.</p>

          <div style="margin: 24px 0; display: grid; gap: 12px;">
            <div style="background: #f8fafc; border-radius: 12px; padding: 16px; border: 1px solid #e2e8f0;">
              <p style="margin: 0 0 8px; font-weight: 700; color: #111827;">Completed so far</p>
              <p style="margin: 0; color: #475569;">${completedTasks.length} topics completed · ${completedHours} hours</p>
            </div>
            <div style="background: #f8fafc; border-radius: 12px; padding: 16px; border: 1px solid #e2e8f0;">
              <p style="margin: 0 0 8px; font-weight: 700; color: #111827;">Upcoming topics</p>
              <p style="margin: 0; color: #475569;">${upcomingTasks.length} topics planned · ${upcomingHours} hours</p>
            </div>
          </div>

          <div style="background: #f3f4f6; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
            <p style="margin: 0 0 12px; font-weight: 700; color: #111827;">Completed tasks</p>
            ${completedTasks.length > 0 ? completedTasks.map((t) => `
              <div style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                <strong style="color: #111827;">${t.topic}</strong><br>
                <span style="color: #6b7280; font-size: 14px;">${t.subject} · ${t.hours}h · ${t.plan_date}</span>
              </div>
            `).join('') : '<p style="margin: 0; color: #6b7280;">No completed tasks yet.</p>'}
          </div>

          <div style="background: #f3f4f6; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
            <p style="margin: 0 0 12px; font-weight: 700; color: #111827;">Upcoming tasks</p>
            ${upcomingTasks.length > 0 ? upcomingTasks.map((t) => `
              <div style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                <strong style="color: #111827;">${t.topic}</strong><br>
                <span style="color: #6b7280; font-size: 14px;">${t.subject} · ${t.hours}h · ${t.plan_date}</span>
              </div>
            `).join('') : '<p style="margin: 0; color: #6b7280;">No upcoming topics planned yet.</p>'}
          </div>

          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
             style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
            Open your dashboard →
          </a>

          <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
            You can always adjust your study plan in the app for the next week.
          </p>
        </div>
      `
    })
  } catch (error) {
    console.error('Error sending progress summary:', error)
    throw error
  }
}
