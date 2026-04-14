import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import fs from 'fs';
import path from 'path';
import { sendReport } from '../utils/sendReport';

class CustomReporter implements Reporter {
  private testMap = new Map<string, any>();

  private results = {
    project: 'Production - Silhouette America Automation',
    createdBy: 'Priti Kasar',
    date: new Date().toLocaleString(),

    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
    },

    tests: [] as any[],
  };

  onTestEnd(test: TestCase, result: TestResult) {
    const testId = test.titlePath().join(' > ');

    const testData: any = {
      name: test.title,
      status: result.status,
      duration: result.duration,
      retry: result.retry,
    };

    // ✅ Extract email
  const emailAttachment = result.attachments.find(
  att => att.name === 'registeredEmail'
);

    if (emailAttachment?.body) {
  testData.email = emailAttachment.body.toString();
} else {
  testData.email = '-';
}

    // ✅ Errors
    if (result.status === 'failed') {
      testData.error = result.error?.message || 'Unknown error';
    }

    if (result.status === 'skipped') {
      testData.skipReason = result.error?.message || 'Skipped';
    }

    // 🔥 Overwrite previous attempts (handles retries)
    this.testMap.set(testId, testData);
  }

  async onEnd() {
    const finalTests = Array.from(this.testMap.values());

    // ✅ Build summary
    const summary = {
      total: finalTests.length,
      passed: 0,
      failed: 0,
      skipped: 0,
    };

    for (const test of finalTests) {
      if (test.status === 'passed') summary.passed++;
      else if (test.status === 'failed') summary.failed++;
      else if (test.status === 'skipped') summary.skipped++;
    }

    this.results.summary = summary;
    this.results.tests = finalTests;

    // ✅ Ensure folder exists
    const reportDir = path.resolve('reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    // ✅ Write report
    const reportFile = path.join(reportDir, 'results.json');

    fs.writeFileSync(
      reportFile,
      JSON.stringify(this.results, null, 2)
    );

    console.log('📊 Advanced report generated at:', reportFile);

    // 📧 Send email
    console.log('📧 Sending report...');
    await sendReport();
  }
}

export default CustomReporter;