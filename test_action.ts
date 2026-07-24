import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function run() {
  const { getPublicDepartmentBySlug } = await import('./src/app/actions/department');
  console.log("Calling getPublicDepartmentBySlug...");
  const res = await getPublicDepartmentBySlug('computer-science');
  console.log(JSON.stringify(res, null, 2));
}

run().catch(console.error);
