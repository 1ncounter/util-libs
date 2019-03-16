import Promise from './index';

const promise = new Promise(resolve => {
  console.log('create');

  setTimeout(() => {
    console.log('1000');
  }, 1000);

  resolve(1);
});

promise
  .then(value => {
    return value;
  })
  .then(value => {
    console.log(value);
  });
