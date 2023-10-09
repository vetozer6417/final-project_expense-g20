document.addEventListener('DOMContentLoaded', function () {
    const input_date = document.getElementById('input-date')
    const input_type = document.getElementById('input-type')
    const input_amount = document.getElementById('input-amount')
    const input_note = document.getElementById('input-note')
    const input_submit = document.getElementById('submit-button')

    const transactionList = document.getElementById('list')
    const totalSavings = document.getElementById('balance-container')

    const apiUrl = 'http://localhost:3000/api/transactions'

    function init() {
        transactionList.innerHTML = ''
        getTransactions()
    }

    //fetch data
    async function getTransactions() {
        try {
            const response = await fetch(apiUrl)
            const transactions = await response.json()
            transactionList.innerHTML = '' //Clear existing list
            transactions.forEach((transaction) => {
                console.log(transaction)
                addDataToList(transaction)
            })

            addTotalSavings(transactions)
        } catch {
            console.error('Error fetching transactions:')
        }
    }

    async function addTotalSavings(transactions) {
        let totalSavingsAmount = 0

        transactions.forEach((transaction) => {
            if(transaction.type === 'income') {
                totalSavingsAmount += transaction.amount
            } else if (transaction.type === 'expense') {
                totalSavingsAmount -= transaction.amount
            }
        })
        totalSavingsAmount = Math.floor(totalSavingsAmount * 100) / 100
        const totalSavingsElement = document.getElementById('total-savings')
        totalSavingsElement.innerHTML = `&#3647 ${totalSavingsAmount}`
        //Clear existing content
        totalSavings.innerHTML = ''
        //append into the container
        totalSavings.appendChild(totalSavingsElement)
    }

    //Show data to list
    async function addDataToList(transaction) {
        let symbol = ''
        if(transaction.type === 'income') {
            symbol = '+'
        } else if( transaction.type === "expense") {
            symbol = '-'
        }

        const item = document.createElement('div')
        item.classList.add('item')

        const amountInt = transaction.amount
        const amountString = amountInt.toLocaleString("en-US")

        //format date
        const transactionDate = new Date(transaction.date)
        const day = String(transactionDate.getDate())
        const month = String(transactionDate.getMonth() + 1) //month starts at 0
        const year = transactionDate.getFullYear()
        const formattedDate =  `${day}/${month}/${year}`

        //amount color by categories -- divide by class
        let transactionColor = ''
        if(transaction.type === "income") {
            transactionColor = "transaction-income"
        } else if (transaction.type === "expense") {
            transactionColor = "transaction-expense"
        }

        item.innerHTML = `
            <div class="transaction-date">
                <p>${formattedDate}</p>
            </div>
            <div class="item-bottom">
                <div class="left">
                    <div class="transaction-amount">
                        <p class="${transactionColor}">${symbol}THB ${amountString}</p>
                    </div>
                    <div class="transaction-note">
                        <p>${transaction.note}</p>
                    </div>
                </div>
                <div class="right">
                <button type="button" id="removeBtn" class="remove-btn" data-transaction-id="${transaction._id}">X</button>
                </div>
            </div>
        `
        transactionList.appendChild(item)
    }

    //add transaction to database
    async function addTransaction(event) {
        console.log('addTransaction function called')
        event.preventDefault()
        if(input_amount.value.trim() === '' || input_date.value.trim() === '' ) {
            alert('Please fill in all the information!')
            return
        } 
        
        const new_transaction = {
            type: input_type.value,
            amount: parseFloat(input_amount.value),
            date: input_date.value,
            note: input_note.value
        }

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(new_transaction)
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response from your server, e.g., display a success message
            console.log('Transaction added successfully:', data)

            // Optionally, clear the form fields
            input_type.value = 'expense'
            input_amount.value = ''
            input_date.value = ''
            input_note.value = ''
            getTransactions()
        })
    }
    async function removeTransaction(transaction) {
        console.log('removeTransaction function called')
        console.log(transaction);
        try {
            await fetch(`http://localhost:3000/api/transactions/${transaction}`, {
                method: 'DELETE'
            })
            getTransactions() //refresh the data fetched again
        } catch (error) {
            console.error('Error deleting transaction:', error)
        }
    }

    input_submit.addEventListener('click', addTransaction)

    transactionList.addEventListener('click', async (event) => {
        if (event.target.classList.contains('remove-btn')) {
            const element = document.getElementById('removeBtn');
        if (element) {
            const transactionId = element.getAttribute('data-transaction-id');
            removeTransaction(transactionId);
        } else {
            console.log('Element not found.');
        }
        }
    });

    init()
})