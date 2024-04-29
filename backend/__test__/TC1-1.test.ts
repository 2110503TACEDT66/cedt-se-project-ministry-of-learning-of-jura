import { describe, expect, test, beforeEach, beforeAll, afterAll , jest } from '@jest/globals';
// import supertest from "supertest"
import request from "supertest"
import path from "path"
import { app } from '../src/app';
import mongoose from 'mongoose';
import cronTask from "../src/utils/reservationScheduler"

const url = "http://localhost:6969"

describe("TC1-1", () => {
  let token: string;
  // let server: any;
  // let request: any;

  beforeAll(async ()=>{
    const emailAndPass = {
      email:"restaurantOwner@gmail.com",
      password:"12345678"
    }
    // server=app.listen(6970)
    // request = supertest.agent(server);
    
    let result: any = await request(app)
      .post("/api/v1/auth/login")
      .send(emailAndPass)
      .set("Content-Type","application/json")
      .set('Accept', 'application/json')
    expect(result.body.success).toBe(true);
    token=result.body.token;
  })
  
  test("TC1-1-1",async () => {
    const result = await request(app)
      .post("/api/v1/restaurants/661d3806aaf6a413b0b076ba/image")
      .set('Accept', 'application/json')
      .attach("image",path.join(__dirname,"../apiFetcher/resource/steak.jpg"))
      .set("Authorization",`Bearer ${token}`)
    expect(result.body.success).toBe(true);
  })

  test("TC1-1-2",async () => {
    const result = await request(app)
      .post("/api/v1/restaurants/661d3806aaf6a413b0b076ba/image")
      .set('Accept', 'application/json')
      .attach("image",path.join(__dirname,"../apiFetcher/resource/30mb_image.jpg"))
      .set("Authorization",`Bearer ${token}`)
    expect(result.body.success).toBe(false);
  })

  afterAll((done)=>{
    cronTask.stop();
    mongoose.connection.close();
    done()
  })
})