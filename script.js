const input_type = document.getElementById("input-type")
const input_amount = document.getElementById("input-amount")
const input_date = document.getElementById("input-date")
const input_note = document.getElementById("input-note")

//add transaction to database
async function addTransaction(event) {
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

    fetch('http://localhost:3000/api/transactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(new_transaction)
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response from your server, e.g., display a success message
        console.log('Transaction added successfully:', data);

        // Optionally, clear the form fields
        input_type.value = 'expense';
        input_amount.value = '';
        input_date.value = '';
        input_note.value = '';
    })
    .catch(error => {
        // Handle any errors, e.g., display an error message
        console.error('Error adding transaction:', error);
    });
    
}