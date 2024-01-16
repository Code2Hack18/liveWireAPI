const natural = require("natural");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

let classifire = new natural.BayesClassifier(); // Initialize the classifier

// Training data
const trainingData = [
  ["tell me about charging status", "your current charging status is: "],
  ["what is charging status", "your charging status is: "],
  ["status of my bike", "Which status you would like know : "],
  ["how much charge is there in my bike", "well, it's charged up to: "],
  ["current charge of my bike", "your current charge is: "],
  [
    "how much kilometers it will run in this charging",
    "with your charging status of xyz, it can run up to: value",
  ],

  [
    "what are tire pressures on my bike",
    "The cureent tire pressure for the front tire is X psi, and for the rear tire is Y psi.",
  ],
  [
    "what is the tire pressure of front tire",
    "Its current tire pressure is X psi",
  ],
  [
    "what is the tire pressure of rear tire",
    "Its current tire pressure is Y psi",
  ],
  [
    "recommended or stable or normal tire pressures",
    "The recommended tire pressure for the front tire is X psi, and for the rear tire is Y psi.",
  ],
  [
    "what should be the tire pressures of my bike",
    "As per the guidlines the recommended tire pressure for the front tire is X psi, and for the rear tire is Y psi.",
  ],
  [
    "tire or tyre pressure and charging status",
    "you current front and rare tire pressures are x psi and Y psi and charging status is xyz",
  ],
  [
    "charging status and tire pressure",
    "you current tire charging status is xys and tire pressure is X psi for the font anf Y psi for rear",
  ],
  [
    "tire pressure needs attention",
    "your current tire pressure are for the front it is X psi and rear one is Y psi , which seems to be good and donot need any attention",
  ],
  ["start charging my bike", "your bike in now charging"],
];

// Train the classifier
trainingData.forEach(([input, output]) => {
  classifire.addDocument(input, output);
});

classifire.train();

// Route handling function
app.post("/api/process-sentence", (req, res) => {
  try {
    // Retrieve the sentence from the request body
    const { sentence } = req.body;

    // Process the sentence
    const response = classifire.classify(sentence);

    // Send the response
    res.json({ message: response });
  } catch (error) {
    console.error("Error processing sentence:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
