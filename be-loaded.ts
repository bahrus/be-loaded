async function doImport(){
    const stylesheet = await import('./test.css', {
        assert: { type: 'css' }
    }); 
    console.log(stylesheet);
}
//https://davidwalsh.name/async-function-class

const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
const doImport2 = new AsyncFunction('return await import("./test.css", {assert: {type: "css"}});');

const style = await doImport2();
console.log(style);

