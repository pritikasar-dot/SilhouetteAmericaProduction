import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import archiver from 'archiver'; // ✅ FIXED import

dotenv.config();

export async function sendReport() {
  try {
    const resultsPath = path.resolve('reports/results.json');
    const reportFolder = path.resolve('playwright-report');
    const zipPath = path.resolve('playwright-report.zip');

    if (!fs.existsSync(resultsPath)) {
      console.log('❌ results.json not found');
      return;
    }

    const results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));

    const { project, createdBy, date, summary, tests } = results;
    const { total, passed, failed, skipped } = summary;

    // ⏱ Total Execution Time
    const totalDuration = tests.reduce(
      (sum: number, t: any) => sum + (t.duration || 0),
      0
    );
    const totalTime = (totalDuration / 1000).toFixed(2);

    // 🎨 Status Badge
    const getStatusBadge = (status: string) => {
      if (status === 'passed')
        return `<span style="background:#28a745;color:white;padding:4px 8px;border-radius:5px;">PASSED</span>`;
      if (status === 'failed')
        return `<span style="background:#dc3545;color:white;padding:4px 8px;border-radius:5px;">FAILED</span>`;
      return `<span style="background:#ffc107;color:black;padding:4px 8px;border-radius:5px;">SKIPPED</span>`;
    };

    // 🧾 Trim long errors
    const formatError = (err: string) => {
      if (!err) return '-';
      return err.length > 120 ? err.substring(0, 120) + '...' : err;
    };

    // 🧪 Test Rows
    const testRows = tests.map((t: any) => `
      <tr>
        <td>${getStatusBadge(t.status)}</td>
        <td>${t.name}</td>
        <td style="color:#007bff;font-weight:bold;">${t.email || '-'}</td>
        <td>${((t.duration || 0) / 1000).toFixed(2)}s</td>
        <td style="color:red;font-weight:bold;">
          ${t.status === 'failed' ? formatError(t.error) : '-'}
        </td>
      </tr>
    `).join('');

    // 🎯 Overall Status
    const overallStatus =
      failed > 0
        ? `<span style="color:#dc3545;font-weight:bold;">❌ ISSUES FOUND</span>`
        : `<span style="color:#28a745;font-weight:bold;">🟢 ALL CLEAR</span>`;

    // 📊 Chart
    const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify({
      type: 'pie',
      data: {
        labels: ['Passed', 'Failed', 'Skipped'],
        datasets: [{
          data: [passed, failed, skipped]
        }]
      }
    }))}`;

    // 📧 HTML
    const html = `
    <div style="font-family:Arial;padding:20px;background:#f4f6f8;">
      <div style="background:white;padding:25px;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">

        <h2>🚀 ${project}</h2>
        <p style="color:#555;">Automation Execution Report</p>

        <hr/>

        <p>
          Hi Team,<br/><br/>
          Please find today's automation execution summary.
        </p>

        <h3>📊 Summary</h3>
        <p><b>Created By:</b> ${createdBy}</p>
        <p><b>Date:</b> ${date}</p>
        <p><b>Status:</b> ${overallStatus}</p>
        <p><b>Total Execution Time:</b> ${totalTime} seconds</p>

        <br/>

        <table border="1" style="border-collapse:collapse;width:60%;text-align:center;">
          <tr style="background:#eee;">
            <th>Total</th>
            <th style="color:#28a745;">Passed</th>
            <th style="color:#dc3545;">Failed</th>
            <th style="color:#ffc107;">Skipped</th>
          </tr>
          <tr>
            <td>${total}</td>
            <td style="color:#28a745;font-weight:bold;">${passed}</td>
            <td style="color:#dc3545;font-weight:bold;">${failed}</td>
            <td style="color:#ffc107;font-weight:bold;">${skipped}</td>
          </tr>
        </table>

        <br/>

        <h3>📈 Execution Chart</h3>
        <img src="${chartUrl}" width="300"/>

        <br/><br/>

        <h3>🧪 Test Details</h3>
        <table border="1" style="border-collapse:collapse;width:100%;">
          <tr style="background:#eee;">
            <th>Status</th>
            <th>Test Name</th>
            <th>Email</th>
            <th>Duration</th>
            <th>Issue</th>
          </tr>
          ${testRows}
        </table>

        <br/>

        <p>📎 Full report attached (ZIP)</p>

      </div>
    </div>
    `;

    // 📦 Zip Playwright Report
    if (fs.existsSync(reportFolder)) {
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip');

      archive.pipe(output);
      archive.directory(reportFolder, false);
      await archive.finalize();
    }

    // 📧 Mail Config
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 📤 Send Email
    await transporter.sendMail({
      from: `"Automation Report" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,

      // ✅ UPDATED SUBJECT
      subject: `Silhouette America - Production Regression Test Report`,

      html,

      attachments: fs.existsSync(zipPath)
        ? [{ filename: 'Playwright-Report.zip', path: zipPath }]
        : [],
    });

    console.log('✅ Report email sent successfully');

  } catch (error) {
    console.error('❌ Email sending failed:', error);
  }
}