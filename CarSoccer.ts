import * as THREE from 'three'
import { GraphicsApp } from './GraphicsApp'
import { Car } from './Car'
import { Ball } from './Ball';

export class CarSoccer extends GraphicsApp
{
    private inputVector : THREE.Vector2;
    private car : Car;
    private ball : Ball; 
    //private boxDimensions : THREE.Vector3;

    constructor()
    {
        // Pass in the aspect ratio as a parameter
        super(2);
        
        // Initialize all member variables here
        // This will help prevent runtime errors
        this.inputVector = new THREE.Vector2();
        this.car = new Car(new THREE.Vector3(0, 1, 45), new THREE.Vector3(4, 4, 5), 4);
      //  this.ball = new Ball(new THREE.Vector3(0, 2.6, 0), 2.6);
        this.ball = new Ball(new THREE.Vector3(0, 30, 0), 2.6);

       // this.boxDimensions = new THREE.Vector3(100, 30, 120);
    }

    createScene() : void
    {
        // Setup camera
        this.camera.position.set(0, 63, 73);
        this.camera.lookAt(0, 0, 0);
        this.camera.up.set(0, 1, 0);

        // Create an ambient light
        var ambientLight = new THREE.AmbientLight('white', .3);
        this.scene.add(ambientLight);

        // Create a directional light
        var directionalLight = new THREE.DirectionalLight('white', .6);
        directionalLight.position.set(0, 2, 1);
        this.scene.add(directionalLight)

        // Load a texture and set it as the background
        this.scene.background = new THREE.TextureLoader().load('assets/crowd.png')

        // Create the green field material
        var fieldMaterial = new THREE.MeshLambertMaterial();
        fieldMaterial.color = new THREE.Color(16/255, 46/255, 9/255);

        // Create a field mesh
        var field = new THREE.Mesh(new THREE.BoxGeometry(100, 1, 120), fieldMaterial);
        field.position.set(0, -.501, 0);
        this.scene.add(field);

        // Load in the pitch image and create a texture
        var pitchMaterial = new THREE.MeshLambertMaterial();
        pitchMaterial.map = new THREE.TextureLoader().load('assets/pitch.png');

        // Create the mesh for the pitch
        var pitch = new THREE.Mesh(new THREE.BoxGeometry(80, 1, 100), pitchMaterial);
        pitch.position.set(0, -0.5, 0);
        this.scene.add(pitch);

        // create the box 
        //var boundary_box = new THREE.Line(new THREE.BoxGeometry(this.boxDimensions.x, this.boxDimensions.y, this.boxDimensions.z,1,1,1));
       // var box_material = new THREE.LineBasicMaterial;
        const box_points = [];
        box_points.push(new THREE.Vector3(-40,.5,50));
        box_points.push(new THREE.Vector3(-40,35.5,50));
        box_points.push(new THREE.Vector3(40,35.5,50));
        box_points.push(new THREE.Vector3(40,.5,50));
        box_points.push(new THREE.Vector3(40,35.5,50));
        box_points.push(new THREE.Vector3(-40,35.5,50));
        box_points.push(new THREE.Vector3(-40,35.5,-50));
        box_points.push(new THREE.Vector3(-40,.5,-50));
        box_points.push(new THREE.Vector3(-40,35.5,-50));
        box_points.push(new THREE.Vector3(-40,35.5,50));
        box_points.push(new THREE.Vector3(-40,35.5,-50));
        box_points.push(new THREE.Vector3(40,35.5,-50));
        box_points.push(new THREE.Vector3(40,.5,-50));
        box_points.push(new THREE.Vector3(40,35.5,-50));
        box_points.push(new THREE.Vector3(40,35.5,50));


        const borderBoxGeometry = new THREE.BufferGeometry().setFromPoints( box_points );

        var boundary_box = new THREE.Line(borderBoxGeometry);
       // boundary_box.position.set(0,15,0);
        this.scene.add(boundary_box);

        const goal_points1 = [];
        for(var i = -10; i < 10; i+= 1){
            if(i % 2 == 0){
                goal_points1.push(new THREE.Vector3(i, .5, 50));
                goal_points1.push(new THREE.Vector3(i, 10.5, 50));
            }else {
                goal_points1.push(new THREE.Vector3(i, 10.5, 50));
                goal_points1.push(new THREE.Vector3(i, .5, 50));
            }
        }
        for(var i = 0; i < 11; i += 1){
            if(i % 2 ==0){
            goal_points1.push(new THREE.Vector3(-10, i, 50));
            goal_points1.push(new THREE.Vector3(10, i, 50));
            }else{
                goal_points1.push(new THREE.Vector3(10, i, 50));
                goal_points1.push(new THREE.Vector3(-10, i, 50));

            }
        }
       
        const goalBox1Geometry = new THREE.BufferGeometry().setFromPoints(goal_points1);
        var goalBox1 = new THREE.Line(goalBox1Geometry);
        var goalBox2 = new THREE.Line(goalBox1Geometry);
        goalBox2.position.set(0,0,-100);
        this.scene.add(goalBox1);
        this.scene.add(goalBox2);

        // Add the car and ball to the scene
        this.scene.add(this.car);
        this.scene.add(this.ball);
    }

    update(deltaTime : number) : void
    {
        // Speed in meters/sec
        const carMaxSpeed = 50;

        // constants for acceleration 
        var acceleration = 0;
        
        //forward and backward changes accel
        if(this.inputVector.y == -1 && this.car.velocity.z < carMaxSpeed){
            acceleration = 60;
        }else if (this.inputVector.y == 1 && this.car.velocity.z > -carMaxSpeed){
            acceleration = -60;
        }else if (this.inputVector.y == 0){  // && this.car.velocity.z != 0){
            acceleration = 0;
        }
        this.car.velocity.z= this.car.velocity.z + (acceleration * deltaTime);

        //deceleration due to friction
        const friction = 5
        if (this.car.velocity.z > 0){
            this.car.velocity.z -= friction * deltaTime;
        }else if (this.car.velocity.z < 0){
            this.car.velocity.z += friction * deltaTime;
        }

        //lets do turning:
        const turningRate = .04;
        //left turn
        if(this.inputVector.x == -1 &&  (this.car.velocity.z > 1 || this.car.velocity.z < -1)){
            this.car.rotateY(Math.PI/2 * deltaTime * turningRate * -this.car.velocity.z);
        }
        //right turn
        if(this.inputVector.x == 1 &&  (this.car.velocity.z > 1 || this.car.velocity.z < -1)){
            this.car.rotateY(Math.PI/2 * deltaTime * turningRate * this.car.velocity.z);
        }


        //car ball collision time baby
        var radialSum = this.car.collisionRadius + this.ball.radius;
        if(this.ball.position.distanceTo(this.car.position) < radialSum ){

        
            
            var relativeVelocity = new THREE.Vector3(this.ball.velocity.x - this.car.velocity.x,
                                                    this.ball.velocity.y-this.car.velocity.y,
                                                    this.ball.velocity.z-this.car.velocity.z);
           // relativeVelocity.subVectors(this.ball.velocity, this.car.velocity);
            //compute relative velocity, vrel = vball - vcar
            //reset ball position to outside of car
            


                                       
            this.ball.position.x += -relativeVelocity.x * deltaTime;
            this.ball.position.y += -relativeVelocity.y * deltaTime;
            this.ball.position.z += -relativeVelocity.z * deltaTime;
            
            /*
            this.ball.position.set(this.ball.position.x - relativeVelocity.x * deltaTime,
                this.ball.position.y - relativeVelocity.y * deltaTime,
                this.ball.position.z - relativeVelocity.z * deltaTime);
                */


            var collisionNormal = new THREE.Vector3(this.ball.position.x - this.car.position.x,
                                                    this.ball.position.y - this.car.position.y,
                                                    this.ball.position.z - this.car.position.z).normalize();
            
            var relativeVelocity2 = relativeVelocity;

            var collisionNormal2 = collisionNormal;
            var dotProduct = collisionNormal.dot(relativeVelocity2);
            var reflectedVelocity = relativeVelocity.sub(collisionNormal2.multiplyScalar(2 * dotProduct));
            

            this.ball.velocity.set(this.car.velocity.x + reflectedVelocity.x,this.car.velocity.y + reflectedVelocity.y, this.car.velocity.z + reflectedVelocity.z);
            //reflect the rel velocity about the collision normal
            //set new ball.velocity, vball = vcar+vrel
        }




        this.car.update(deltaTime);

        // Update the ball physics
        this.ball.update(deltaTime);

        // Update the ball shadow
        this.ball.updateShadow();

        //check if the balls in the goal, 
        if((this.ball.position.z < -50 +this.ball.radius 
            || this.ball.position.z > 50 - this.ball.radius)
            && this.ball.position.y < 10.5 
            && this.ball.position.x < 10 
            && this.ball.position.x > -10){
                this.car.reset();
                this.ball.reset();
            }

    }

    // Event handler for keyboard input
    // You don't need to modify this function
    onKeyDown(event: KeyboardEvent): void 
    {
        if(event.key == 'w' || event.key == 'ArrowUp')
            this.inputVector.y = 1;
        else if(event.key == 's' || event.key == 'ArrowDown')
            this.inputVector.y = -1;
        else if(event.key == 'a' || event.key == 'ArrowLeft')
            this.inputVector.x = -1;
        else if(event.key == 'd' || event.key == 'ArrowRight')
            this.inputVector.x = 1;
        else if(event.key == ' ')
        {
            this.car.reset();
            this.ball.reset();
        }
    }

    // Event handler for keyboard input
    // You don't need to modify this function
    onKeyUp(event: KeyboardEvent): void 
    {
        if((event.key == 'w' || event.key == 'ArrowUp') && this.inputVector.y == 1)
            this.inputVector.y = 0;
        else if((event.key == 's' || event.key == 'ArrowDown') && this.inputVector.y == -1)
            this.inputVector.y = 0;
        else if((event.key == 'a' || event.key == 'ArrowLeft')  && this.inputVector.x == -1)
            this.inputVector.x = 0;
        else if((event.key == 'd' || event.key == 'ArrowRight')  && this.inputVector.x == 1)
            this.inputVector.x = 0;
    }
}
