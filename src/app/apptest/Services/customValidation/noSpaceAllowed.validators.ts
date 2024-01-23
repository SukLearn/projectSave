import { AbstractControl, FormControl } from '@angular/forms';

export const noSpaceAllowed = (control: FormControl) => {
  if (control.value != null && control.value.indexOf(' ') != -1) {
    return { noSpaceAllowed: true };
  }
  return null;
};
// IN PROCESS
// export class CustomValidators {
//   static noSpaceAllowed(control: FormControl) {
//     if (control.value != null && control.value.indexOf(' ') != -1) {
//       return { noSpaceAllowed: true };
//     }
//     return null;
//   }

//     static checkUserName(control: AbstractControl): Promise<any> {
//       return userNameAllowed(control.value);
//     }
//   }
//   function userNameAllowed(username: string) {
//     const takenUserNames = ['admin', 'superuser', 'user'];

//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         if (takenUserNames.includes(username.toLowerCase())) {
//           resolve({ checkUsername: true });
//         } else {
//           resolve(null);
//         }
//       }, 5000);
//     });
//   }
