export const validateEmail = (email: string) => {
  console.log(email);
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  if (reg.test(email) === false) {
    console.log("Email is Not Correct");
    return false;
  }
  else {
    return true
  }
}