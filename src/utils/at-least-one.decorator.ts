import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function AtLeastOne(
  property: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'atLeastOne',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedProperties] = args.constraints;
          const object = args.object as any;
          return relatedProperties.some(
            (prop: string) =>
              object[prop] !== undefined &&
              object[prop] !== null &&
              object[prop] !== '',
          );
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedProperties] = args.constraints;
          return `At least one of the following properties must be provided: ${relatedProperties.join(', ')}`;
        },
      },
    });
  };
}
