import express from 'express';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK with service account credentials
const serviceAccount = require("../full-stack-app-127be-firebase-adminsdk-vbmsm-0c6dc1892b.json");
initializeApp({
  credential: cert(serviceAccount)
});

// Firestore instance
const db = getFirestore();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Sample route to test the server
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Route to fetch data from Firestore
app.get('/data', async (req, res) => {
  try {
    const snapshot = await db.collection('users').get(); // Change 'users' to your Firestore collection name
    const data = snapshot.docs.map(doc => doc.data());
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching data');
  }
});

// POST route to store data in Firestore
app.post('/submit', async (req, res) => {
  const { name, email } = req.body;
  try {
    const userRef = db.collection('users').doc(); // Automatically generates a new document ID
    await userRef.set({
      name,
      email,
    });
    res.send(`Received name: ${name}, email: ${email}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error submitting data');
  }
});

// Start the server
const port = 3001;
app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});