function appendQuestion(questionObj){
    let question;
    switch(document.querySelector('#question-type').value){
        case "chiusa":
            question = document.createElement('li');
            question.classList.add('question');
            question.id = 'q' + document.querySelectorAll('.question').length;
            question.textContent = questionObj.question;
            let answers = document.createElement('ol');
            answers.classList.add('answers');
            if (questionObj.answers.length === 0) {
                alert('No Answers were given, try again');
                return;
            }
            for (ans of questionObj.answers){
                answer = document.createElement('li');
                answer.classList.add('answer');
                answer.textContent = ans;
                answers.appendChild(answer);
            }
            question.appendChild(answers);
            break;
        case "aperta":
            question = createOpenQuestion(questionObj);
            break;
        default:
            question = createBoolQuestion(questionObj);
    }
    let destroy = document.createElement('button');
    destroy.classList.add('destroy');
    destroy.textContent = 'X';
    destroy.addEventListener('click', (e) => {destroyQuestion(question.id)})
    question.appendChild(destroy);
    document.querySelector('.questions').appendChild(question);
}

function stampa(){
    document.querySelector('.utils').classList.add('hidden');
    for (elem of document.querySelectorAll('.destroy')){
        elem.classList.add('hidden');
    }
    print();
    document.querySelector('.utils').classList.remove('hidden');
    for (elem of document.querySelectorAll('.destroy')){
        elem.classList.remove('hidden');
    }
}

function csvUpload(){
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    // Check if a file is selected
    if (file) {
    // Create a new FileReader
        const reader = new FileReader();
        // Set up the FileReader onload event handler
        reader.onload = function (e) {
        // e.target.result contains the content of the file
        const fileContent = e.target.result;
        for (let line of fileContent.split('\n')){
            let data = line.split(';');
            let obj = {'answers' : []};
            obj.question = data[0];
            for(let i = 1; i < data.length; i++){
                obj.answers.push(data[i]);
            }
            if (data.length === 1){
                if (obj.question.includes('<div class="line"')){
                    document.querySelector('#aperta').selected = true;
                } else {
                    document.querySelector('#bool').selected = true;
                }
                obj.question = obj.question.split('<div')[0];
            } else {
                document.querySelector('#chiusa').selected = true;
            }
            if (obj.question !== ''){
                appendQuestion(obj);
            }
        }
    };
    // Read the file as text
    reader.readAsText(file);
    } else {
        console.error('No file selected');
    }
    fileInput.value = '';
    getLocalQuestionsObj();
}

function addQuestion(){
    let questionObj = {'answers': []}
    let domanda = document.querySelector('#domanda')
    if (domanda.value === ''){return;}
    questionObj.question = domanda.value;
    domanda.value = '';
    for (risposta of document.querySelectorAll('.risposta')){
        if (risposta.value !== ''){
            questionObj.answers.push(risposta.value);
            risposta.value = "";
        }
    }
    appendQuestion(questionObj);
    getLocalQuestionsObj();
}

function destroyQuestion(id){
    elem = document.getElementById(id);
    elem.remove();
}

function getLocalQuestionsObj(){
  let questions = document.querySelectorAll('.question');
  results = [];
  for (let question of questions){
    result = {'answers': []}
    result.question = question.innerHTML.split('<ol class="answers"')[0];
    for (let li of question.querySelectorAll('.answers li')){
        let append = li.textContent.substring(li.textContent.length - 2) === '/r'
        ? li.textContent.substring(0, li.textContent.length - 2) : li.textContent
      result.answers.push(li.textContent);
    }
    results.push(result);
  }
  localHistory = results;
}

function downloadCsv() {
    let csvData = ""
     // Add data
     localHistory.forEach(function (obj) {
        csvData += obj.question;
        obj.answers.forEach(function (ans){
            csvData += ";" + ans;
        })
        csvData += "\n"
     });
     // Download the CSV file
     let anchor = document.createElement('a');
     anchor.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvData);
     anchor.target = '_blank';
     anchor.download = 'verifica.csv';
     anchor.click();
}

function createOpenQuestion(questionObj){
    let question = document.createElement('li');
    question.classList.add('question');
    question.id = 'q' + document.querySelectorAll('.question').length;
    question.textContent = questionObj.question;
    for(let i = 0; i < 5; i++){
        let line = document.createElement('div');
        line.classList.add('line');
        question.appendChild(line);
    }
    return question;
}

function createBoolQuestion(questionObj){
    let question = document.createElement('li');
    question.classList.add('question');
    question.id = 'q' + document.querySelectorAll('.question').length;
    question.textContent = questionObj.question;
    let options = document.createElement('div');
    options.classList.add('options');
    for (let opt of ["true", "false"]){
        let boolOpt = document.createElement('button');
        boolOpt.classList.add('boolean');
        boolOpt.classList.add(opt);
        boolOpt.textContent = bools[opt];
        options.appendChild(boolOpt)
    }
    question.appendChild(options);
    return question;
}
let bools = {
    'true': 'V',
    'false': 'F'
}
let localHistory = [];
