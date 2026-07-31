let nodes = [];
const numNodes = 80; // Quantidade ajustada para performance
const connectionDistance = 150;

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-container'); // Injeta o canvas na div correta
    
    // Inicializa os nós (ideias/conceitos)
    for (let i = 0; i < numNodes; i++) {
        nodes.push(new Node());
    }
}

function draw() {
    clear(); // Fundo transparente para o CSS gerenciar a cor
    
    // Atualiza e desenha as conexões primeiro (ficam no fundo)
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            nodes[i].connect(nodes[j]);
        }
    }
    
    // Atualiza e desenha os nós (partículas)
    for (let node of nodes) {
        node.update();
        node.display();
    }
}

// Redimensionamento responsivo
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// Classe que define cada partícula de pensamento
class Node {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.vel = createVector(random(-0.5, 0.5), random(-0.5, 0.5));
        this.size = random(2, 4);
    }
    
    update() {
        this.pos.add(this.vel);
        
        // Rebote suave nas bordas
        if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
        if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;
    }
    
    display() {
        noStroke();
        fill(255, 255, 255, 100);
        circle(this.pos.x, this.pos.y, this.size);
    }
    
    connect(otherNode) {
        let d = dist(this.pos.x, this.pos.y, otherNode.pos.x, otherNode.pos.y);
        
        // Conexão entre nós próximos
        if (d < connectionDistance) {
            // A força da conexão aumenta se o mouse estiver próximo (representando a intenção/foco)
            let mouseDist = dist(mouseX, mouseY, this.pos.x, this.pos.y);
            let alpha = map(d, 0, connectionDistance, 100, 0);
            
            // Intensifica a linha se o mouse estiver perto da rede
            if (mouseDist < 200) {
                alpha += map(mouseDist, 0, 200, 100, 0);
            }
            
            stroke(255, 255, 255, alpha);
            strokeWeight(0.5);
            line(this.pos.x, this.pos.y, otherNode.pos.x, otherNode.pos.y);
        }
    }
}
