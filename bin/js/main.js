requirejs.config({
    baseUrl: './js',
    waitSeconds: 20,
    deps: [''],
    paths:{
        "typescript-collections":"../../node_modules/typescript-collections/dist/lib/index" 
    }

    // , urlArgs: "t=20160320000000" //flusing cache, do not use in production
});

