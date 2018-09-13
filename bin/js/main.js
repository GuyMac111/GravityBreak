requirejs.config({
    baseUrl: './js',
    waitSeconds: 20,
    deps: ["typescript-collections"],
    paths:{
        "typescript-collections":"../../node_modules/typescript-collections/dist/lib/umd"
    }

    // , urlArgs: "t=20160320000000" //flusing cache, do not use in production
});

