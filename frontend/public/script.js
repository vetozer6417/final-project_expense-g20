document.addEventListener('DOMContentLoaded', function () {
    const input_date = document.getElementById('input-date')
    const input_type = document.getElementById('input-type')
    const input_amount = document.getElementById('input-amount')
    const input_note = document.getElementById('input-note')
    const input_submit = document.getElementById('submit-button')

    const transactionList = document.getElementById('list');

    const apiUrl = 'http://localhost:3000/api/transactions'

    function init() {
        transactionList.innerHTML = ''
        getTransactions()
    }

    async function getTransactions() {
        try {
            const response = await fetch(apiUrl)
            const transaction = await response.json()
            transactionList.innerHTML = '' //Clear existing list
            transaction.forEach((transaction) => {
                console.log(transaction)
                addDataToList(transaction)
            })
        } catch {
            console.error('Error fetching transactions:')
        }
    }

    async function addDataToList(transaction) {
        let symbol = ''
        if(transaction.type == 'Income') {
            symbol = '+'
        } else if( transaction.type == "Expense") {
            symbol = '-'
        }
        const item = document.createElement('div')
        item.classList.add('item')
        const amountInt = transaction.amount
        const amountString = amountInt.toLocaleString("en-US")

        item.innerHTML = `
            <div class="transaction-date">
                <p>${transaction.date}</p>
            </div>
            <div class="item-bottom">
                <div class="left">
                    <div class="transaction-amount">
                        <p class="transaction-expense">${symbol}THB ${amountString}</p>
                    </div>
                    <div class="transaction-note">
                        <p>${transaction.note}</p>
                    </div>
                </div>
                <div class="right">
                    <button type="submit" class="remove-btn">X</button>
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

    input_submit.addEventListener('submit',addTransaction)

    init()
})