const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express();
const PORT = process.env.PORT || 3000

mongoose.connect('mongodb+srv://admin:admin@final-project.fnwl9ey.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Transaction = mongoose.model('Transaction', {
    type: String,
    amount: Number,
    date: Date,
    note: String,
});

app.use(cors({ origin: 'http://localhost:3221' }))
app.use(bodyParser.json());

app.get('/api/transactions', async (req, res) => {
    try {
        // Find all transactions in the database
        const transactions = await Transaction.find();
    
        // Respond with the list of transactions
        res.json(transactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'An error occurred while fetching transactions' });
      }
})

// Define a route to handle POST requests to add transactions
app.post('/api/transactions', async (req, res) => {
  try {
    // Extract transaction data from the request body
    const { type, amount, date, note } = req.body;

    // Create a new transaction document and save it to the database
    const transaction = new Transaction({
      type,
      amount,
      date: new Date(date), // Convert date string to Date object
      note,
    });

    await transaction.save();

    // Respond with a success message or the saved transaction data
    res.json({ message: 'Transaction added successfully', transaction });
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ error: 'An error occurred while adding the transaction' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});