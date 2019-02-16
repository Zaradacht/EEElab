async function f() {
  promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("done!"), 1000);
  });
  console.log("next line is await");

  result = await promise; // wait till the promise resolves (*)
  console.log("The line following the await");
  return promise;
}

console.log(f().then(resolve => console.log(resolve)));
