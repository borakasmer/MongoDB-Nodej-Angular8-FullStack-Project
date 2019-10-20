export class Name {
    title: String;
    first: String;
    last: String;

    constructor() { }
}

export class Person {
    gender: String;
    email: String;
    username: String;
    name: {
        title: String,
        first: String,
        last: String
    };
    fullName: String;

    constructor() {
        this.gender = "male";
    }
}