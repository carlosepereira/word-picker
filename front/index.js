const letterBoxesMatch = document.getElementsByClassName('letter-box-match');
const letterBoxesGuess = document.getElementsByClassName('letter-box-guess');
// const letterBoxesWrong = document.getElementsByClassName('letter-box-wrong');
const lettersWrong = document.querySelectorAll('input[type=checkbox]')
const btnSend = document.getElementById('submit');
const tablePossibilities = document.getElementById('possibilities');

[...letterBoxesMatch].forEach(match => {
})

let possibilities = [];

btnSend.addEventListener('click', async (e) => {
    let letters = {
        match: {},
        guess: {},
        wrong: []
    };
    Object.values({ ...letterBoxesMatch }).forEach((k) => {
        letters.match[k.id] = k.value;
    });

    Object.values({ ...letterBoxesGuess }).forEach((k) => {
        letters.guess[k.id] = k.value;
    });

    [ ...lettersWrong].forEach(k => {
        if(k.checked) {
            letters.wrong.push(k.value);
        }
    })
    
    await submit(letters);

    renderTable();
})

const submit = async (letters) => {
    const rawResponse = await fetch('http://localhost:3000/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(letters)
    });
    possibilities = await rawResponse.json();
  };

const renderTable = () => {
    tablePossibilities.textContent = ''
    let index = 0;
    
    for(let i=0;i<possibilities.length;i++) {
        let tr = document.createElement('tr');
    
        for(let j=0;j<8;j++, i++){
            const possibilitie = possibilities[i];
            if(possibilitie) {
                const th = document.createElement('th');
                const text = document.createTextNode(possibilities[i])
        
                th.appendChild(text);
                tr.appendChild(th);
            }
        }
        tablePossibilities.appendChild(tr);
    }

    
}