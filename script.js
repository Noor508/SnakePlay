$(document).ready(function () {
    const canvas = $("#gameCanvas")[0];
    const ctx = canvas.getContext("2d");
    const gridSize = 20;
    const canvasSize = 400;
    let snake = [{ x: gridSize * 2, y: 0 }, { x: gridSize, y: 0 }, { x: 0, y: 0 }];
    let direction = "RIGHT";
    let food = { x: gridSize * 5, y: gridSize * 5 };
    let score = 0;

    // Draw snake
    function drawSnake() {
        ctx.clearRect(0, 0, canvasSize, canvasSize);
        for (let i = 0; i < snake.length; i++) {
            ctx.fillStyle = i === 0 ? "#32CD32" : "lime";
            ctx.shadowColor = "rgba(0, 255, 0, 0.8)";
            ctx.shadowBlur = 5;
            ctx.fillRect(snake[i].x, snake[i].y, gridSize, gridSize);
        }
    }

    // Draw food
    function drawFood() {
        ctx.fillStyle = "red";
        ctx.shadowColor = "rgba(255, 0, 0, 0.8)";
        ctx.shadowBlur = 5;
        ctx.fillRect(food.x, food.y, gridSize, gridSize);
    }

    // Move snake
    function moveSnake() {
        const head = { x: snake[0].x, y: snake[0].y };
        if (direction === "LEFT") head.x -= gridSize;
        if (direction === "UP") head.y -= gridSize;
        if (direction === "RIGHT") head.x += gridSize;
        if (direction === "DOWN") head.y += gridSize;

        snake.unshift(head);

        // Check if the snake has eaten the food
        if (head.x === food.x && head.y === food.y) {
            score++;
            $("#score").text(score);
            placeFood();
        } else {
            snake.pop();
        }
    }

    // Place food in a random location
    function placeFood() {
        food.x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
        food.y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;

        // Make sure food does not appear on the snake
        for (let i = 0; i < snake.length; i++) {
            if (food.x === snake[i].x && food.y === snake[i].y) {
                placeFood();
            }
        }
    }

    // Check collision
    function checkCollision() {
        const head = snake[0];

        // Check wall collision
        if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
            return true;
        }

        // Check self collision
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true;
            }
        }

        return false;
    }

    // Game over
    function gameOver() {
        clearInterval(gameInterval);
        alert("Game Over! Your score is " + score);
        location.reload();
    }

    // Change direction
    $(document).keydown(function (e) {
        const key = e.which;
        if (key === 37 && direction !== "RIGHT") direction = "LEFT";
        if (key === 38 && direction !== "DOWN") direction = "UP";
        if (key === 39 && direction !== "LEFT") direction = "RIGHT";
        if (key === 40 && direction !== "UP") direction = "DOWN";
    });

    // Game loop
    function gameLoop() {
        moveSnake();
        if (checkCollision()) {
            gameOver();
        } else {
            drawSnake();
            drawFood();
        }
    }

    // Start game
    const gameInterval = setInterval(gameLoop, 100);
});