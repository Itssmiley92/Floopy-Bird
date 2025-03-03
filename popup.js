document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    let bird = { 
        x: 50, 
        y: 150, 
        width: 20, 
        height: 20, 
        gravity: 0.3, 
        lift: -6.4, 
        velocity: 0 
    };
    
    let pipes = [];
    let frame = 0;
    let score = 0;
    let highScore = localStorage.getItem("highScore") || 0;
    let gameOver = false;
    let pipeSpeed = 2;
    let gameLoopId; // Store the animation frame ID

    // Play button creation
    const playButton = document.createElement("button");
    playButton.innerText = "Play";
    Object.assign(playButton.style, {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: "36px",
        padding: "20px 40px",
        cursor: "pointer",
        backgroundColor: "#ffcc00",
        border: "none",
        borderRadius: "10px",
        color: "#333",
        fontWeight: "bold",
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
        transition: "all 0.3s ease",
        textAlign: "center",
    });
    document.body.appendChild(playButton);

    // Play Again Button
    const playAgainButton = document.createElement("button");
    playAgainButton.innerText = "Play Again";
    Object.assign(playAgainButton.style, {
        position: "absolute",
        top: "calc(50% + 40px)",
        left: "50%",
        transform: "translateX(-50%)",
        fontSize: "24px",
        padding: "15px 30px",
        cursor: "pointer",
        display: "none",
        backgroundColor: "#ffcc00",
        border: "none",
        borderRadius: "10px",
        color: "#333",
        fontWeight: "bold",
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
        transition: "all 0.3s ease",
        textAlign: "center",
    });
    document.body.appendChild(playAgainButton);

    // Event listeners
    playAgainButton.addEventListener("click", resetGame);
    playButton.addEventListener("click", startGame);
    document.addEventListener("keydown", function () {
        if (!gameOver) bird.velocity = bird.lift;
    });

    // Function to reset the game
    function resetGame() {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }
        score = 0;
        pipes = [];
        bird.y = 150;
        bird.velocity = 0;
        gameOver = false;
        frame = 0;
        pipeSpeed = 2;
        playAgainButton.style.display = "none"; 
        playButton.style.display = "none";
        startGame(); // Restart the game properly
    }

    // Function to start the game
    function startGame() {
        playButton.style.display = "none";
        gameOver = false;
        frame = 0;
        pipes = [];
        bird.y = 150;
        bird.velocity = 0;
        score = 0;
        pipeSpeed = 2;
        gameLoop();
    }

    // Update game elements
    function update() {
        if (gameOver) return;

        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
            gameOver = true;
        }

        if (frame % 90 === 0) {
            let pipeHeight = Math.floor(Math.random() * 200) + 50;
            let gap = 150;
            pipes.push({ x: canvas.width, y: 0, width: 40, height: pipeHeight });
            pipes.push({ x: canvas.width, y: pipeHeight + gap, width: 40, height: canvas.height - pipeHeight - gap });
        }

        pipes.forEach(pipe => pipe.x -= pipeSpeed);
        pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);

        pipes.forEach(pipe => {
            if (
                bird.x < pipe.x + pipe.width &&
                bird.x + bird.width > pipe.x &&
                bird.y < pipe.y + pipe.height &&
                bird.y + bird.height > pipe.y
            ) {
                gameOver = true;
            }
        });

        // Increment score when bird passes through pipes
        if (pipes.length && bird.x > pipes[0].x + pipes[0].width) {
            score++;
            pipes.shift();
        }

        // Increase the speed of pipes every 10 points
        if (score % 10 === 0 && score > 0) {
            pipeSpeed = 2 + Math.floor(score / 10);
        }
    }

    // Draw pipes
    function drawPipes() {
        ctx.fillStyle = "green";
        pipes.forEach(pipe => {
            ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
        });
    }

    // Draw bird
    function drawBird() {
        ctx.fillStyle = "yellow";
        ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
    }

    // Draw the score
    function drawScore() {
        ctx.fillStyle = "#fff";
        ctx.font = "24px Arial";
        ctx.fillText("Score: " + score, 10, 30);
        ctx.fillText("High Score: " + highScore, 10, 60);
    }

    // Draw game over screen
    function drawGameOverScreen() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.fillText("Game Over!", canvas.width / 2 - 100, canvas.height / 2 - 40);
        ctx.font = "24px Arial";
        ctx.fillText("Your Score: " + score, canvas.width / 2 - 80, canvas.height / 2);
        ctx.fillText("High Score: " + highScore, canvas.width / 2 - 90, canvas.height / 2 + 30);
        
        playAgainButton.style.display = "block"; // Show the play again button
    }

    // Draw function for the game
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBird();
        drawPipes();
        drawScore();

        if (gameOver) {
            drawGameOverScreen();
            return; // Stop drawing if game over
        }
    }

    // Main game loop
    function gameLoop() {
        if (gameOver) {
            cancelAnimationFrame(gameLoopId);
            return;
        }
        update();
        draw();
        frame++;
        gameLoopId = requestAnimationFrame(gameLoop);
    }

    // Show Play button initially
    playButton.style.display = "block";
});
