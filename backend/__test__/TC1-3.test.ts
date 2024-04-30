import { describe, expect, test, beforeEach, beforeAll, afterAll, jest } from '@jest/globals';
// import supertest from "supertest"
import request from "supertest"
import path from "path"
import { app } from '../src/app';
import mongoose from 'mongoose';
import cronTask from "../src/utils/reservationScheduler"

describe("TC1-3", () => {
  let token: string;
  let validRestaurantId = "66309e45552b26689dba39b3";
  let restaurantWithNoImageId = "6630e109bfc36e22961a3530";
  
  beforeAll(async () => {
    const emailAndPass = {
      email: "ARO@gmail.com",
      password: "12345678"
    }

    let result: any = await request(app)
      .post("/api/v1/auth/login")
      .send(emailAndPass)
      .set("Content-Type", "application/json")
      .set('Accept', 'application/json')
    expect(result.body.success).toBe(true);
    token = result.body.token;
    let uploadImageResult = await request(app)
      .post(`/api/v1/restaurants/${validRestaurantId}/image`)
      .set("Accept", "application/json")
      .attach("image",path.join(__dirname,"../apiFetcher/resource/steak.jpg"))
      .set("Authorization",`Bearer ${token}`)
    expect(uploadImageResult.body.success).toBe(true);
  })

  test("TC1-3-1", async () => {
    let result = await request(app)
      .get(`/api/v1/restaurants/${validRestaurantId}/image`)
    console.log(result.body)
    expect(result.ok).toBe(true);
  })

  test("TC1-3-2", async () => {
    let result = await request(app)
      .get(`/api/v1/restaurants/${restaurantWithNoImageId}/image`)

    expect(result.ok).toBe(false);
  })

  test("TC1-3-3", async () => {
    let result = await request(app)
      .get(`/api/v1/restaurants/gfgdgdgf/image`)

    expect(result.ok).toBe(false);
  })

  test("TC1-3-4", async () => {
    let result = await request(app)
      .get(`/api/v1/restaurants/6630512239cec65d45debb58/image`)

    expect(result.ok).toBe(false);
  })

  afterAll((done) => {
    cronTask.stop();
    mongoose.connection.close();
    done()
  })
})