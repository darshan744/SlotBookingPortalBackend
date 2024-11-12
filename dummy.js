const date = new Date('Nov 5')
date.setFullYear(new Date().getFullYear())
console.log(date.toLocaleDateString('en-CA'));