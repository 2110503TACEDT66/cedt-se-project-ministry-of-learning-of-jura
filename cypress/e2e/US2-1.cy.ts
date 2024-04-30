import promisify from "cypress-promise"
import { expect } from "chai"
describe('Test Point Decrease Correct', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login')
  })
  it("correct" , async () => {
    //email
    cy.get("div.MuiFormControl-root:nth-child(2) > div:nth-child(1) > input").type("user@gmail.com") ; 

    //password
    cy.get("div.MuiFormControl-root:nth-child(3) > div:nth-child(1) > input").type("12345678") ; 

    // login
    cy.get("body > main > div > form > button").click() ;

    // profile
    cy.get("body > div > img").click() ;

    // my profile
    cy.get("body > div.MuiDrawer-root.MuiDrawer-modal.MuiModal-root.css-1u2w381-MuiModal-root-MuiDrawer-root > div.MuiPaper-root.MuiPaper-elevation.MuiPaper-elevation16.MuiDrawer-paper.MuiDrawer-paperAnchorRight.css-1160xiw-MuiPaper-root-MuiDrawer-paper > div > a:nth-child(1) > li").click() ;

    let necessityData : number;
    let secondData : number;

    // point
    cy.get("body > div.flex.items-center.justify-around.text-black.m-2 > div.flex.flex-col.self-start.h-fit.items-center.justify-center.gap-3.p-2.rounded-2xl.bg-white.border-gray.border-2.border-solid > div:nth-child(4) > p").invoke('html').then(str=>{
      const data = str.split(' ') ;
      necessityData = parseInt(data[data.length - 1]) ;
    })

    // reserve now
    cy.get("body > div.flex.items-center.justify-around.text-black.m-2 > div.flex.items-center.justify-center.gap-2.flex-col > a").click() ;
    
    // restaurant name

    cy.get("body > main > div > form > div.MuiAutocomplete-root.MuiAutocomplete-hasClearIcon.css-gieija-MuiAutocomplete-root > div > div").type("Sushi SUS") ;
    // top menu
    cy.get("body > div").click();

    // reservation date
    cy.get("body > main > div > form > div.MuiFormControl-root.MuiTextField-root.css-z3c6am-MuiFormControl-root-MuiTextField-root > div > input").focus().type("04/30/2024") ;

    // reservation period
    cy.get("body > main > div > form > div:nth-child(3) > div").click() ;

    // reservation period option
    cy.get("#menu- > div.MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation8.MuiPopover-paper.MuiMenu-paper.MuiMenu-paper.css-3dzjca-MuiPaper-root-MuiPopover-paper-MuiMenu-paper").click() ;
    
    // discount
    cy.get("body > main > div > form > div:nth-child(4) > div").click() ;

    // discount options
    cy.get("#menu- > div.MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation8.MuiPopover-paper.MuiMenu-paper.MuiMenu-paper.css-3dzjca-MuiPaper-root-MuiPopover-paper-MuiMenu-paper").click() ;

    // welcome drink
    cy.get("#checked-checkbox").click() ;

    // reserve
    cy.get("body > main > div > form > button").click() ;
    
    // point
    cy.get("body > div.flex.items-center.justify-around.text-black.m-2 > div.flex.flex-col.self-start.h-fit.items-center.justify-center.gap-3.p-2.rounded-2xl.bg-white.border-gray.border-2.border-solid > div:nth-child(4) > p").invoke('html').then(str=> {
      let data = str.split(' ') ;
      secondData = parseInt(data[data.length - 1]) ;
      expect(necessityData!>secondData!).to.equal(true);
    }) ;
  })
})