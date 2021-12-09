async function doImport(){
    const stylesheet = await import('./test.css', {
        assert: { type: 'css' }
    }); 
    console.log(stylesheet);
}

doImport();

