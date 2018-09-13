requirejs.config({
    baseUrl: './js',
    waitSeconds: 20,
    //This is like saying "stuff in this window module is dependent upon the content of deps, 
    //the definitions of which can be found at the baseUrl. And then "Unless specified in 'paths'. 
    //In which case require will look there for any exports matching that name.
    deps: ["typescript-collections"],
    paths:{
        "typescript-collections":"../../node_modules/typescript-collections/dist/lib/umd"
    }

    // , urlArgs: "t=20160320000000" //flusing cache, do not use in production
});

