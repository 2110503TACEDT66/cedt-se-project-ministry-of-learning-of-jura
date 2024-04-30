import { describe, expect, test, beforeEach, beforeAll, afterAll , jest } from '@jest/globals';
// import supertest from "supertest"
import request from "supertest"
import path from "path"
import { app } from '../src/app';
import mongoose from 'mongoose';
import cronTask from "../src/utils/reservationScheduler"

describe("TC1-1", () => {
  let token: string;
  let restaurantId = "66309e45552b26689dba39b3" //sushi sus
  
  beforeAll(async ()=>{
    const emailAndPass = {
      email:"ARO@gmail.com",
      password:"12345678"
    }
    
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
      .post(`/api/v1/restaurants/${restaurantId}/image`)
      .set('Accept', 'application/json')
      .attach("image",path.join(__dirname,"../apiFetcher/resource/steak.jpg"))
      .set("Authorization",`Bearer ${token}`)
    expect(result.body.success).toBe(true);
  })

  test("TC1-1-2",async () => {
    const result = await request(app)
      .post(`/api/v1/restaurants/${restaurantId}/image`)
      .set('Accept', 'application/json')
      .attach("image",path.join(__dirname,"../apiFetcher/resource/30mb_image.jpg"))
      .set("Authorization",`Bearer ${token}`)
    expect(result.body.success).toBe(false);
  })

  test("TC1-1-3",async () => {
    const result = await request(app)
      .post(`/api/v1/restaurants/${restaurantId}/image`)
      .set('Accept', 'application/json')
      .set("Authorization",`Bearer ${token}`)
    expect(result.body.success).toBe(false);
  })
  
  test("TC1-1-4",async () => {
    const emailAndPass = {
      email:"restaurantOwner2@gmail.com",
      password:"12345678"
    }
    let loginResult = await request(app)
      .post("/api/v1/auth/login")
      .send(emailAndPass)
      .set("Content-Type","application/json")
      .set('Accept', 'application/json')
    let otherUserToken = loginResult.body.token
    const result = await request(app)
      .post(`/api/v1/restaurants/${restaurantId}/image`)
      .set('Accept', 'application/json')
      .attach("image",path.join(__dirname,"../apiFetcher/resource/steak.jpg"))
      .set("Authorization",`Bearer ${otherUserToken}`)
    expect(result.body.success).toBe(false);
  })
  
  test("TC1-1-5",async () => {
    const result = await request(app)
      .post(`/api/v1/restaurants/gfgdgdgf/image`)
      .set('Accept', 'application/json')
      .attach("image",path.join(__dirname,"../apiFetcher/resource/steak.jpg"))
      .set("Authorization",`Bearer ${token}`)
    expect(result.body.success).toBe(false);
  })
  
  test("TC1-1-6",async () => {
    const result = await request(app)
      .post(`/api/v1/restaurants/6630512239cec65d45debb58/image`)
      .set('Accept', 'application/json')
      .attach("image",path.join(__dirname,"../apiFetcher/resource/steak.jpg"))
      .set("Authorization",`Bearer ${token}`)
    expect(result.body.success).toBe(false);
  })

  afterAll((done)=>{
    cronTask.stop();
    mongoose.connection.close();
    done()
  })
})