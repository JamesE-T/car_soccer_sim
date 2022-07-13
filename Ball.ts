import * as THREE from 'three'
import { Car } from './Car';

export class Ball extends THREE.Object3D
{
    readonly radius : number;

    public velocity : THREE.Vector3;
    public initialPosition : THREE.Vector3;
    private shadow : THREE.Mesh;

    constructor(position: THREE.Vector3, radius : number)
    {
        super();
        this.radius = radius;
        this.velocity = new THREE.Vector3();
        this.initialPosition = position;

        // Create the sphere
        var geometry = new THREE.SphereGeometry(this.radius);
        var material = new THREE.MeshPhongMaterial();
        material.color = new THREE.Color(0.335, 0.775, 0.891);
        this.add(new THREE.Mesh(geometry, material));

        // Create a semi-transparent shadow
        var shadowGeometry = new THREE.CircleGeometry(this.radius, 20);
        var shadowMaterial = new THREE.MeshBasicMaterial();
        shadowMaterial.color = new THREE.Color(0, 0, 0); 
        shadowMaterial.transparent = true;
        shadowMaterial.opacity = 0.5;
        this.shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
        this.shadow.rotation.set(-90 * Math.PI / 180, 0, 0);
        this.add(this.shadow);
          
        this.reset();
    }

    public reset() : void
    {
        // Reset the ball's position
        this.position.copy(this.initialPosition);

        // Throw the ball in a random direction
        var randomAngle = Math.random() * Math.PI * 2;
        this.velocity.set(25*Math.cos(randomAngle), 10, 25* Math.sin(randomAngle))
    }

    public update(deltaTime : number) : void
    {
        // Add your code here
        //update the ball position and velocity based on gravity
        const gravity = -1;
        this.velocity.setY(this.velocity.y + gravity);

        const friction = 0.8
        //collision with floor, reflect across normal (0,1,0);
        if(this.position.y < this.radius){
            this.velocity.setY(this.velocity.y - 2*(this.velocity.y * 1)*1)
            this.velocity.multiplyScalar(friction);
            this.position.setY(this.radius);
        }
        //collision with ceiling
        if(this.position.y > 35.5 - this.radius){
            this.velocity.setY(this.velocity.y - 2*(this.velocity.y * 1)*1)
            this.velocity.multiplyScalar(friction);
            this.position.setY(35.5 - this.radius);
        }
        //collision with left wall
        if(this.position.x < -40 + this.radius){
            this.velocity.setX(this.velocity.x - 2*(this.velocity.x * 1)*1)
            this.velocity.multiplyScalar(friction);
            this.position.setX(-40 + this.radius);
        }
        //collision with right wall
        if(this.position.x > 40 - this.radius){
            this.velocity.setX(this.velocity.x - 2*(this.velocity.x * 1)*1)
            this.velocity.multiplyScalar(friction);
            this.position.setX(40 - this.radius);

        }
        // collision with nearest wall
        if(this.position.z < -50 + this.radius){
            this.velocity.setZ(this.velocity.z - 2*(this.velocity.z * 1)*1)
            this.velocity.multiplyScalar(friction);
            this.position.setZ(-50 + this.radius);
        }
        //collision with furthest wall
        if(this.position.z > 50 - this.radius){
            this.velocity.setZ(this.velocity.z - 2*(this.velocity.z * 1)*1)
            this.velocity.multiplyScalar(friction);
            this.position.setZ(50-this.radius);
        }


     
        //change position after all velocity calculations
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
        this.position.z += this.velocity.z * deltaTime;
    }

    public updateShadow() : void
    {
        // Move the shadow down and slightly above the ground
        this.shadow.position.set(0, -this.position.y + 0.01, 0);
    }
}