import Utility from "util";

import { Parameter } from "@cloud-technology/parameter";

import { v4 as UUID } from "uuid";

import { Service } from "./../index.js";

const $ = new Service();

describe( "Client Usage", () => {
    const Identifier = UUID();
    const secret = JSON.stringify( {
        Key: "Example-Key",
        Value: "Example-Value"
    } );

    it( "Provisioning", async () => {
        const name = [ "Organization/Environment/Application/Unit-Test", Identifier ].join( "/" );
        const overwrite = false;
        const description = "Secret Parameter Unit Test";

        const creation = await $.create( Parameter.create( name ), description, secret, overwrite );

        console.log( Utility.inspect( creation, { colors: true, showProxy: true, showHidden: true } ) );

        expect( creation ).toBeTruthy();
    } );

    it( "Retrieval", async () => {
        const name = [ "Organization/Environment/Application/Unit-Test", Identifier ].join( "/" );

        const value = await $.get( Parameter.create( name ) );

        console.log( Utility.inspect( value, { colors: true, showProxy: true, showHidden: true } ) );

        expect( value ).toBeTruthy();
    } );

    it( "Assignment", async () => {
        const name = [ "Organization/Environment/Application/Unit-Test", Identifier ].join( "/" );

        const value = await $.get( Parameter.create( name ) );

        console.log( Utility.inspect( value, { colors: true, showProxy: true, showHidden: true } ) );

        expect( value ).toStrictEqual( { Key: "Example-Key", Value: "Example-Value" } );

        expect( value ).toBeTruthy();
    } );

    it( "List", async () => {
        const list = await $.list();

        console.log( Utility.inspect( list, { colors: true, showProxy: true, showHidden: true } ) );

        expect( list ).toBeTruthy();
    } );

    it( "Search", async () => {
        const name = [ "Organization/Environment/Application/Unit-Test", Identifier ].join( "/" );

        const search = await $.search( "name", name );

        console.log( Utility.inspect( search, { colors: true, showProxy: true, showHidden: true } ) );

        expect( typeof search ).toBe("object");
        expect( search ).toBeTruthy();
    } );

    it( "Decommissioning", async () => {
        const name = [ "Organization/Environment/Application/Unit-Test", Identifier ].join( "/" );
        const days = 7;
        const force = false;

        const deletion = await $.delete( Parameter.create( name ), days );

        console.log( Utility.inspect( deletion, { colors: true, showProxy: true, showHidden: true } ) );

        expect( deletion ).toBeTruthy();
    } );
} );
