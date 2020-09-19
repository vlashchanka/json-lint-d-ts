interface HelloLowerCase {
    hello: "world";
}
interface HelloUpperCase {
    HELLO: "WORLD";
}

type HelloType = HelloLowerCase | HelloUpperCase;

type Root = HelloType
