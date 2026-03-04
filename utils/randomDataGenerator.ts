import { faker, Faker } from "@faker-js/faker";
export class RandomDataUtil
{
    static getFirstName()
    {
        return faker.person.firstName();
    }
    static getlastName()
    {
       return faker.person.lastName();
    }
    static getFullName()
    {
        return faker.person.firstName();
    }
    static getEmail()
    {
        return faker.internet.email();
    }
    static getPhoneNumber()
    {
        return faker.phone.number();
    }
    static getPassword():string
    {
        return faker.location.state();
    }
    static getRandomCountry():string
    {
        return faker.location.country();
    }
    static getRandomState():string
    {
        return faker.location.state();
    }

    static getRandomCity():string{
        return faker.location.city();
    }
    static getRandomPin():string  {
        return faker.location.city();
    }

    static getRandomAddress():string
    {
        return faker.location.streetAddress();
    }
    static getRandomPassword(length:number=10):string
    {
        return faker.internet.password({length});
    }
    static getRandomAlphanumeric(length:number):string
    {
        return faker.string.alphanumeric({length});
    }
    static getRandomNumber(length:number):string
    {
        return faker.string.numeric({length});
    }
    static getRandomUUID():string
    {
        return faker.string.uuid();
    }
}