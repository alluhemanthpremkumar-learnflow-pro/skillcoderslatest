 export interface QuizQuestion {
   id: number;
   question: string;
   options: string[];
   correctAnswer: number;
   domain: string;
   difficulty: 'easy' | 'medium' | 'hard';
 }
 
 export const quizDomains = [
   { id: 1, name: 'Web Security', icon: '🌐', questions: 1500 },
   { id: 2, name: 'Network Security', icon: '🔗', questions: 1200 },
   { id: 3, name: 'Cryptography', icon: '🔐', questions: 800 },
   { id: 4, name: 'Malware Analysis', icon: '🦠', questions: 600 },
   { id: 5, name: 'Forensics', icon: '🔍', questions: 900 },
   { id: 6, name: 'Reverse Engineering', icon: '⚙️', questions: 700 },
   { id: 7, name: 'Frontend Development', icon: '🎨', questions: 1000 },
   { id: 8, name: 'Backend Development', icon: '🖥️', questions: 1200 },
   { id: 9, name: 'DevOps & Cloud', icon: '☁️', questions: 800 },
 ];
 
 export const sampleQuestions: QuizQuestion[] = [
   // Web Security
   {
     id: 1,
     question: 'What does XSS stand for?',
     options: ['Cross-Site Scripting', 'Cross-Server Security', 'XML Security Standard', 'Xtreme Security System'],
     correctAnswer: 0,
     domain: 'Web Security',
     difficulty: 'easy',
   },
   {
     id: 2,
     question: 'Which HTTP header helps prevent XSS attacks?',
     options: ['X-Frame-Options', 'Content-Security-Policy', 'X-Powered-By', 'Cache-Control'],
     correctAnswer: 1,
     domain: 'Web Security',
     difficulty: 'medium',
   },
   {
     id: 3,
     question: 'SQL Injection attacks can be prevented by:',
     options: ['Using strong passwords', 'Parameterized queries', 'HTTPS encryption', 'Disabling JavaScript'],
     correctAnswer: 1,
     domain: 'Web Security',
     difficulty: 'easy',
   },
   {
     id: 4,
     question: 'CSRF stands for:',
     options: ['Cross-Site Request Forgery', 'Client Server Request Format', 'Cookie Security Request Feature', 'Cross-Script Resource Filtering'],
     correctAnswer: 0,
     domain: 'Web Security',
     difficulty: 'easy',
   },
   {
     id: 5,
     question: 'Which is NOT a type of SQL injection?',
     options: ['Union-based', 'Boolean-based', 'Time-based', 'Cookie-based'],
     correctAnswer: 3,
     domain: 'Web Security',
     difficulty: 'medium',
   },
 
   // Frontend Development
   {
     id: 6,
     question: 'What does JSX stand for?',
     options: ['JavaScript XML', 'Java Syntax Extension', 'JSON Extra', 'JavaScript Express'],
     correctAnswer: 0,
     domain: 'Frontend Development',
     difficulty: 'easy',
   },
   {
     id: 7,
     question: 'Which hook is used for side effects in React?',
     options: ['useState', 'useEffect', 'useContext', 'useReducer'],
     correctAnswer: 1,
     domain: 'Frontend Development',
     difficulty: 'easy',
   },
   {
     id: 8,
     question: 'CSS Flexbox property for main axis alignment:',
     options: ['align-items', 'justify-content', 'flex-direction', 'align-self'],
     correctAnswer: 1,
     domain: 'Frontend Development',
     difficulty: 'easy',
   },
   {
     id: 9,
     question: 'What is the virtual DOM in React?',
     options: ['A copy of the browser DOM', 'A server-side DOM', 'A database structure', 'A CSS framework'],
     correctAnswer: 0,
     domain: 'Frontend Development',
     difficulty: 'medium',
   },
   {
     id: 10,
     question: 'Which is NOT a valid React lifecycle method?',
     options: ['componentDidMount', 'componentWillUpdate', 'componentDidCatch', 'componentWillReceive'],
     correctAnswer: 3,
     domain: 'Frontend Development',
     difficulty: 'medium',
   },
 
   // Backend Development
   {
     id: 11,
     question: 'REST stands for:',
     options: ['Representational State Transfer', 'Remote Execution Service Technology', 'Request Server Transfer', 'Resource State Transmission'],
     correctAnswer: 0,
     domain: 'Backend Development',
     difficulty: 'easy',
   },
   {
     id: 12,
     question: 'Which HTTP method is idempotent?',
     options: ['POST', 'PUT', 'CONNECT', 'PATCH'],
     correctAnswer: 1,
     domain: 'Backend Development',
     difficulty: 'medium',
   },
   {
     id: 13,
     question: 'What does ORM stand for?',
     options: ['Object Relational Mapping', 'Online Resource Manager', 'Open Request Method', 'Object Request Model'],
     correctAnswer: 0,
     domain: 'Backend Development',
     difficulty: 'easy',
   },
   {
     id: 14,
     question: 'Which is a NoSQL database?',
     options: ['PostgreSQL', 'MySQL', 'MongoDB', 'Oracle'],
     correctAnswer: 2,
     domain: 'Backend Development',
     difficulty: 'easy',
   },
   {
     id: 15,
     question: 'JWT stands for:',
     options: ['JSON Web Token', 'Java Web Transfer', 'JavaScript Web Tool', 'JSON Wrapper Type'],
     correctAnswer: 0,
     domain: 'Backend Development',
     difficulty: 'easy',
   },
 
   // Network Security
   {
     id: 16,
     question: 'What port does HTTPS use by default?',
     options: ['80', '443', '8080', '22'],
     correctAnswer: 1,
     domain: 'Network Security',
     difficulty: 'easy',
   },
   {
     id: 17,
     question: 'What does VPN stand for?',
     options: ['Virtual Private Network', 'Very Protected Network', 'Virtual Protocol Node', 'Verified Private Node'],
     correctAnswer: 0,
     domain: 'Network Security',
     difficulty: 'easy',
   },
   {
     id: 18,
     question: 'Which protocol is used for secure email?',
     options: ['SMTP', 'POP3', 'SMTPS/TLS', 'HTTP'],
     correctAnswer: 2,
     domain: 'Network Security',
     difficulty: 'medium',
   },
   {
     id: 19,
     question: 'A firewall operates at which OSI layer?',
     options: ['Only Layer 3', 'Only Layer 4', 'Layers 3 and 4', 'All layers'],
     correctAnswer: 2,
     domain: 'Network Security',
     difficulty: 'medium',
   },
   {
     id: 20,
     question: 'What is a DMZ in networking?',
     options: ['Demilitarized Zone', 'Data Management Zone', 'Direct Message Zone', 'Dynamic Memory Zone'],
     correctAnswer: 0,
     domain: 'Network Security',
     difficulty: 'easy',
   },
 
   // Cryptography
   {
     id: 21,
     question: 'AES stands for:',
     options: ['Advanced Encryption Standard', 'Automatic Encryption System', 'Applied Encryption Security', 'Advanced Electronic Security'],
     correctAnswer: 0,
     domain: 'Cryptography',
     difficulty: 'easy',
   },
   {
     id: 22,
     question: 'Which is an asymmetric encryption algorithm?',
     options: ['AES', 'DES', 'RSA', 'Blowfish'],
     correctAnswer: 2,
     domain: 'Cryptography',
     difficulty: 'easy',
   },
   {
     id: 23,
     question: 'What is a hash function property?',
     options: ['Reversible', 'Deterministic', 'Variable output', 'Key-dependent'],
     correctAnswer: 1,
     domain: 'Cryptography',
     difficulty: 'medium',
   },
   {
     id: 24,
     question: 'SHA-256 produces a hash of how many bits?',
     options: ['128', '256', '512', '1024'],
     correctAnswer: 1,
     domain: 'Cryptography',
     difficulty: 'easy',
   },
   {
     id: 25,
     question: 'What does PKI stand for?',
     options: ['Public Key Infrastructure', 'Private Key Integration', 'Protocol Key Interchange', 'Protected Key Index'],
     correctAnswer: 0,
     domain: 'Cryptography',
     difficulty: 'easy',
   },
 
   // DevOps & Cloud
   {
     id: 26,
     question: 'What does CI/CD stand for?',
     options: ['Continuous Integration/Continuous Deployment', 'Code Integration/Code Delivery', 'Central Infrastructure/Cloud Deployment', 'Continuous Infrastructure/Container Deployment'],
     correctAnswer: 0,
     domain: 'DevOps & Cloud',
     difficulty: 'easy',
   },
   {
     id: 27,
     question: 'Docker containers share which resource?',
     options: ['RAM', 'OS Kernel', 'CPU', 'Disk space'],
     correctAnswer: 1,
     domain: 'DevOps & Cloud',
     difficulty: 'medium',
   },
   {
     id: 28,
     question: 'Kubernetes is used for:',
     options: ['Database management', 'Container orchestration', 'Network monitoring', 'Code compilation'],
     correctAnswer: 1,
     domain: 'DevOps & Cloud',
     difficulty: 'easy',
   },
   {
     id: 29,
     question: 'What is Infrastructure as Code (IaC)?',
     options: ['Writing code in infrastructure', 'Managing infrastructure through code', 'Converting code to infrastructure', 'Debugging infrastructure code'],
     correctAnswer: 1,
     domain: 'DevOps & Cloud',
     difficulty: 'easy',
   },
   {
     id: 30,
     question: 'Which is NOT a cloud service model?',
     options: ['IaaS', 'PaaS', 'SaaS', 'DaaS'],
     correctAnswer: 3,
     domain: 'DevOps & Cloud',
     difficulty: 'medium',
   },

   // Malware Analysis
   {
     id: 31,
     question: 'What does APT stand for?',
     options: ['Advanced Persistent Threat', 'Automated Penetration Test', 'Advanced Protocol Transfer', 'Active Port Tracking'],
     correctAnswer: 0,
     domain: 'Malware Analysis',
     difficulty: 'easy',
   },
   {
     id: 32,
     question: 'A rootkit typically operates at which privilege level?',
     options: ['User mode', 'Kernel mode', 'BIOS mode', 'Ring 1'],
     correctAnswer: 1,
     domain: 'Malware Analysis',
     difficulty: 'medium',
   },
   {
     id: 33,
     question: 'Which tool is used for static malware analysis?',
     options: ['IDA Pro', 'Wireshark', 'Metasploit', 'Burp Suite'],
     correctAnswer: 0,
     domain: 'Malware Analysis',
     difficulty: 'easy',
   },
   {
     id: 34,
     question: 'What is a polymorphic virus?',
     options: ['A virus that infects multiple files', 'A virus that changes its code each time', 'A virus that uses multiple protocols', 'A virus that attacks polygon structures'],
     correctAnswer: 1,
     domain: 'Malware Analysis',
     difficulty: 'medium',
   },
   {
     id: 35,
     question: 'Sandbox analysis is useful for:',
     options: ['Compressing files', 'Executing malware safely in isolation', 'Creating backups', 'Network routing'],
     correctAnswer: 1,
     domain: 'Malware Analysis',
     difficulty: 'easy',
   },

   // Forensics
   {
     id: 36,
     question: 'Chain of Custody in digital forensics refers to:',
     options: ['The path malware took', 'Documentation of evidence handling', 'A series of court cases', 'The order of file deletion'],
     correctAnswer: 1,
     domain: 'Forensics',
     difficulty: 'easy',
   },
   {
     id: 37,
     question: 'What does RAID mean in forensic recovery?',
     options: ['Random Access Internet Data', 'Redundant Array of Independent Disks', 'Rapid Analysis and Investigation Database', 'Reconfigurable Adaptive Internet Drive'],
     correctAnswer: 1,
     domain: 'Forensics',
     difficulty: 'medium',
   },
   {
     id: 38,
     question: 'Deleted files can still be recovered because:',
     options: ['They are not actually deleted', 'Windows keeps backups', 'The data remains on disk until overwritten', 'Cloud services retain them'],
     correctAnswer: 2,
     domain: 'Forensics',
     difficulty: 'easy',
   },
   {
     id: 39,
     question: 'Which tool is commonly used for memory forensics?',
     options: ['Volatility', 'Volatage', 'Volume', 'Velocity'],
     correctAnswer: 0,
     domain: 'Forensics',
     difficulty: 'medium',
   },
   {
     id: 40,
     question: 'File carving is used to:',
     options: ['Artistically reshape files', 'Recover files without file system information', 'Create file backups', 'Organize directory structures'],
     correctAnswer: 1,
     domain: 'Forensics',
     difficulty: 'medium',
   },

   // Reverse Engineering
   {
     id: 41,
     question: 'What is the purpose of a debugger in reverse engineering?',
     options: ['To fix bugs', 'To observe and control program execution', 'To format code', 'To remove malware'],
     correctAnswer: 1,
     domain: 'Reverse Engineering',
     difficulty: 'easy',
   },
   {
     id: 42,
     question: 'Code obfuscation is primarily used to:',
     options: ['Improve performance', 'Make code harder to understand', 'Fix security vulnerabilities', 'Optimize memory usage'],
     correctAnswer: 1,
     domain: 'Reverse Engineering',
     difficulty: 'easy',
   },
   {
     id: 43,
     question: 'What is a breakpoint in debugging?',
     options: ['A syntax error', 'A point where program execution pauses', 'A network connection break', 'A compiler warning'],
     correctAnswer: 1,
     domain: 'Reverse Engineering',
     difficulty: 'easy',
   },
   {
     id: 44,
     question: 'Decompilers are used to convert:',
     options: ['Source code to binary', 'Binary to source code', 'Assembly to machine code', 'Source code to assembly'],
     correctAnswer: 1,
     domain: 'Reverse Engineering',
     difficulty: 'medium',
   },
   {
     id: 45,
     question: 'What does API hooking allow an attacker to do?',
     options: ['Intercept and modify function calls', 'Create new APIs', 'Delete system files', 'Change network protocols'],
     correctAnswer: 0,
     domain: 'Reverse Engineering',
     difficulty: 'medium',
   },

   // Additional Web Security Questions
   {
     id: 46,
     question: 'What is the SOP (Same-Origin Policy)?',
     options: ['A file storage protocol', 'A security concept restricting scripts to their origin', 'A database synchronization method', 'A network routing algorithm'],
     correctAnswer: 1,
     domain: 'Web Security',
     difficulty: 'medium',
   },
   {
     id: 47,
     question: 'CORS stands for:',
     options: ['Cross-Origin Request Security', 'Cross-Origin Resource Sharing', 'Central Origin Routing System', 'Coordinated Origin Request Standard'],
     correctAnswer: 1,
     domain: 'Web Security',
     difficulty: 'medium',
   },
   {
     id: 48,
     question: 'What is a clickjacking attack?',
     options: ['A DDoS attack', 'An attack where users unknowingly click malicious links', 'A brute force attack', 'A protocol vulnerability'],
     correctAnswer: 1,
     domain: 'Web Security',
     difficulty: 'hard',
   },
   {
     id: 49,
     question: 'HTTP Strict Transport Security (HSTS) ensures:',
     options: ['Strong password requirements', 'All connections use HTTPS', 'User data encryption', 'Firewall protection'],
     correctAnswer: 1,
     domain: 'Web Security',
     difficulty: 'medium',
   },
   {
     id: 50,
     question: 'A man-in-the-middle (MITM) attack can be prevented by:',
     options: ['Using HTTP', 'Using end-to-end encryption', 'Sharing passwords', 'Disabling firewalls'],
     correctAnswer: 1,
     domain: 'Web Security',
     difficulty: 'hard',
   },
 ];
 
 export const getLevelQuestions = (level: number): number => {
   if (level <= 5) return 10 + level * 10;
   if (level <= 50) return 100;
   return 100 + (level - 50) * 200;
 };
 
 export const getLevelCredits = (level: number): number => {
   return level * 50;
 };