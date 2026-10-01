const fs = require('fs');

let form = fs.readFileSync('src/app/register/_components/RegistrationForm.tsx', 'utf8');

form = form.replace(
  'programmingLangs: [],\n      cyberTopics: [],',
  'programmingLangs: [],\n      operatingSystems: [],\n      cyberTopics: [],'
);

form = form.replace(
  'agreedToNoGuarantee: false\n    }',
  'agreedToNoGuarantee: false,\n      ethicsAgreement: false,\n      termsAgreement: false\n    }'
);

fs.writeFileSync('src/app/register/_components/RegistrationForm.tsx', form);
