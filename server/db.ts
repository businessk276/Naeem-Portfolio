import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import {
  PortfolioData,
  Profile,
  SocialLink,
  Skill,
  Service,
  Project,
  Experience,
  Education,
  Certification,
  Award,
  Activity,
  ProcessStep,
  Testimonial,
  YouTubeVideo,
  Hobby,
  ContactMessage,
  SiteSettings,
  User,
} from '../src/types.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const FIRESTORE_DOCUMENT = 'portfolio/main';

dotenv.config();

export interface DatabaseSchema {
  users: (User & { password_hash: string })[];
  profile: Profile;
  social_links: SocialLink[];
  skills: Skill[];
  services: Service[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  awards: Award[];
  activities: Activity[];
  process_steps: ProcessStep[];
  testimonials: Testimonial[];
  youtube_videos: YouTubeVideo[];
  hobbies: Hobby[];
  contact_messages: ContactMessage[];
  site_settings: SiteSettings;
}

const defaultDatabase: DatabaseSchema = {
  users: [
    {
      id: 'usr_admin_1',
      email: 'Jidny7080@gmail.com',
      name: 'Md. Jobaer',
      role: 'admin',
      // bcrypt hash for 'admin12345'
      password_hash: bcrypt.hashSync('admin12345', 10),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  profile: {
    id: 'prof_1',
    name: 'MD. JOBAER',
    professional_title: 'IT SUPPORT ENGINEER',
    supporting_line: 'IT Support • Web Development • Networking • Digital Marketing',
    short_intro:
      'Dedicated and skilled IT Support Engineer with expertise in computer troubleshooting, network system support, office management, digital marketing, client hunting and lead generation.',
    about_description:
      'Motivated and dedicated Computer Engineer with a passion for technical innovation and problem solving. Experienced in comprehensive PC hardware/software diagnostics, enterprise network configuration (Cisco), web development (HTML, CSS, JavaScript), digital marketing, and CCTV surveillance systems. Currently based in Riyadh, Saudi Arabia with a valid 9-month transferable Iqama, ready to drive organizational IT stability and efficiency.',
    location: 'Al Aziziyah, Riyadh, Saudi Arabia (KSA)',
    phone: '0538196763',
    email: 'Jidny7080@gmail.com',
    profile_image: '/uploads/ChatGPT_Image_Sep_21__2026__05_01_46_PM_png_1790006862798.png',
    logo_text: 'MJ',
    availability_status: 'AVAILABLE FOR WORK / PROJECTS',
    iqama_status: 'Transferable Iqama (9 Month Valid)',
    resume_url: '',
    updated_at: new Date().toISOString(),
  },
  social_links: [
    {
      id: 'soc_1',
      platform: 'LinkedIn',
      url: 'https://www.linkedin.com/in/md-jobaer-ahamed-82a382186',
      icon: 'linkedin',
      is_active: true,
      sort_order: 1,
    },
    {
      id: 'soc_2',
      platform: 'YouTube',
      url: 'https://www.youtube.com/@user-ed1sz1sx4i',
      icon: 'youtube',
      is_active: true,
      sort_order: 2,
    },
  ],
  services: [
    {
      id: 'srv_1',
      code: '01',
      title: 'IT SUPPORT & REPAIR',
      subtitle: 'Hardware & OS Diagnostics',
      description:
        'Comprehensive PC and laptop motherboard troubleshooting, component replacements, operating system setup, server maintenance, and proactive hardware tune-ups.',
      tags: ['Hardware Repair', 'OS Deployment', 'Server Maintenance', 'Troubleshooting'],
      icon: 'Cpu',
      is_active: true,
      sort_order: 1,
    },
    {
      id: 'srv_2',
      code: '02',
      title: 'NETWORKING & CISCO',
      subtitle: 'Enterprise Infrastructure',
      description:
        'Network system design, Cisco router and switch configurations, VLAN segmentation, DHCP/DNS services, Packet Tracer simulations, and connectivity debugging.',
      tags: ['Cisco Packet Tracer', 'VLANs', 'Routers & Switches', 'LAN Infrastructure'],
      icon: 'Network',
      is_active: true,
      sort_order: 2,
    },
    {
      id: 'srv_3',
      code: '03',
      title: 'WEB DEVELOPMENT',
      subtitle: 'Frontend & Backend Solutions',
      description:
        'Responsive, fast-loading web applications built with HTML, CSS, JavaScript, and modern web architectures. Clean interface design and database integration.',
      tags: ['HTML5', 'CSS3', 'JavaScript', 'Full Stack Development'],
      icon: 'Code2',
      is_active: true,
      sort_order: 3,
    },
    {
      id: 'srv_4',
      code: '04',
      title: 'DIGITAL MARKETING',
      subtitle: 'Lead Gen & Client Acquisition',
      description:
        'Strategic social media marketing, targeted lead generation, client hunting, and brand promotion campaigns based on certified Google Digital Garage and LEDP methodologies.',
      tags: ['Lead Generation', 'Social Media Marketing', 'Client Hunting', 'Google Digital Garage'],
      icon: 'TrendingUp',
      is_active: true,
      sort_order: 4,
    },
    {
      id: 'srv_5',
      code: '05',
      title: 'CCTV & SECURITY',
      subtitle: 'Surveillance Deployment',
      description:
        'End-to-end installation of CCTV security systems in commercial supermarkets and offices. Configuration of DVR/NVR units, IP camera networking, and remote surveillance.',
      tags: ['CCTV Systems', 'DVR / NVR', 'IP Cameras', 'PoE Wiring'],
      icon: 'ShieldCheck',
      is_active: true,
      sort_order: 5,
    },
    {
      id: 'srv_6',
      code: '06',
      title: 'OFFICE MANAGEMENT',
      subtitle: 'Coordination & Business Ops',
      description:
        'Skilled in IT office management, administrative documentation, accounting assistance, IT inventory, and cross-functional team project coordination.',
      tags: ['Office IT', 'Accounting Support', 'Inventory Control', 'Coordination'],
      icon: 'Briefcase',
      is_active: true,
      sort_order: 6,
    },
  ],
  skills: [
    // IT Support
    { id: 'sk_1', name: 'Computer Hardware Troubleshooting', category: 'IT Support', proficiency_level: 95, icon: 'Cpu', is_active: true, sort_order: 1 },
    { id: 'sk_2', name: 'PC Software & Hardware Maintenance', category: 'IT Support', proficiency_level: 92, icon: 'Wrench', is_active: true, sort_order: 2 },
    { id: 'sk_3', name: 'Server Maintenance & Diagnostics', category: 'IT Support', proficiency_level: 85, icon: 'Server', is_active: true, sort_order: 3 },
    { id: 'sk_4', name: 'OS Deployment & Driver Config', category: 'IT Support', proficiency_level: 90, icon: 'Laptop', is_active: true, sort_order: 4 },
    // Networking
    { id: 'sk_5', name: 'Network Troubleshooting & Routing', category: 'Networking', proficiency_level: 88, icon: 'Network', is_active: true, sort_order: 5 },
    { id: 'sk_6', name: 'Cisco Devices & Packet Tracer 8.2.1', category: 'Networking', proficiency_level: 85, icon: 'Router', is_active: true, sort_order: 6 },
    { id: 'sk_7', name: 'LAN, Mail & HTTP Server Config', category: 'Networking', proficiency_level: 84, icon: 'Globe', is_active: true, sort_order: 7 },
    { id: 'sk_8', name: 'IP Subnetting & VLAN Segmentation', category: 'Networking', proficiency_level: 86, icon: 'Share2', is_active: true, sort_order: 8 },
    // Web Development
    { id: 'sk_9', name: 'HTML5 & Modern CSS3', category: 'Web Development', proficiency_level: 90, icon: 'FileCode', is_active: true, sort_order: 9 },
    { id: 'sk_10', name: 'JavaScript (ES6+)', category: 'Web Development', proficiency_level: 85, icon: 'Terminal', is_active: true, sort_order: 10 },
    { id: 'sk_11', name: 'Frontend & Backend Architecture', category: 'Web Development', proficiency_level: 82, icon: 'Layers', is_active: true, sort_order: 11 },
    // Digital Marketing
    { id: 'sk_12', name: 'Digital Marketing Strategy', category: 'Digital Marketing', proficiency_level: 88, icon: 'Target', is_active: true, sort_order: 12 },
    { id: 'sk_13', name: 'Social Media Marketing', category: 'Digital Marketing', proficiency_level: 85, icon: 'Share', is_active: true, sort_order: 13 },
    { id: 'sk_14', name: 'Lead Generation & Client Hunting', category: 'Digital Marketing', proficiency_level: 86, icon: 'Search', is_active: true, sort_order: 14 },
    // Security Systems
    { id: 'sk_15', name: 'CCTV Camera Installation', category: 'Security Systems', proficiency_level: 90, icon: 'Camera', is_active: true, sort_order: 15 },
    { id: 'sk_16', name: 'DVR / NVR & IP Camera Configuration', category: 'Security Systems', proficiency_level: 88, icon: 'HardDrive', is_active: true, sort_order: 16 },
    // Programming
    { id: 'sk_17', name: 'C Programming', category: 'Programming', proficiency_level: 85, icon: 'Code', is_active: true, sort_order: 17 },
    { id: 'sk_18', name: 'Python', category: 'Programming', proficiency_level: 80, icon: 'FileTerminal', is_active: true, sort_order: 18 },
    { id: 'sk_19', name: 'Java', category: 'Programming', proficiency_level: 78, icon: 'Coffee', is_active: true, sort_order: 19 },
    // Office & Business
    { id: 'sk_20', name: 'Office Management & Project Coordination', category: 'Office & Business', proficiency_level: 90, icon: 'CheckSquare', is_active: true, sort_order: 20 },
    { id: 'sk_21', name: 'Finance, HR, Sales, Inventory & Accounting', category: 'Office & Business', proficiency_level: 82, icon: 'Calculator', is_active: true, sort_order: 21 },
    // Soft Skills & Languages
    { id: 'sk_22', name: 'English (Good Command)', category: 'Languages', proficiency_level: 85, icon: 'Languages', is_active: true, sort_order: 22 },
    { id: 'sk_23', name: 'Arabic (Basic, Continuous Growth)', category: 'Languages', proficiency_level: 65, icon: 'Languages', is_active: true, sort_order: 23 },
    { id: 'sk_24', name: 'Bengali (Native Fluency)', category: 'Languages', proficiency_level: 100, icon: 'Languages', is_active: true, sort_order: 24 },
  ],
  projects: [
    {
      id: 'proj_1',
      title: 'University Club Management System',
      category: 'Web & Software Application',
      short_description: 'Complete digital management system for university clubs, member registration, and departmental coordination.',
      full_description: 'Engineered a full club management web platform allowing student leaders to handle member enrollments, allocate executive roles, schedule workshops, and publish notifications with real-time tracking.',
      thumbnail_url: '/uploads/project_club_mgmt_1789985482555.jpg',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Database Systems', 'UI/UX'],
      live_url: '',
      github_url: 'https://github.com',
      youtube_url: 'https://www.youtube.com/@user-ed1sz1sx4i',
      is_featured: true,
      status: 'published',
      sort_order: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 'proj_2',
      title: 'Library Management System — Web Programming',
      category: 'Web Development',
      short_description: 'Web-based library management platform for catalog search, book tracking, and student borrow logs.',
      full_description: 'Developed an interactive digital library cataloging application that simplifies book indexing, student book loans, overdue date monitoring, and category filtering.',
      thumbnail_url: '/uploads/project_library_web_1789985532412.jpg',
      technologies: ['Web Programming', 'HTML5', 'CSS3', 'JavaScript', 'SQL'],
      live_url: '',
      github_url: 'https://github.com',
      youtube_url: '',
      is_featured: true,
      status: 'published',
      sort_order: 2,
      created_at: new Date().toISOString(),
    },
    {
      id: 'proj_3',
      title: 'Hotel Management Network (Cisco Packet Tracer)',
      category: 'Network Engineering',
      short_description: 'Enterprise network architecture with VLANs, guest Wi-Fi segregation, and secure routing for hospitality.',
      full_description: 'Designed and simulated a multi-department hotel infrastructure utilizing Cisco Packet Tracer. Configured distinct subnets for management, guest rooms, point-of-sale systems, and IP surveillance cameras with robust ACL security.',
      thumbnail_url: '/uploads/project_cisco_net_1789985504492.jpg',
      technologies: ['Cisco Packet Tracer', 'VLAN Configuration', 'Routing & Switching', 'Subnetting', 'DHCP'],
      live_url: '',
      github_url: '',
      youtube_url: 'https://www.youtube.com/@user-ed1sz1sx4i',
      is_featured: true,
      status: 'published',
      sort_order: 3,
      created_at: new Date().toISOString(),
    },
    {
      id: 'proj_4',
      title: '3D Mosque Architectural Model (AutoCAD)',
      category: '3D Modeling & CAD',
      short_description: 'Geometric 3D CAD modeling and architectural elevation render of a modern mosque structure.',
      full_description: 'Drafted and modeled a 3D architectural mosque in AutoCAD, integrating geometric dome curves, tall minarets, accurate elevations, and structural wireframe renders.',
      thumbnail_url: '/src/assets/images/project_autocad_3d_1789985518523.jpg',
      technologies: ['AutoCAD 3D', 'Architectural Drafting', '3D Modeling', 'Wireframing'],
      live_url: '',
      github_url: '',
      youtube_url: '',
      is_featured: true,
      status: 'published',
      sort_order: 4,
      created_at: new Date().toISOString(),
    },
    {
      id: 'proj_5',
      title: 'Local Area Network with Mail & HTTP Server',
      category: 'Network Engineering',
      short_description: 'University network system configured in Cisco Packet Tracer 8.2.1 with active email and web services.',
      full_description: 'Constructed an end-to-end LAN simulation interconnecting client workstations, Cisco switches, and central servers running HTTP, DNS, and Mail services (SMTP/POP3) with complete verification.',
      thumbnail_url: '/uploads/project_cisco_net_1789985504492.jpg',
      technologies: ['Cisco Packet Tracer 8.2.1', 'Mail Server', 'HTTP Server', 'DNS Configuration', 'LAN Infrastructure'],
      live_url: '',
      github_url: '',
      youtube_url: 'https://www.youtube.com/@user-ed1sz1sx4i',
      is_featured: true,
      status: 'published',
      sort_order: 5,
      created_at: new Date().toISOString(),
    },
  ],
  experience: [
    {
      id: 'exp_1',
      company: 'ABC Computer Service Center',
      position: 'Laptop Service Engineer',
      location: 'Bangladesh',
      start_date: '2023',
      end_date: '2024',
      is_current: false,
      responsibilities: [
        'Diagnosed and serviced laptop hardware issues, motherboard components, screen replacements, and power circuits.',
        'Executed operating system installations, device driver updates, malware removal, and storage data recoveries.',
        'Provided comprehensive technical support and preventive maintenance advice to clients.',
      ],
      technologies: ['Hardware Diagnostics', 'Laptop Motherboard Servicing', 'OS Deployment', 'Component Repair'],
      sort_order: 1,
    },
    {
      id: 'exp_2',
      company: 'Infinity Infotech Ltd.',
      position: 'CCTV Technician',
      location: 'Bangladesh',
      start_date: '2022',
      end_date: '2023',
      is_current: false,
      responsibilities: [
        'Installed commercial CCTV surveillance camera setups in corporate office environments and supermarkets.',
        'Configured DVR/NVR storage servers, channel recording schedules, and IP camera network parameters.',
        'Terminated and tested high-grade coaxial and twisted-pair cabling for high-definition video transmission.',
      ],
      technologies: ['CCTV Systems', 'DVR / NVR Configuration', 'IP Cameras', 'PoE Networking'],
      sort_order: 2,
    },
    {
      id: 'exp_3',
      company: 'Zilla Jouge Court, Pirojpur',
      position: 'Accountendent / Office Administrator',
      location: 'Pirojpur, Bangladesh',
      start_date: '2021',
      end_date: '2022',
      is_current: false,
      responsibilities: [
        'Maintained office account ledgers, voucher tracking, and administrative document processing.',
        'Organized digital computer records, document storage, and departmental inventory management.',
      ],
      technologies: ['Office Management', 'Account Ledgers', 'Documentation', 'Computer Applications'],
      sort_order: 3,
    },
  ],
  education: [
    {
      id: 'edu_1',
      degree: 'B.Sc in Computer Science and Engineering',
      institution: 'Jogonnath University',
      location: 'Dhaka, Bangladesh',
      start_year: '2020',
      end_year: '2024',
      grade: 'CGPA: 3.30 / 4.00',
      description:
        'Graduated with honors in Computer Science and Engineering. Coursework in Computer Networks, Hardware Architecture, Operating Systems, Database Management Systems, and Software Engineering.',
      sort_order: 1,
    },
    {
      id: 'edu_2',
      degree: 'Higher Secondary Certificate (HSC)',
      institution: 'Govt. Shamsherdy College',
      location: 'Pirojpur, Bangladesh',
      start_year: '2017',
      end_year: '2019',
      grade: 'GPA: 5.00 / 5.00 (Science Group)',
      description: 'Graduated in the Science group with the highest grade mark of GPA 5.00.',
      sort_order: 2,
    },
    {
      id: 'edu_3',
      degree: 'Secondary School Certificate (SSC)',
      institution: 'Pirojpur Fazil Degree Madrasha',
      location: 'Pirojpur, Bangladesh',
      start_year: '2015',
      end_year: '2017',
      grade: 'GPA: 5.00 / 5.00 (Science Group)',
      description: 'Completed secondary education with top distinction GPA 5.00 in Science.',
      sort_order: 3,
    },
  ],
  certifications: [
    {
      id: 'cert_1',
      name: 'Digital Marketing in LEDP Project',
      issuer: 'ICT Division, Govt. of Bangladesh',
      issue_date: '2021',
      description: 'Comprehensive government training on digital marketing strategies, SEO fundamentals, and campaign analytics.',
      sort_order: 1,
    },
    {
      id: 'cert_2',
      name: 'The Fundamentals of Digital Marketing',
      issuer: 'Google Digital Garage',
      issue_date: '2022',
      description: 'Accredited certificate on search engine marketing, social media advertising, and digital business presence.',
      sort_order: 2,
    },
    {
      id: 'cert_3',
      name: 'AutoCAD 2D & 3D Architectural Drafting',
      issuer: 'New Chips and Bytes, Pirojpur',
      issue_date: '2021',
      description: 'Professional computer-aided design, 2D floor plans, 3D modeling, and volumetric structural rendering.',
      sort_order: 3,
    },
    {
      id: 'cert_4',
      name: 'Professional Office Management in Computer',
      issuer: 'New Chips and Bytes, Pirojpur',
      issue_date: '2020',
      description: 'Advanced business office software, spreadsheet data management, document processing, and administrative coordination.',
      sort_order: 4,
    },
    {
      id: 'cert_5',
      name: 'Making Self Video on YouTube',
      issuer: 'YouTube Creator Training',
      issue_date: '2023',
      description: 'Video recording, audiovisual presentation, content structuring, and audience engagement on digital media.',
      sort_order: 5,
    },
  ],
  awards: [
    {
      id: 'aw_1',
      title: 'Dean’s Award for Academic Excellence',
      issuer: 'Jogonnath University',
      year: '2021',
      description: 'Honored with the Dean’s Award for securing exceptional academic results with CGPA 3.80 and above.',
      sort_order: 1,
    },
    {
      id: 'aw_2',
      title: '2nd Runner-Up — Next Edunious Competition',
      issuer: 'Next Edunious Competition',
      year: '2020',
      description: 'Awarded 2nd runner-up distinction in national technical innovation and problem-solving competition.',
      sort_order: 2,
    },
    {
      id: 'aw_3',
      title: 'Best Quality Analyst of the Month (2 Times)',
      issuer: 'Quality Operations Team',
      year: '2023',
      description: 'Recognized twice for outstanding precision, error-free diagnostics, and adherence to top quality standards.',
      sort_order: 3,
    },
  ],
  activities: [
    {
      id: 'act_1',
      title: 'General Secretary',
      role: 'Executive Leader',
      organization: 'Jogonnath University Computer Club',
      period: '2021 – 2022',
      description: 'Organized tech workshops, coding bootcamps, and networking events for hundreds of computer science undergraduates.',
      sort_order: 1,
    },
    {
      id: 'act_2',
      title: 'Volunteer — 4th Int’l Conference on Sustainable Tech for Industry 4.0',
      role: 'Technical Coordinator',
      organization: 'International Conference on Sustainable Technologies',
      period: '2022',
      description: 'Coordinated audio-visual setups, technical session operations, and speaker logistics for international academic delegates.',
      sort_order: 2,
    },
    {
      id: 'act_3',
      title: 'General Volunteer — Food for All',
      role: 'Community Volunteer',
      organization: 'Food for All Humanitarian Initiative',
      period: '2021 – Present',
      description: 'Participated in community welfare, relief distribution, and social impact programs.',
      sort_order: 3,
    },
  ],
  process_steps: [
    {
      id: 'prc_1',
      step_number: '01',
      title: 'DISCOVER',
      subtitle: 'Analyze & Assess',
      description: 'Evaluating system bottlenecks, network topology, user requirements, and technical constraints.',
      icon: 'Search',
      sort_order: 1,
    },
    {
      id: 'prc_2',
      step_number: '02',
      title: 'PLAN',
      subtitle: 'Architecture & Strategy',
      description: 'Formulating structured blueprints, equipment selection, IP subnets, software stacks, and implementation roadmaps.',
      icon: 'FileSpreadsheet',
      sort_order: 2,
    },
    {
      id: 'prc_3',
      step_number: '03',
      title: 'DESIGN',
      subtitle: 'Blueprint & Wiring',
      description: 'Drafting precise schematics, UI wireframes, cabling maps, and security access controls.',
      icon: 'PenTool',
      sort_order: 3,
    },
    {
      id: 'prc_4',
      step_number: '04',
      title: 'DEVELOP',
      subtitle: 'Build & Deploy',
      description: 'Hands-on hardware installation, network configuration, switch/router programming, and responsive web coding.',
      icon: 'Code',
      sort_order: 4,
    },
    {
      id: 'prc_5',
      step_number: '05',
      title: 'DELIVER',
      subtitle: 'Test & Maintain',
      description: 'Comprehensive QA stress-testing, benchmark verification, client handover, and ongoing support.',
      icon: 'CheckCircle2',
      sort_order: 5,
    },
  ],
  testimonials: [
    {
      id: 'test_1',
      client_name: 'Academic Supervisor',
      position: 'Professor of Computer Science',
      company: 'Jogonnath University',
      text: 'Md. Jobaer demonstrates sharp analytical ability and dedication in networking and computer engineering projects. His leadership as General Secretary of the Computer Club was exemplary.',
      rating: 5,
      status: 'published',
      sort_order: 1,
    },
  ],
  youtube_videos: [
    {
      id: 'yt_1',
      youtube_url: 'https://www.youtube.com/@user-ed1sz1sx4i',
      video_id: 'dQw4w9WgXcQ',
      title: 'Cisco Packet Tracer: Enterprise Multi-VLAN Trunking & Inter-VLAN Routing',
      category: 'Cisco Networking',
      description: 'Comprehensive lab simulation: designing dual-core Cisco 2960 switches with 802.1Q trunks, sub-interfaces on Cisco 2911 router, DHCP pools, and cross-VLAN ICMP ping verification.',
      thumbnail_url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80',
      is_featured: true,
      status: 'published',
      sort_order: 1,
      publish_date: '2024-06-15',
      duration: '18:45',
      lab_badge: 'ENTERPRISE LAB',
      tools_used: ['Cisco Packet Tracer 8.2.1', 'Cisco 2960 Switch', 'Cisco 2911 Router', 'CLI Commands', 'Wireshark'],
      key_steps: [
        'Designed network topology with Management, Engineering, and Guest VLANs',
        'Configured 802.1Q dot1q encapsulation and trunk links between switches',
        'Set up Router-on-a-Stick sub-interfaces with IP addressing and default gateways',
        'Verified traffic isolation and routing across subnets via ICMP packet testing',
      ],
    },
    {
      id: 'yt_2',
      youtube_url: 'https://www.youtube.com/@user-ed1sz1sx4i',
      video_id: '3JluqTojuME',
      title: 'Motherboard Diagnostics: Multimeter Voltage Rails & VRM Component Testing',
      category: 'Hardware Diagnostics',
      description: 'Step-by-step physical troubleshooting on a desktop motherboard: testing 12V, 5V, and 3.3V power rails, MOSFET resistance measurements, CMOS clear, and POST code error analysis.',
      thumbnail_url: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=800&auto=format&fit=crop&q=80',
      is_featured: true,
      status: 'published',
      sort_order: 2,
      publish_date: '2024-07-02',
      duration: '24:10',
      lab_badge: 'BENCH REPAIR',
      tools_used: ['Digital Multimeter', 'PCI-e POST Diagnostic Card', 'Soldering Station', 'Thermal Paste', 'Magnifier'],
      key_steps: [
        'Connected 24-pin ATX breakout to test standby 5VSB and power-good signal rails',
        'Measured VRM low-side and high-side MOSFETs for short-to-ground conditions',
        'Reseated DDR4 DIMMs with contact cleaner and tested single-channel boot loops',
        'Successfully diagnosed drained CR2032 CMOS battery and restored BIOS defaults',
      ],
    },
    {
      id: 'yt_3',
      youtube_url: 'https://www.youtube.com/@user-ed1sz1sx4i',
      video_id: 'fJ9rUzIMcZQ',
      title: 'Commercial CCTV & PoE NVR Setup: IP Addressing & Remote RTSP Streaming',
      category: 'CCTV & Security',
      description: 'End-to-end commercial surveillance deployment: terminating outdoor Cat6 cabling, PoE switch power budget calculation, camera static IP mapping, and mobile app live streaming.',
      thumbnail_url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop&q=80',
      is_featured: true,
      status: 'published',
      sort_order: 3,
      publish_date: '2024-08-10',
      duration: '15:30',
      lab_badge: 'COMMERCIAL SETUP',
      tools_used: ['Hikvision 4K NVR', 'PoE Dome & Bullet Cameras', 'Cat6 RJ45 Crimper', 'iVMS-4200 Software', 'Cable Tester'],
      key_steps: [
        'Terminated 4 Cat6 runs according to TIA/EIA 568B standard with continuity check',
        'Allocated static subnets for cameras isolated from corporate guest Wi-Fi',
        'Configured H.265+ encoding, motion detection regions, and tamper email alerts',
        'Integrated dynamic DNS and port forwarding for low-latency smartphone monitoring',
      ],
    },
    {
      id: 'yt_4',
      youtube_url: 'https://www.youtube.com/@user-ed1sz1sx4i',
      video_id: '7l8f8JqL9xA',
      title: 'Windows Server 2022: Active Directory Domain Services (AD DS) & Group Policy',
      category: 'Systems Administration',
      description: 'Configuring domain controller from scratch on Windows Server 2022: DNS zones, Organizational Units (OUs), bulk user creation with PowerShell, and wallpaper/drive map GPOs.',
      thumbnail_url: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&auto=format&fit=crop&q=80',
      is_featured: true,
      status: 'published',
      sort_order: 4,
      publish_date: '2024-09-01',
      duration: '21:15',
      lab_badge: 'SERVER ADMIN',
      tools_used: ['Windows Server 2022', 'Hyper-V Virtualization', 'Active Directory (AD DS)', 'PowerShell', 'GPMC'],
      key_steps: [
        'Promoted standalone server to primary Domain Controller for corp.local forest',
        'Established OU tree for Management, IT, and Finance with inheritance controls',
        'Authored and linked Group Policy Objects for mapped network shares and password complexity',
        'Joined Windows 11 client workstation to domain and validated policy enforcement',
      ],
    },
    {
      id: 'yt_5',
      youtube_url: 'https://www.youtube.com/@user-ed1sz1sx4i',
      video_id: '9bZkp7q19f0',
      title: 'Structured Cat6 Cabling: 24-Port Patch Panel Punch-Down & Rack Dressing',
      category: 'Network Infrastructure',
      description: 'Hands-on server room cabling task: routing high-density Cat6 cables through horizontal cable managers, punch-down termination on 110 IDC blocks, and 1000Base-T certification.',
      thumbnail_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
      is_featured: true,
      status: 'published',
      sort_order: 5,
      publish_date: '2024-09-18',
      duration: '14:20',
      lab_badge: 'SERVER RACK LAB',
      tools_used: ['110 Punch Down Tool', '24-Port Cat6 Patch Panel', 'Cable Stripper', 'Fluke Network Tester', 'Velcro Ties'],
      key_steps: [
        'Stripped outer PVC jacket preserving 0.5-inch pair twist up to termination point',
        'Punched down all 8 conductors conforming to ANSI/TIA-568-B color sequence',
        'Dressed bundle neatly into 19-inch wall-mount rack using reusable hook-and-loop ties',
        'Certified wiremap, length, and NEXT (Near-End Crosstalk) across all 24 ports',
      ],
    },
    {
      id: 'yt_6',
      youtube_url: 'https://www.youtube.com/@user-ed1sz1sx4i',
      video_id: 'jNQXAC9IVRw',
      title: 'University Club Management Platform: Full Architecture & Database Querying',
      category: 'Web Development',
      description: 'Technical walkthrough of the software engineered for university clubs: modular architecture, registration workflows, session storage, and relational SQL queries.',
      thumbnail_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
      is_featured: true,
      status: 'published',
      sort_order: 6,
      publish_date: '2024-10-05',
      duration: '17:40',
      lab_badge: 'FULL-STACK DEMO',
      tools_used: ['HTML5 & CSS3', 'JavaScript ES6+', 'Relational Database (SQL)', 'REST API', 'Figma Wireframing'],
      key_steps: [
        'Engineered responsive frontend with client-side form validation and role gates',
        'Structured relational database schemas with primary/foreign keys for club rosters',
        'Implemented search, filtering, and automated member status badges',
        'Demonstrated administrative panel for event publishing and executive member approvals',
      ],
    },
  ],
  hobbies: [
    { id: 'hb_1', name: 'Reading Fiction Books', icon: 'BookOpen', description: 'Exploring literature, storytelling, and creative concepts.', sort_order: 1 },
    { id: 'hb_2', name: 'Travelling & Exploration', icon: 'Compass', description: 'Experiencing diverse cultures, cities, and architectures.', sort_order: 2 },
    { id: 'hb_3', name: 'Spirituality, Meditation & Muraqaba', icon: 'Sun', description: 'Cultivating mindfulness, inner calm, and focus through meditation.', sort_order: 3 },
    { id: 'hb_4', name: 'Researching Emerging Tech', icon: 'Cpu', description: 'Investigating cutting-edge computing, AI, and network security advancements.', sort_order: 4 },
    { id: 'hb_5', name: 'Making Videos on YouTube', icon: 'Video', description: 'Sharing technical knowledge, tutorials, and creative video content.', sort_order: 5 },
  ],
  contact_messages: [
    {
      id: 'msg_1',
      name: 'Ahmed Al-Subaie',
      email: 'ahmed.subaie@example.com',
      project_type: 'IT Infrastructure & CCTV Setup',
      message: 'Hello Md. Jobaer, we have an office in Riyadh needing network cabling and IP surveillance camera configuration. Are you available for a project interview?',
      is_read: false,
      is_replied: false,
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
  ],
  site_settings: {
    id: 'set_1',
    seo_title: 'Md. Jobaer — IT Support Engineer & Network Specialist',
    meta_description:
      'Official portfolio of Md. Jobaer. IT Support Engineer, Web Developer, and Network Specialist in Riyadh, Saudi Arabia. Transferable Iqama.',
    keywords: 'Md. Jobaer, IT Support Engineer, Riyadh, Saudi Arabia, Cisco Network, Web Developer, CCTV Installation, Iqama Transferable',
    og_title: 'Md. Jobaer — IT Support Engineer & Portfolio',
    og_description: 'High-impact IT support, computer troubleshooting, enterprise networking, and modern web solutions.',
    og_image: '/src/assets/images/jobaer_profile_1789985465704.jpg',
    enable_dark_mode: true,
    lets_talk_url: '#contact',
    lets_talk_label: "LET'S TALK",
    copyright_text: 'Md. Jobaer. All rights reserved.',
  },
};

export class Database {
  private data: DatabaseSchema;
  private firestore = this.createFirestore();
  public readonly ready: Promise<void>;

  constructor() {
    this.ensureDir();
    this.data = this.loadLocal();
    this.ready = this.loadFromFirestore();
  }

  private createFirestore() {
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      if (process.env.VERCEL === '1') {
        throw new Error('Missing FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY in Vercel environment variables.');
      }
      console.warn('Firebase Admin credentials are not configured; using local database fallback.');
      return null;
    }

    const app = getApps().length > 0
      ? getApps()[0]
      : initializeApp({
          credential: cert({ projectId, clientEmail, privateKey }),
        });
    return getFirestore(app);
  }

  private ensureDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadLocal(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // ensure default structure
        return this.normalizeAssetPaths({
          ...defaultDatabase,
          ...parsed,
          profile: { ...defaultDatabase.profile, ...(parsed.profile || {}) },
          site_settings: { ...defaultDatabase.site_settings, ...(parsed.site_settings || {}) },
        });
      }
    } catch (err) {
      console.error('Error reading db.json, using defaults:', err);
    }
    this.saveLocal(defaultDatabase);
    return defaultDatabase;
  }

  public async save(newData?: DatabaseSchema): Promise<void> {
    if (newData) {
      this.data = newData;
    }

    if (this.firestore) {
      await this.firestore.doc(FIRESTORE_DOCUMENT).set({ data: this.data });
      return;
    }

    this.saveLocal();
  }

  private saveLocal(newData?: DatabaseSchema) {
    if (newData) {
      this.data = newData;
    }
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving db.json:', err);
    }
  }

  private async loadFromFirestore() {
    if (!this.firestore) return;

    try {
      const snapshot = await this.firestore.doc(FIRESTORE_DOCUMENT).get();
      if (snapshot.exists) {
        const stored = snapshot.data()?.data as Partial<DatabaseSchema>;
        this.data = this.normalizeAssetPaths({
          ...defaultDatabase,
          ...stored,
          profile: { ...defaultDatabase.profile, ...(stored.profile || {}) },
          site_settings: { ...defaultDatabase.site_settings, ...(stored.site_settings || {}) },
        });
      } else {
        await this.firestore.doc(FIRESTORE_DOCUMENT).set({ data: this.data });
      }
    } catch (err) {
      console.error('Error loading Firestore database; using local data:', err);
    }
  }

  public getRaw(): DatabaseSchema {
    return this.data;
  }

  private normalizeAssetPaths(data: DatabaseSchema): DatabaseSchema {
    const normalize = (value: string) => value?.replace(/^\/src\/assets\/images\//, '/uploads/') || value;
    const profileImage = data.profile.profile_image.includes('ChatGPT_Image_Sep_21__2026__05_01_46_PM_png_1789996213184.png')
      ? '/uploads/ChatGPT_Image_Sep_21__2026__05_01_46_PM_png_1790006862798.png'
      : normalize(data.profile.profile_image);
    return {
      ...data,
      profile: { ...data.profile, profile_image: profileImage },
      site_settings: { ...data.site_settings, og_image: normalize(data.site_settings.og_image) },
      projects: data.projects.map(project => ({ ...project, thumbnail_url: normalize(project.thumbnail_url) })),
    };
  }

  // Public portfolio view with published items only
  public getPublicPortfolio(): PortfolioData {
    return {
      profile: this.data.profile,
      social_links: this.data.social_links.filter(s => s.is_active).sort((a, b) => a.sort_order - b.sort_order),
      skills: this.data.skills.filter(s => s.is_active).sort((a, b) => a.sort_order - b.sort_order),
      services: this.data.services.filter(s => s.is_active).sort((a, b) => a.sort_order - b.sort_order),
      projects: this.data.projects
        .filter(p => p.status === 'published')
        .sort((a, b) => a.sort_order - b.sort_order),
      experience: [...this.data.experience].sort((a, b) => a.sort_order - b.sort_order),
      education: [...this.data.education].sort((a, b) => a.sort_order - b.sort_order),
      certifications: [...this.data.certifications].sort((a, b) => a.sort_order - b.sort_order),
      awards: [...this.data.awards].sort((a, b) => a.sort_order - b.sort_order),
      activities: [...this.data.activities].sort((a, b) => a.sort_order - b.sort_order),
      process_steps: [...this.data.process_steps].sort((a, b) => a.sort_order - b.sort_order),
      testimonials: this.data.testimonials
        .filter(t => t.status === 'published')
        .sort((a, b) => a.sort_order - b.sort_order),
      youtube_videos: this.data.youtube_videos
        .filter(v => v.status === 'published')
        .sort((a, b) => a.sort_order - b.sort_order),
      hobbies: [...this.data.hobbies].sort((a, b) => a.sort_order - b.sort_order),
      settings: this.data.site_settings,
      stats: {
        total_projects: this.data.projects.filter(p => p.status === 'published').length,
        total_videos: this.data.youtube_videos.filter(v => v.status === 'published').length,
        skills_count: this.data.skills.filter(s => s.is_active).length,
        experience_count: this.data.experience.length,
        education_count: this.data.education.length,
      },
    };
  }

  // Helper YouTube ID extractor
  public static extractYouTubeId(url: string): string | null {
    if (!url) return null;
    // Standard, short, shorts, embed
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }
}

export const db = new Database();
