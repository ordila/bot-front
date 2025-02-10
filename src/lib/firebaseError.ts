export function getFirebaseErrorMessage(errorCode: string) {
  switch (errorCode) {
    case "auth/invalid-email":
      return "Неправильний формат email!";
    case "auth/user-not-found":
      return "Користувача з таким email не знайдено!";
    case "auth/wrong-password":
      return "Неправильний пароль!";
    case "auth/email-already-in-use":
      return "Цей email вже зареєстрований!";
    case "auth/weak-password":
      return "Пароль має бути щонайменше 6 символів!";
    case "auth/missing-password":
      return "Введіть пароль!";
    case "auth/too-many-requests":
      return "Забагато невдалих спроб! Спробуйте пізніше.";
    case "auth/invalid-credential":
      return "Неправильний логін або пароль!";
    default:
      return "Сталася невідома помилка, спробуйте ще раз.";
  }
}
