import { sendSelectionEmail } from "./src/lib/services/email";

async function runTest() {
  console.log("Starting email mock test...");
  const result = await sendSelectionEmail("test@example.com", "Test Student", "BJMCS-2026-TEST");
  console.log("Email Result:", result);
}
runTest();
