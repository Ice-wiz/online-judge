const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  console.log("Connected to MongoDB");
  server = app.listen(config.port, () => {
    console.log(`Listening to port ${config.port}`);
  });
});

// const testCasesData = [
//   {
//       problemTitle: "Two Sum",
//       testCases: [
//           { input: { nums: [2, 7, 11, 15], target: 9 }, expectedOutput: [0, 1], isPublic: true, description: "Two elements summing to target" },
//           { input: { nums: [3, 2, 4], target: 6 }, expectedOutput: [1, 2], isPublic: true, description: "Another simple case" },
//           { input: { nums: [3, 3], target: 6 }, expectedOutput: [0, 1], isPublic: false, description: "Case with same elements" }
//       ]
//   },
//   {
//       problemTitle: "Palindrome Check",
//       testCases: [
//           { input: { str: "racecar" }, expectedOutput: true, isPublic: true, description: "Palindrome string" },
//           { input: { str: "hello" }, expectedOutput: false, isPublic: true, description: "Non-palindrome string" },
//           { input: { str: "" }, expectedOutput: true, isPublic: false, description: "Empty string" },
//           { input: { str: "a" }, expectedOutput: true, isPublic: false, description: "Single character" }
//       ]
//   },
//   {
//       problemTitle: "Fibonacci Number",
//       testCases: [
//           { input: { n: 0 }, expectedOutput: 0, isPublic: true, description: "Base case n=0" },
//           { input: { n: 1 }, expectedOutput: 1, isPublic: true, description: "Base case n=1" },
//           { input: { n: 10 }, expectedOutput: 55, isPublic: false, description: "Medium Fibonacci number" },
//           { input: { n: 20 }, expectedOutput: 6765, isPublic: false, description: "Larger Fibonacci number" }
//       ]
//   }
// ];

// // Save test cases and problems
// async function saveProblemsAndTestCases() {
//   try {
//       for (let problemData of testCasesData) {
//           let testCaseIds = [];
//           for (let tc of problemData.testCases) {
//               let testCase = new TestCase(tc);
//               await testCase.save();
//               testCaseIds.push(testCase._id);
//           }

//           // Create the problem with references to the test cases
//           let problem = new Problem({
//               title: problemData.problemTitle,
//               description: `Description for ${problemData.problemTitle}`,
//               difficulty: "easy", // Set difficulty for simplicity; can be adjusted as needed
//               executionTimeLimit: 1000, // 1 second
//               memoryLimit: 64, // 64MB
//               sampleTestCases: testCaseIds.slice(0, 1), // Use the first test case as the sample
//               testCases: testCaseIds
//           });

//           await problem.save();
//           console.log(`Saved problem: ${problem.title}`);
//       }
//   } catch (error) {
//       console.error('Error saving problems and test cases:', error);
//   } finally {
//       mongoose.connection.close(); // Close the connection after saving
//   }
// }

// // Call the function to save data
// saveProblemsAndTestCases();


app.get('/', (req, res) => {
  // Read cookies
  const { cookies } = req;
  console.log(cookies); // This will log all cookies sent by the client

  // You can access a specific cookie by name
  const sessionCookie = req.cookies.sessionToken;
  console.log(sessionCookie);

  res.send('Check your console for cookies!');
});


