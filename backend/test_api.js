const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

const runTests = async () => {
  console.log("=========================================");
  console.log("🧪 STARTING COMPREHENSIVE BACKEND API TESTS");
  console.log("=========================================\n");

  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      process.stdout.write(`Testing: ${name}... `);
      await fn();
      console.log("✅ PASS");
      passed++;
    } catch (err) {
      console.log(`❌ FAIL: ${err.response?.data?.message || err.message}`);
      failed++;
    }
  };

  let token = "";
  let sampleCollegeId = "";
  let sampleQuestionId = "";

  // 1. Health Check
  await test("GET /api/health", async () => {
    const res = await axios.get(`${BASE_URL}/health`);
    if (!res.data.success) throw new Error("Health check failed");
  });

  // 2. Auth: Login Demo Student
  await test("POST /api/auth/login (Student)", async () => {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email: "student@collegefinder.com",
      password: "student123",
    });
    if (!res.data.token) throw new Error("No token returned");
    token = res.data.token;
  });

  // 3. Auth: Get Current Profile (Protected)
  await test("GET /api/auth/me (Protected Route)", async () => {
    const res = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.data.user || res.data.user.email !== "student@collegefinder.com") {
      throw new Error("Invalid user returned");
    }
  });

  // 4. Colleges: Get List with Pagination & Filtering
  await test("GET /api/colleges (Filter & Paginate)", async () => {
    const res = await axios.get(`${BASE_URL}/colleges?limit=5&sort=ranking_asc`);
    if (!res.data.success || res.data.data.length === 0) {
      throw new Error("Failed to fetch colleges");
    }
    sampleCollegeId = res.data.data[0]._id;
  });

  // 5. Colleges: Get Single College by ID with Reviews & Related
  await test("GET /api/colleges/:id", async () => {
    const res = await axios.get(`${BASE_URL}/colleges/${sampleCollegeId}`);
    if (!res.data.data || res.data.data._id !== sampleCollegeId) {
      throw new Error("Failed to retrieve single college");
    }
  });

  // 6. Predictor Engine: POST /api/colleges/predict
  await test("POST /api/colleges/predict (JEE Main AIR 3500)", async () => {
    const res = await axios.post(`${BASE_URL}/colleges/predict`, {
      exam: "JEE MAIN",
      rank: 3500,
      category: "General",
    });
    if (!res.data.success || !res.data.results) {
      throw new Error("Prediction failed");
    }
    const { safe, target, reach } = res.data.results;
    if (safe.length === 0 && target.length === 0 && reach.length === 0) {
      throw new Error("No colleges predicted");
    }
  });

  // 7. Reviews: Add or Update Review (Protected)
  await test("POST /api/reviews (Add/Update Review)", async () => {
    const res = await axios.post(
      `${BASE_URL}/reviews`,
      {
        collegeId: sampleCollegeId,
        rating: 5,
        title: "Outstanding curriculum and research infrastructure",
        comment: "The laboratories and professors are truly world-class.",
        pros: "Research culture, faculty, placements",
        cons: "Challenging exams",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!res.data.success) throw new Error("Failed to post review");
  });

  // 8. Questions: Get Discussion Forum Questions
  await test("GET /api/questions", async () => {
    const res = await axios.get(`${BASE_URL}/questions`);
    if (!res.data.success || res.data.data.length === 0) {
      throw new Error("No questions retrieved");
    }
    sampleQuestionId = res.data.data[0]._id;
  });

  // 9. Questions: Add Answer to Question (Protected)
  await test("POST /api/questions/answer/:id (Protected)", async () => {
    const res = await axios.post(
      `${BASE_URL}/questions/answer/${sampleQuestionId}`,
      {
        answer: "This is verified through official college records and placement brochures.",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!res.data.success) throw new Error("Failed to post answer");
  });

  // 10. Questions: Upvote Question
  await test("POST /api/questions/:id/upvote (Protected)", async () => {
    const res = await axios.post(
      `${BASE_URL}/questions/${sampleQuestionId}/upvote`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!res.data.success) throw new Error("Failed to upvote question");
  });

  // 11. User: Toggle Favorite (Protected)
  await test("POST /api/users/favorites/toggle (Protected)", async () => {
    const res = await axios.post(
      `${BASE_URL}/users/favorites/toggle`,
      { collegeId: sampleCollegeId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.data.success === undefined) throw new Error("Failed to toggle favorite");
  });

  // 12. User: Get Favorites List (Protected)
  await test("GET /api/users/favorites (Protected)", async () => {
    const res = await axios.get(`${BASE_URL}/users/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.data.success) throw new Error("Failed to fetch favorites");
  });

  console.log("\n=========================================");
  console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("=========================================\n");

  process.exit(failed > 0 ? 1 : 0);
};

runTests();
