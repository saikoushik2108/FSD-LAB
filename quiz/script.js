
const quiz = [
    {
        q: "Which language is used for web pages?",
        a: ["Python", "HTML", "Java", "C"],
        correct: 1
    },
    {
        q: "Which language adds interactivity?",
        a: ["CSS", "HTML", "JavaScript", "SQL"],
        correct: 2
    },
    {
        q: "Which is used to style web pages?",
        a: ["CSS", "C++", "Python", "MongoDB"],
        correct: 0
    }
];

let index = 0, score = 0, time = 30, answered = false;

function showQuestion() {
    answered = false;
    document.getElementById("question").innerText = quiz[index].q;
    document.getElementById("options").innerHTML = "";

    quiz[index].a.forEach((option, i) => {
        let btn = document.createElement("button");
        btn.innerText = option;

        btn.onclick = () => {
            if (!answered) {
                answered = true;
                if (i === quiz[index].correct) score++;
                document.getElementById("score").innerText =
                    "Score: " + score;
            }
        };

        document.getElementById("options").appendChild(btn);
    });
}

function nextQuestion() {
    index++;

    if (index < quiz.length) {
        showQuestion();
    } else {
        clearInterval(timer);
        document.querySelector(".box").innerHTML =
            "<h2>Quiz Completed!</h2><h3>Score: " +
            score + "/" + quiz.length + "</h3>";
    }
}

let timer = setInterval(() => {
    time--;
    document.getElementById("timer").innerText =
        "Time: " + time + " seconds";

    if (time <= 0) {
        clearInterval(timer);
        document.querySelector(".box").innerHTML =
            "<h2>Time Up!</h2><h3>Score: " +
            score + "/" + quiz.length + "</h3>";
    }
}, 1000);

showQuestion();
