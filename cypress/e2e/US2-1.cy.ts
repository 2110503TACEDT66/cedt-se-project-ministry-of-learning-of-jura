import promisify from "cypress-promise"
import { expect } from "chai"
describe('Test Point Decrease Correct', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  })
  it("correct" , async () => {
    cy.get("body > div > a.h-full.m-2.radius-2 > button").click() ; // sign in button
    // cy.get('text[id=":r0:"]') 
    cy.get("#\\:r0\\:").type("user@gmail.com") ;
    cy.get("#\\:r1\\:").type("12345678") ;
    cy.get("body > main > div > form > button").click() ;
    cy.get("body > div > img").click() ;
    cy.get("body > div.MuiDrawer-root.MuiDrawer-modal.MuiModal-root.css-1u2w381-MuiModal-root-MuiDrawer-root > div.MuiPaper-root.MuiPaper-elevation.MuiPaper-elevation16.MuiDrawer-paper.MuiDrawer-paperAnchorRight.css-1160xiw-MuiPaper-root-MuiDrawer-paper > div > a:nth-child(1) > li").click() ;
    cy.get("body > div.flex.items-center.justify-around.text-black.m-2 > div.flex.items-center.justify-center.gap-2.flex-col > a").click() ;
    let necessityData : number;
    let secondData : number;
    const firstPoint = await promisify(cy.get("body > div.flex.items-center.justify-around.text-black.m-2 > div.flex.flex-col.self-start.h-fit.items-center.justify-center.gap-3.p-2.rounded-2xl.bg-white.border-gray.border-2.border-solid > div:nth-child(4) > p").invoke('html').then(str=>{
      cy.log(str) ;
      const data = str.split(' ') ;
      necessityData = parseInt(data[data.length - 1]) ;
    }))
    // .as("firstPoint") ;
    // cy.wait("@firstPoint" , { timeout : 1000}) ;
    
    
    cy.get("body > main > div > form > div.MuiAutocomplete-root.MuiAutocomplete-hasClearIcon.css-gieija-MuiAutocomplete-root > div > div").type("no image naja") ;
    cy.get("body > div").click();
    cy.get("body > main > div > form > div.MuiFormControl-root.MuiTextField-root.css-z3c6am-MuiFormControl-root-MuiTextField-root > div > input").focus().type("04/30/2024") ;
    cy.get("body > main > div > form > div:nth-child(3) > div").click() ;
    cy.get("#menu- > div.MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation8.MuiPopover-paper.MuiMenu-paper.MuiMenu-paper.css-3dzjca-MuiPaper-root-MuiPopover-paper-MuiMenu-paper").click() ;
    // cy.get("body > div").click();
    cy.get("body > main > div > form > div:nth-child(4) > div").click() ;
    cy.get("#menu- > div.MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation8.MuiPopover-paper.MuiMenu-paper.MuiMenu-paper.css-3dzjca-MuiPaper-root-MuiPopover-paper-MuiMenu-paper").click() ;
    // cy.get("body > div").click();
    cy.get("#checked-checkbox").click() ;
    cy.get("body > main > div > form > button").click() ;
    const secondaryPoint = await promisify(cy.get("body > div.flex.items-center.justify-around.text-black.m-2 > div.flex.flex-col.self-start.h-fit.items-center.justify-center.gap-3.p-2.rounded-2xl.bg-white.border-gray.border-2.border-solid > div:nth-child(4) > p").invoke('html').then(str=> {
      let data = str.split(' ') ;
      secondData = parseInt(data[data.length - 1]) ;
      // expect(necessityData).toBeLessThan(secondData) ;
      // cy.log(secondData) ;
    })) ;
    // expect(firstPoint).toBe(secondaryPoint) ;
    // cy.log(String(necessityData!),secondData!)
    // expect(necessityData!).toBeLessThan(secondData!) ;
    expect(necessityData!>secondData!).to.equal(true);
    
  })
})