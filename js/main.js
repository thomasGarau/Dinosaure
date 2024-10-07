import { Dinosaure } from "./Dinosaure.js";
import { Environement } from "./Environement.js";
import { Level1 } from "./LevelState.js";
const level = new Level1();
let dino = new Dinosaure(level);
let env = new Environement(level);
const canvas = document.querySelector('#monCanvas');
const ctx = canvas.getContext('2d');
const spriteSheet = new Image();
const hi = document.querySelector("#highScore");
spriteSheet.src = './ressource/sprite.webp';
level.init(env, dino);
let addScoreInterval = null;
let lastUpdateTime = 0;
const boutonRejouer = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 100,
    height: 100
};
let jeuTermine = false;
// On s'assure que le canvas est chargé dans le DOM avant de créer le dinosaure
document.addEventListener('DOMContentLoaded', () => {
    hi.innerHTML = localStorage.getItem('scoreMax') ?? "0000";
    // Démarrer la boucle de jeu
    requestAnimationFrame(gameLoop);
    addScoreInterval = setInterval(() => {
        dino.gagnerPoint();
        dino.displayScore();
    }, 100);
    env.spawnObstacleLoop();
    env.spawnCloudLoop();
});
// Gérer les entrées de l'utilisateur
document.addEventListener('keydown', (e) => {
    console.log(dino.etatCourant);
    if (dino.etatCourant === 1) {
        switch (e.code) {
            // Espace pour sauter
            case 'Space':
                dino.etatCourant = 0;
                dino.positionY += 5;
                break;
            // Flèche vers le bas pour s'accroupir
            case 'ArrowDown':
                dino.etatCourant = 2;
                break;
        }
    }
});
// lorsque l'utilisateur releve la touche on remet le dinosaure en position de course
document.addEventListener('keyup', (e) => {
    switch (e.code) {
        // Flèche vers le bas pour s'accroupir
        case 'ArrowDown':
            if (dino.etatCourant !== 0) {
                dino.etatCourant = 1;
                dino.seRedresser();
                break;
            }
    }
});
canvas.addEventListener('click', function (event) {
    if (jeuTermine) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        // Vérifier si le clic est sur le bouton rejouer
        if (x >= boutonRejouer.x && x <= boutonRejouer.x + boutonRejouer.width &&
            y >= boutonRejouer.y && y <= boutonRejouer.y + boutonRejouer.height) {
            redemarrerJeu();
        }
    }
});
function gameLoop(timestamp) {
    // Calculer le temps écoulé depuis la dernière mise à jour
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (timestamp - lastUpdateTime > dino.updateInterval) {
        dino.updateSpriteDisplayed();
        lastUpdateTime = timestamp;
    }
    dino.display();
    env.drawGround();
    let collision = env.listObstacle.some(obstacle => {
        return dino.detecterCollision(obstacle);
    });
    if (collision) {
        console.log("Collision détectée, le joueur a perdu !");
        clearInterval(addScoreInterval);
        displayEndGame();
        // Arrêter la boucle de jeu
        return;
    }
    // Demander la prochaine frame d'animation
    requestAnimationFrame(gameLoop);
}
function displayEndGame() {
    jeuTermine = true;
    const scoreMax = parseInt(localStorage.getItem('scoreMax') ?? "0");
    if (dino.scoreDino > scoreMax) {
        localStorage.setItem('scoreMax', dino.scoreDino.toString());
    }
    ctx.drawImage(spriteSheet, 1293, // Coordonnée X de départ sur l'image source
    25, // Coordonnée Y de départ sur l'image source
    386, // Largeur de la zone de l'image source à dessiner
    50, // Hauteur de la zone de l'image source à dessiner
    canvas.width / 2 - 193, // Coordonnée X sur le canvas où l'image sera dessinée
    canvas.height / 2 - 25, // Coordonnée Y sur le canvas où l'image sera dessinée
    500, // Largeur de l'image sur le canvas
    50 // Hauteur de l'image sur le canvas
    );
    ctx.drawImage(spriteSheet, 0, // Coordonnée X de départ sur l'image source
    0, // Coordonnée Y de départ sur l'image source
    70, // Largeur de la zone de l'image source à dessiner
    100, // Hauteur de la zone de l'image source à dessiner
    canvas.width / 2, // Coordonnée X sur le canvas où l'image sera dessinée
    canvas.height / 2, // Coordonnée Y sur le canvas où l'image sera dessinée
    70, // Largeur de l'image sur le canvas
    100 // Hauteur de l'image sur le canvas
    );
}
function redemarrerJeu() {
    // Réinitialisez l'état du jeu
    hi.innerHTML = localStorage.getItem('scoreMax') ?? "0000";
    dino = new Dinosaure(level);
    env = new Environement(level);
    level.init(env, dino);
    addScoreInterval = setInterval(() => {
        dino.gagnerPoint();
        dino.displayScore();
    }, 100);
    env.spawnObstacleLoop();
    env.spawnCloudLoop();
    jeuTermine = false;
    requestAnimationFrame(gameLoop);
}
