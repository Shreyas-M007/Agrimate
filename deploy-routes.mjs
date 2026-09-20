import { execSync } from 'child_process';

const aws = '"C:\\Users\\shrey\\AppData\\Local\\Programs\\Amazon\\AWSCLIV2\\aws.exe"';
const routes = ['dashboard', 'about', 'services', 'crops', 'dispatch', 'contact'];

for (const r of routes) {
  console.log(`Uploading ${r}...`);
  execSync(`${aws} s3 cp client/dist/index.html s3://agrimate-web-647782045916-apsouth1/${r} --content-type text/html --profile Shreyas`, { stdio: 'inherit' });
  execSync(`${aws} s3 cp client/dist/index.html s3://agrimate-web-647782045916-apsouth1/${r}.html --content-type text/html --profile Shreyas`, { stdio: 'inherit' });
}
console.log('All SPA routes uploaded successfully to S3!');
