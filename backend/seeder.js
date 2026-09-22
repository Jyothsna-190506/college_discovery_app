const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config({ path: __dirname + "/.env" });

const College = require("./models/College");
const User = require("./models/User");
const Review = require("./models/Review");
const Question = require("./models/Question");

const sampleColleges = [
  {
    name: "Indian Institute of Technology Bombay (IITB)",
    location: "Powai, Mumbai, Maharashtra",
    city: "Mumbai",
    state: "Maharashtra",
    ranking: 3,
    type: "Public / National Importance",
    establishedYear: 1958,
    campusSize: "550 Acres",
    fees: 220000,
    averagePackage: 21.8,
    highestPackage: 168.0,
    placementRate: 94,
    topRecruiters: ["Google", "Microsoft", "Apple", "Qualcomm", "McKinsey", "Morgan Stanley"],
    courses: [
      { name: "Computer Science & Engineering", degree: "B.Tech", duration: "4 Years", annualFee: 220000, eligibility: "JEE Advanced" },
      { name: "Electrical Engineering", degree: "B.Tech", duration: "4 Years", annualFee: 220000, eligibility: "JEE Advanced" },
      { name: "Mechanical Engineering", degree: "B.Tech", duration: "4 Years", annualFee: 220000, eligibility: "JEE Advanced" },
      { name: "Data Science & AI", degree: "B.Tech", duration: "4 Years", annualFee: 220000, eligibility: "JEE Advanced" },
    ],
    cutoffs: [
      { exam: "JEE ADVANCED", branch: "Computer Science & Engineering", category: "General", closingRank: 67 },
      { exam: "JEE ADVANCED", branch: "Data Science & AI", category: "General", closingRank: 125 },
      { exam: "JEE ADVANCED", branch: "Electrical Engineering", category: "General", closingRank: 420 },
      { exam: "JEE ADVANCED", branch: "Mechanical Engineering", category: "General", closingRank: 1680 },
      { exam: "JEE MAIN", branch: "Computer Science (Equivalent Metric)", category: "General", closingRank: 350 },
      { exam: "JEE MAIN", branch: "Engineering Sciences", category: "General", closingRank: 1800 },
    ],
    facilities: ["Olympic Swimming Pool", "Gigabit Wi-Fi", "Modern Central Library", "Hostels (18)", "Gymnasium", "Robotics Innovation Lab"],
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=1200",
    website: "https://www.iitb.ac.in",
    description: "IIT Bombay is a globally acclaimed public technical research university known for cutting-edge engineering programs, entrepreneurship, and top-tier placements.",
    ratingsAverage: 4.9,
    ratingsQuantity: 12,
  },
  {
    name: "Indian Institute of Technology Delhi (IITD)",
    location: "Hauz Khas, New Delhi, Delhi",
    city: "New Delhi",
    state: "Delhi",
    ranking: 2,
    type: "Public / National Importance",
    establishedYear: 1961,
    campusSize: "320 Acres",
    fees: 225000,
    averagePackage: 23.5,
    highestPackage: 150.0,
    placementRate: 95,
    topRecruiters: ["Google", "Tower Research", "Jane Street", "Microsoft", "Goldman Sachs"],
    courses: [
      { name: "Computer Science & Engineering", degree: "B.Tech", duration: "4 Years", annualFee: 225000, eligibility: "JEE Advanced" },
      { name: "Mathematics and Computing", degree: "B.Tech", duration: "4 Years", annualFee: 225000, eligibility: "JEE Advanced" },
      { name: "Electrical Engineering", degree: "B.Tech", duration: "4 Years", annualFee: 225000, eligibility: "JEE Advanced" },
      { name: "Chemical Engineering", degree: "B.Tech", duration: "4 Years", annualFee: 225000, eligibility: "JEE Advanced" },
    ],
    cutoffs: [
      { exam: "JEE ADVANCED", branch: "Computer Science & Engineering", category: "General", closingRank: 115 },
      { exam: "JEE ADVANCED", branch: "Mathematics and Computing", category: "General", closingRank: 320 },
      { exam: "JEE ADVANCED", branch: "Electrical Engineering", category: "General", closingRank: 580 },
      { exam: "JEE MAIN", branch: "Computer Science (Equivalent)", category: "General", closingRank: 400 },
      { exam: "JEE MAIN", branch: "Electrical (Equivalent)", category: "General", closingRank: 1500 },
    ],
    facilities: ["High Performance Computing Center", "Wi-Fi Campus", "Central Research Facility", "Sports Arena", "Digital Library"],
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200",
    website: "https://home.iitd.ac.in",
    description: "Located in the heart of Delhi, IIT Delhi offers premier engineering and technological education with renowned faculty and startup incubation facilities.",
    ratingsAverage: 4.8,
    ratingsQuantity: 10,
  },
  {
    name: "Indian Institute of Technology Madras (IITM)",
    location: "Adyar, Chennai, Tamil Nadu",
    city: "Chennai",
    state: "Tamil Nadu",
    ranking: 1,
    type: "Public / National Importance",
    establishedYear: 1959,
    campusSize: "630 Acres",
    fees: 215000,
    averagePackage: 21.5,
    highestPackage: 131.0,
    placementRate: 96,
    topRecruiters: ["Texas Instruments", "Qualcomm", "Amazon", "Bain & Company", "Intel"],
    courses: [
      { name: "Computer Science & Engineering", degree: "B.Tech", duration: "4 Years", annualFee: 215000, eligibility: "JEE Advanced" },
      { name: "Aerospace Engineering", degree: "B.Tech", duration: "4 Years", annualFee: 215000, eligibility: "JEE Advanced" },
      { name: "Mechanical Engineering", degree: "B.Tech", duration: "4 Years", annualFee: 215000, eligibility: "JEE Advanced" },
    ],
    cutoffs: [
      { exam: "JEE ADVANCED", branch: "Computer Science & Engineering", category: "General", closingRank: 148 },
      { exam: "JEE ADVANCED", branch: "Aerospace Engineering", category: "General", closingRank: 2400 },
      { exam: "JEE MAIN", branch: "Engineering Sciences", category: "General", closingRank: 500 },
      { exam: "JEE MAIN", branch: "Core Engineering", category: "General", closingRank: 2500 },
    ],
    facilities: ["IITM Research Park", "Supercomputer VIRGO", "National Heritage Campus", "Sports Complex", "Wildlife Enclave"],
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200",
    website: "https://www.iitm.ac.in",
    description: "Consistently ranked #1 in NIRF overall rankings, IIT Madras fosters world-class academic rigor and advanced scientific innovation.",
    ratingsAverage: 4.9,
    ratingsQuantity: 15,
  },
  {
    name: "BITS Pilani (Pilani Campus)",
    location: "Vidya Vihar, Pilani, Rajasthan",
    city: "Pilani",
    state: "Rajasthan",
    ranking: 20,
    type: "Private Deemed",
    establishedYear: 1964,
    campusSize: "328 Acres",
    fees: 520000,
    averagePackage: 19.2,
    highestPackage: 60.0,
    placementRate: 93,
    topRecruiters: ["Uber", "Google", "Oracle", "Cisco", "JP Morgan"],
    courses: [
      { name: "Computer Science", degree: "B.E.", duration: "4 Years", annualFee: 520000, eligibility: "BITSAT" },
      { name: "Electronics & Communication", degree: "B.E.", duration: "4 Years", annualFee: 520000, eligibility: "BITSAT" },
      { name: "Economics + CS (Dual Degree)", degree: "M.Sc + B.E.", duration: "5 Years", annualFee: 520000, eligibility: "BITSAT" },
    ],
    cutoffs: [
      { exam: "BITSAT", branch: "Computer Science", category: "General", closingRank: 331 },
      { exam: "BITSAT", branch: "Electronics & Communication", category: "General", closingRank: 295 },
      { exam: "JEE MAIN", branch: "Computer Science Equivalent", category: "General", closingRank: 2800 },
      { exam: "JEE MAIN", branch: "Electrical / Mech Equivalent", category: "General", closingRank: 7500 },
    ],
    facilities: ["0% Attendance Policy", "Practice School (Industry Internships)", "24/7 Library", "Student Activity Center"],
    image: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=1200",
    website: "https://www.bits-pilani.ac.in",
    description: "India's highest-ranking private engineering university with legendary alumni network, flexible academic structure, and top technology roles.",
    ratingsAverage: 4.8,
    ratingsQuantity: 18,
  },
  {
    name: "National Institute of Technology Tiruchirappalli (NIT Trichy)",
    location: "Tanjore Main Road, Tiruchirappalli, Tamil Nadu",
    city: "Tiruchirappalli",
    state: "Tamil Nadu",
    ranking: 9,
    type: "Public / National Importance",
    establishedYear: 1964,
    campusSize: "800 Acres",
    fees: 165000,
    averagePackage: 15.8,
    highestPackage: 52.0,
    placementRate: 91,
    topRecruiters: ["Microsoft", "Amazon", "Samsung", "Qualcomm", "Morgan Stanley"],
    courses: [
      { name: "Computer Science & Engineering", degree: "B.Tech", duration: "4 Years", annualFee: 165000, eligibility: "JEE Main" },
      { name: "Electronics & Communication", degree: "B.Tech", duration: "4 Years", annualFee: 165000, eligibility: "JEE Main" },
      { name: "Mechanical Engineering", degree: "B.Tech", duration: "4 Years", annualFee: 165000, eligibility: "JEE Main" },
    ],
    cutoffs: [
      { exam: "JEE MAIN", branch: "Computer Science & Engineering", category: "General", closingRank: 4200 },
      { exam: "JEE MAIN", branch: "Electronics & Communication", category: "General", closingRank: 8500 },
      { exam: "JEE MAIN", branch: "Mechanical Engineering", category: "General", closingRank: 16000 },
      { exam: "JEE MAIN", branch: "Computer Science & Engineering", category: "OBC", closingRank: 5800 },
      { exam: "JEE MAIN", branch: "Computer Science & Engineering", category: "SC", closingRank: 12000 },
    ],
    facilities: ["Octagon Computer Center", "Mega Sports Complex", "Central Library", "100Gbps LAN", "Innovation Labs"],
    image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=1200",
    website: "https://www.nitt.edu",
    description: "The crown jewel among NITs in India, NIT Trichy boasts extraordinary placements, lush green 800-acre campus, and research culture.",
    ratingsAverage: 4.7,
    ratingsQuantity: 11,
  },
  {
    name: "International Institute of Information Technology Hyderabad (IIIT-H)",
    location: "Gachibowli, Hyderabad, Telangana",
    city: "Hyderabad",
    state: "Telangana",
    ranking: 55,
    type: "Autonomous",
    establishedYear: 1998,
    campusSize: "66 Acres",
    fees: 360000,
    averagePackage: 30.5,
    highestPackage: 102.0,
    placementRate: 98,
    topRecruiters: ["Apple", "Google", "Facebook / Meta", "Directi", "Uber"],
    courses: [
      { name: "Computer Science & Engineering", degree: "B.Tech", duration: "4 Years", annualFee: 360000, eligibility: "JEE Main / UGEE" },
      { name: "Electronics & Communication", degree: "B.Tech", duration: "4 Years", annualFee: 360000, eligibility: "JEE Main / UGEE" },
      { name: "CSE + MS by Research", degree: "Dual Degree", duration: "5 Years", annualFee: 360000, eligibility: "UGEE" },
    ],
    cutoffs: [
      { exam: "JEE MAIN", branch: "Computer Science & Engineering", category: "General", closingRank: 1600 },
      { exam: "JEE MAIN", branch: "Electronics & Communication", category: "General", closingRank: 4100 },
    ],
    facilities: ["Kohli Center on Intelligent Systems", "AI & Robotics Labs", "High Speed Campus Network", "Incubation Hub"],
    image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1200",
    website: "https://www.iiit.ac.in",
    description: "India's premier coding and computer science powerhouse with average package exceeding ₹30 LPA, surpassing many top IITs.",
    ratingsAverage: 4.9,
    ratingsQuantity: 14,
  },
  {
    name: "Delhi Technological University (DTU)",
    location: "Shahbad Daulatpur, Bawana Road, Delhi",
    city: "Delhi",
    state: "Delhi",
    ranking: 29,
    type: "Public State University",
    establishedYear: 1941,
    campusSize: "164 Acres",
    fees: 190000,
    averagePackage: 15.3,
    highestPackage: 82.0,
    placementRate: 88,
    topRecruiters: ["Adobe", "Amazon", "Goldman Sachs", "TCS", "Texas Instruments"],
    courses: [
      { name: "Computer Engineering", degree: "B.Tech", duration: "4 Years", annualFee: 190000, eligibility: "JEE Main (JAC Delhi)" },
      { name: "Information Technology", degree: "B.Tech", duration: "4 Years", annualFee: 190000, eligibility: "JEE Main (JAC Delhi)" },
      { name: "Software Engineering", degree: "B.Tech", duration: "4 Years", annualFee: 190000, eligibility: "JEE Main (JAC Delhi)" },
      { name: "Mechanical Engineering", degree: "B.Tech", duration: "4 Years", annualFee: 190000, eligibility: "JEE Main (JAC Delhi)" },
    ],
    cutoffs: [
      { exam: "JEE MAIN", branch: "Computer Engineering (Delhi Region)", category: "General", closingRank: 9500 },
      { exam: "JEE MAIN", branch: "Computer Engineering (Outside Delhi)", category: "General", closingRank: 3800 },
      { exam: "JEE MAIN", branch: "Information Technology", category: "General", closingRank: 12500 },
      { exam: "JEE MAIN", branch: "Mechanical Engineering", category: "General", closingRank: 32000 },
    ],
    facilities: ["Central Library", "Sports Stadium", "Incubation & Innovation Foundation", "Hostels", "Gym"],
    image: "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=1200",
    website: "http://dtu.ac.in",
    description: "Formerly Delhi College of Engineering (DCE), DTU is known for stellar placements, rich campus life, and vibrant technical societies.",
    ratingsAverage: 4.6,
    ratingsQuantity: 9,
  },
  {
    name: "National Institute of Technology Warangal (NITW)",
    location: "Fatimanagar, Kazipet, Warangal, Telangana",
    city: "Warangal",
    state: "Telangana",
    ranking: 21,
    type: "Public / National Importance",
    establishedYear: 1959,
    campusSize: "256 Acres",
    fees: 160000,
    averagePackage: 17.2,
    highestPackage: 88.0,
    placementRate: 90,
    topRecruiters: ["Qualcomm", "NVIDIA", "Amazon", "Oracle", "Cisco"],
    courses: [
      { name: "Computer Science & Engineering", degree: "B.Tech", duration: "4 Years", annualFee: 160000, eligibility: "JEE Main" },
      { name: "Electronics & Communication", degree: "B.Tech", duration: "4 Years", annualFee: 160000, eligibility: "JEE Main" },
      { name: "Electrical & Electronics", degree: "B.Tech", duration: "4 Years", annualFee: 160000, eligibility: "JEE Main" },
    ],
    cutoffs: [
      { exam: "JEE MAIN", branch: "Computer Science & Engineering", category: "General", closingRank: 3100 },
      { exam: "JEE MAIN", branch: "Electronics & Communication", category: "General", closingRank: 7200 },
      { exam: "JEE MAIN", branch: "Mechanical Engineering", category: "General", closingRank: 19500 },
    ],
    facilities: ["1.8 Gbps Internet", "Innovation Garage", "Digital Library", "Mega Hostels", "Gymkhana Grounds"],
    image: "https://images.unsplash.com/photo-1525921429624-479b6a26d84d?w=1200",
    website: "https://www.nitw.ac.in",
    description: "The very first Regional Engineering College founded in India, NIT Warangal continues to deliver top-tier engineering talent and research.",
    ratingsAverage: 4.7,
    ratingsQuantity: 8,
  },
  {
    name: "Vellore Institute of Technology (VIT Vellore)",
    location: "Katpadi, Vellore, Tamil Nadu",
    city: "Vellore",
    state: "Tamil Nadu",
    ranking: 11,
    type: "Private Deemed",
    establishedYear: 1984,
    campusSize: "372 Acres",
    fees: 295000,
    averagePackage: 9.9,
    highestPackage: 102.0,
    placementRate: 86,
    topRecruiters: ["Microsoft", "Amazon", "Wipro", "Cognizant", "TCS", "Infosys"],
    courses: [
      { name: "Computer Science & Engineering", degree: "B.Tech", duration: "4 Years", annualFee: 295000, eligibility: "VITEEE / JEE" },
      { name: "CSE with AI & Machine Learning", degree: "B.Tech", duration: "4 Years", annualFee: 295000, eligibility: "VITEEE / JEE" },
      { name: "Biotechnology", degree: "B.Tech", duration: "4 Years", annualFee: 195000, eligibility: "VITEEE / JEE" },
    ],
    cutoffs: [
      { exam: "JEE MAIN", branch: "Computer Science & Engineering", category: "General", closingRank: 24000 },
      { exam: "JEE MAIN", branch: "Electronics & Communication", category: "General", closingRank: 42000 },
      { exam: "VITEEE", branch: "Computer Science (Cat 1)", category: "General", closingRank: 7500 },
      { exam: "VITEEE", branch: "Computer Science (Cat 2)", category: "General", closingRank: 18000 },
    ],
    facilities: ["Air-Conditioned Hostels", "Food Courts", "Olympic Track", "Technological Innovation Center", "Wi-Fi Campus"],
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200",
    website: "https://vit.ac.in",
    description: "One of India's largest and most technologically equipped private universities with over 900+ companies visiting every placement season.",
    ratingsAverage: 4.4,
    ratingsQuantity: 24,
  },
  {
    name: "Manipal Institute of Technology (MIT Manipal)",
    location: "Tiger Circle, Manipal, Karnataka",
    city: "Manipal",
    state: "Karnataka",
    ranking: 61,
    type: "Private Deemed",
    establishedYear: 1957,
    campusSize: "313 Acres",
    fees: 385000,
    averagePackage: 12.6,
    highestPackage: 54.0,
    placementRate: 88,
    topRecruiters: ["Microsoft", "Deloitte", "Philips", "Bosch", "Accenture"],
    courses: [
      { name: "Computer Science & Engineering", degree: "B.Tech", duration: "4 Years", annualFee: 385000, eligibility: "MET / JEE" },
      { name: "Data Science & Engineering", degree: "B.Tech", duration: "4 Years", annualFee: 385000, eligibility: "MET / JEE" },
      { name: "Aeronautical Engineering", degree: "B.Tech", duration: "4 Years", annualFee: 335000, eligibility: "MET / JEE" },
    ],
    cutoffs: [
      { exam: "JEE MAIN", branch: "Computer Science & Engineering", category: "General", closingRank: 28000 },
      { exam: "JEE MAIN", branch: "Information Technology", category: "General", closingRank: 38000 },
      { exam: "MET", branch: "Computer Science", category: "General", closingRank: 1800 },
    ],
    facilities: ["Marena Indoor Sports Arena", "State-of-art Labs", "Cafeterias", "Multi-tier Library"],
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200",
    website: "https://manipal.edu/mit.html",
    description: "Known for global exposure, diverse student body, stellar campus life, and distinguished alumni like Satya Nadella (CEO, Microsoft).",
    ratingsAverage: 4.6,
    ratingsQuantity: 16,
  },
  {
    name: "Jadavpur University",
    location: "188, Raja S.C. Mallick Road, Kolkata, West Bengal",
    city: "Kolkata",
    state: "West Bengal",
    ranking: 10,
    type: "Public State University",
    establishedYear: 1955,
    campusSize: "58 Acres",
    fees: 10000, // Very low fees, stellar ROI!
    averagePackage: 15.1,
    highestPackage: 85.0,
    placementRate: 91,
    topRecruiters: ["Google", "Amazon", "Texas Instruments", "PwC", "De Shaw"],
    courses: [
      { name: "Computer Science & Engineering", degree: "B.E.", duration: "4 Years", annualFee: 10000, eligibility: "WBJEE / JEE" },
      { name: "Electronics & Telecommunication", degree: "B.E.", duration: "4 Years", annualFee: 10000, eligibility: "WBJEE / JEE" },
      { name: "Mechanical Engineering", degree: "B.E.", duration: "4 Years", annualFee: 10000, eligibility: "WBJEE / JEE" },
    ],
    cutoffs: [
      { exam: "JEE MAIN", branch: "Computer Science Equivalent", category: "General", closingRank: 3200 },
      { exam: "WBJEE", branch: "Computer Science & Engineering", category: "General", closingRank: 108 },
      { exam: "WBJEE", branch: "Electronics & Telecommunication", category: "General", closingRank: 320 },
    ],
    facilities: ["Unmatched ROI in India", "Central Library", "High Tech Labs", "Student Hostels"],
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1200",
    website: "http://www.jaduniv.edu.in",
    description: "Famous for virtually free tuition fees combined with elite-tier academic excellence and remarkable placement packages.",
    ratingsAverage: 4.7,
    ratingsQuantity: 13,
  },
  {
    name: "College of Engineering Guindy (Anna University)",
    location: "Sardar Patel Road, Guindy, Chennai, Tamil Nadu",
    city: "Chennai",
    state: "Tamil Nadu",
    ranking: 13,
    type: "Public State University",
    establishedYear: 1794,
    campusSize: "223 Acres",
    fees: 55000,
    averagePackage: 11.2,
    highestPackage: 40.0,
    placementRate: 89,
    topRecruiters: ["Caterpillar", "TCS", "Titan", "Zoho", "L&T"],
    courses: [
      { name: "Computer Science & Engineering", degree: "B.E.", duration: "4 Years", annualFee: 55000, eligibility: "TNEA / JEE" },
      { name: "Information Technology", degree: "B.Tech", duration: "4 Years", annualFee: 55000, eligibility: "TNEA / JEE" },
      { name: "Civil Engineering", degree: "B.E.", duration: "4 Years", annualFee: 50000, eligibility: "TNEA / JEE" },
    ],
    cutoffs: [
      { exam: "JEE MAIN", branch: "Computer Science Equivalent", category: "General", closingRank: 8200 },
      { exam: "TNEA", branch: "Computer Science & Engineering", category: "General", closingRank: 150 },
    ],
    facilities: ["Historic 1794 Heritage Campus", "Modern Computing Labs", "Large Auditorium", "Botanical Gardens"],
    image: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=1200",
    website: "https://www.annauniv.edu",
    description: "One of the oldest technical institutions in Asia, CEG Anna University provides rich engineering heritage and robust industry connections.",
    ratingsAverage: 4.6,
    ratingsQuantity: 11,
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clean existing collections
    await College.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    await Question.deleteMany();

    console.log("Cleaned existing data.");

    // 1. Create Demo Users
    const adminUser = await User.create({
      name: "Admin Officer",
      email: "admin@collegefinder.com",
      password: "admin123",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120",
    });

    const studentUser = await User.create({
      name: "Aakash Verma",
      email: "student@collegefinder.com",
      password: "student123",
      role: "user",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120",
      targetExam: "JEE Main",
    });

    const student2 = await User.create({
      name: "Sneha Reddy",
      email: "sneha@collegefinder.com",
      password: "student123",
      role: "user",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120",
      targetExam: "JEE Advanced",
    });

    console.log("Created 3 demo users.");

    // 2. Insert Colleges
    const insertedColleges = await College.insertMany(sampleColleges);
    console.log(`Inserted ${insertedColleges.length} colleges.`);

    // 3. Add Sample Reviews
    const iitb = insertedColleges[0];
    const bits = insertedColleges[3];
    const nitt = insertedColleges[4];
    const iiith = insertedColleges[5];

    await Review.create([
      {
        college: iitb._id,
        user: studentUser._id,
        userName: studentUser.name,
        rating: 5,
        title: "Life at IIT Bombay is unmatched!",
        comment: "The coding culture, hackathons, and festivals like Mood Indigo and Techfest are completely out of this world. Top companies hire like crazy here.",
        pros: "World-class coding environment, faculty, placements, networking",
        cons: "Academic workload can be quite intense",
      },
      {
        college: bits._id,
        user: student2._id,
        userName: student2.name,
        rating: 5,
        title: "0% Attendance Policy gives real freedom",
        comment: "BITS gives you the freedom to build startups, pursue coding, or study research without attendance compulsion. PS-1 and PS-2 internships are top notch.",
        pros: "No attendance pressure, amazing alumni network, high average salary",
        cons: "Fee structure is relatively high compared to IITs",
      },
      {
        college: iiith._id,
        user: studentUser._id,
        userName: studentUser.name,
        rating: 5,
        title: "Coding Mecca of India",
        comment: "If you love programming and AI research, nothing in India beats IIIT Hyderabad. Over ₹30 LPA average package is totally real.",
        pros: "Unbeatable CS curriculum, research labs, high packages",
        cons: "Strict academic rules, rigorous continuous evaluations",
      },
      {
        college: nitt._id,
        user: student2._id,
        userName: student2.name,
        rating: 4,
        title: "Top NIT with excellent infrastructure",
        comment: "Trichy has an incredible 800-acre campus. Coding clubs and technical fests are top notch. Very high placements for CSE and ECE.",
        pros: "Brand value, low fees, high placements",
        cons: "Warm weather in summer",
      },
    ]);

    // Recalculate average ratings
    await Review.calcAverageRatings(iitb._id);
    await Review.calcAverageRatings(bits._id);
    await Review.calcAverageRatings(iiith._id);
    await Review.calcAverageRatings(nitt._id);

    console.log("Created sample reviews.");

    // 4. Create Sample Forum Questions & Answers
    await Question.create([
      {
        question: "Is IIIT Hyderabad better than newer IITs for Computer Science?",
        details: "I have an option between IIT Ropar/Patna CSE vs IIIT Hyderabad CSE. Which one provides better coding culture and placements?",
        tags: ["Admissions", "Placements", "Comparisons"],
        author: studentUser._id,
        authorName: studentUser.name,
        college: iiith._id,
        collegeName: iiith.name,
        upvotes: [student2._id, adminUser._id],
        answers: [
          {
            author: student2._id,
            authorName: student2.name,
            text: "Without any hesitation, choose IIIT Hyderabad if your priority is pure Computer Science, research, and high salary packages. The coding curriculum starts from day 1.",
            upvotes: [studentUser._id],
          },
          {
            author: adminUser._id,
            authorName: adminUser.name,
            text: "IITs have slightly better general campus life and brand outside tech, but IIIT-H dominates tech recruitment and ACM ICPC coding competitions.",
            upvotes: [],
          },
        ],
      },
      {
        question: "What is the true cost and ROI of studying at BITS Pilani?",
        details: "The 4-year fee is approaching ₹20-22 Lakhs total. How manageable are student loans and scholarships?",
        tags: ["Fees", "Scholarships", "Admissions"],
        author: student2._id,
        authorName: student2.name,
        college: bits._id,
        collegeName: bits.name,
        upvotes: [studentUser._id],
        answers: [
          {
            author: studentUser._id,
            authorName: studentUser.name,
            text: "BITS offers Merit-cum-Need (MCN) scholarships covering 25% to 80% of tuition for eligible students. Also, SBI Scholar loans are given without collateral.",
            upvotes: [],
          },
        ],
      },
      {
        question: "How does College Predictor compute Safe vs Target colleges?",
        details: "Can I trust the predictor chances for JEE Main counselling?",
        tags: ["Cutoffs", "Predictor"],
        author: studentUser._id,
        authorName: studentUser.name,
        upvotes: [],
        answers: [
          {
            author: adminUser._id,
            authorName: "Admin Officer",
            text: "The predictor compares your entered rank against historical closing ranks across different categories. Safe means your rank is comfortably ahead of past cutoffs!",
            upvotes: [studentUser._id],
          },
        ],
      },
    ]);

    console.log("Created sample forum questions and answers.");

    // 5. Add Favorites to Demo User
    studentUser.favorites = [iitb._id, bits._id, iiith._id];
    await studentUser.save();
    console.log("Added initial favorites to student demo user.");

    console.log("🎉 Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await College.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    await Question.deleteMany();
    console.log("Data Destroyed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Destroy Error:", error);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  seedData();
}
