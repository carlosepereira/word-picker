const letterBoxesMatch = document.getElementsByClassName('letter-box-match');
const letterBoxesGuess = document.getElementsByClassName('letter-box-guess');
const lettersGuessPosition = document.querySelectorAll('input[type=checkbox].check-guess')
const lettersWrong = document.querySelectorAll('input[type=checkbox].letter-wrong')
const language = document.querySelectorAll('input[type=radio]')
const btnSend = document.getElementById('submit');
const tablePossibilities = document.getElementById('possibilities');

[...letterBoxesMatch].forEach(match => {
})

let possibilities = [];

btnSend.addEventListener('click', async (e) => {
    let letters = {
        match: {},
        guess: {},
        guessPosition: [],
        wrong: [],
        language: ''
    };

    Object.values({ ...letterBoxesMatch }).forEach((k) => {
        letters.match[k.id] = k.value;
    });

    Object.values({ ...letterBoxesGuess }).forEach((k) => {
        letters.guess[k.id] = k.value;
    });

    
    [ ...lettersGuessPosition].forEach((k,i) => {
        if(k.checked) {
            const [ key, value ] = k.value.split('')
            letters.guessPosition.push({ [key]: value, letter: letters.guess[i] });
        }
    });

    [ ...lettersWrong].forEach(k => {
        if(k.checked) {
            letters.wrong.push(k.value);
        }
    });

    [...language].forEach(lang => {
        if(lang.checked) {
            letters.language = lang.value;
        }
    })
    
    await submit(letters);

    renderTable();
})

const submit = async (letters) => {
    const rawResponse = await fetch('http://localhost:3000', {
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