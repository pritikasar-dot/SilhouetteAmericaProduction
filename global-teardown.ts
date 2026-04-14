import { sendReport } from './utils/sendReport';

async function globalTeardown() {
  console.log('📧 Sending report...');
  await sendReport();
}

export default globalTeardown;